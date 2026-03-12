import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'

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
    const supabase = await createClient()
    const { data: updatedBookingRaw, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'CONFIRMED',
        razorpayPaymentId: razorpay_payment_id,
      })
      .eq('id', bookingId)
      .select('*, hotel_bookings(*), users(*)')
      .single()

    if (updateError || !updatedBookingRaw) {
      throw new Error(`Failed to update booking: ${updateError.message}`)
    }

    // Map data for email/voucher
    const userRelation = Array.isArray(updatedBookingRaw.users) ? updatedBookingRaw.users[0] : updatedBookingRaw.users
    const hotelRelation = Array.isArray(updatedBookingRaw.hotel_bookings) ? updatedBookingRaw.hotel_bookings[0] : updatedBookingRaw.hotel_bookings

    const updatedBooking = {
      ...updatedBookingRaw,
      user: userRelation,
      hotelBooking: hotelRelation
    }

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
