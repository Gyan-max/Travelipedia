import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, bookingData, type } = await request.json()

    // 1. Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    })

    // 2. Find internal DB user
    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('supabaseUid', user.id)
      .single()

    if (userError || !dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    // 3. Create Pending Booking in DB
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        userId: dbUser.id,
        type,
        status: 'PENDING',
        totalAmount: amount,
        razorpayOrderId: order.id,
      })
      .select()
      .single()

    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`)
    }

    // 4. Create Hotel Booking if applicable
    if (type === 'HOTEL') {
      const { error: hotelError } = await supabase
        .from('hotel_bookings')
        .insert({
          bookingId: booking.id,
          hotelName: bookingData.hotelName,
          hotelCode: bookingData.hotelCode,
          checkIn: new Date(bookingData.checkIn),
          checkOut: new Date(bookingData.checkOut),
          rooms: bookingData.rooms,
          guests: bookingData.guests,
          city: bookingData.city,
        })

      if (hotelError) {
        // Optional: Rollback booking or handle error
        console.error('Hotel Booking Error:', hotelError)
      }
    }

    return NextResponse.json({ order, bookingId: booking.id })
  } catch (error: any) {
    console.error('Booking Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
