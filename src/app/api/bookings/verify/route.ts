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

    // TODO: Generate PDF Voucher and Invoice
    // TODO: Send Email with Attachments

    return NextResponse.json({ success: true, booking: updatedBooking })
  } catch (error: any) {
    console.error('Verification Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
