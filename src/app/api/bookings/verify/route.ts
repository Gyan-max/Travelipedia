import { NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = await request.json()

    // 1. Verify Signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // 2. Update Booking Status in DB
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        razorpayPaymentId: razorpay_payment_id,
      },
      include: {
        hotelBooking: true,
        user: true
      }
    })

    // 3. Generate PDF and Send Email
    try {
      const { resend } = await import('@/lib/resend')
      const { renderToBuffer } = await import('@react-pdf/renderer')
      const { BookingVoucher } = await import('@/lib/pdf-generator')
      const React = await import('react')

      const buffer = await renderToBuffer(React.createElement(BookingVoucher, { booking: updatedBooking }))

      await resend.emails.send({
        from: 'Travelipedia <bookings@travelipedia.com>',
        to: [updatedBooking.user.email],
        subject: `Booking Confirmed: ${updatedBooking.hotelBooking?.hotelName}`,
        html: `
          <h1>Your booking is confirmed!</h1>
          <p>Hi ${updatedBooking.user.name},</p>
          <p>Thank you for booking with Travelipedia. Your stay at <strong>${updatedBooking.hotelBooking?.hotelName}</strong> is confirmed.</p>
          <p>Please find your booking voucher attached to this email.</p>
          <br/>
          <p>Team Travelipedia</p>
        `,
        attachments: [
          {
            filename: `voucher-${updatedBooking.id.substring(0, 8)}.pdf`,
            content: buffer,
          },
        ],
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // We don't fail the request if email fails, but we log it
    }

    return NextResponse.json({ success: true, booking: updatedBooking })
  } catch (error: any) {
    console.error('Verification Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
