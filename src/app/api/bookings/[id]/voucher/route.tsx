import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { BookingVoucher } from '@/lib/pdf-generator'
import React from 'react'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, hotel_bookings(*), users(*)')
      .eq('id', (await params).id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Security check: Ensure the user owns this booking
    const userRelation = Array.isArray(booking.users) ? booking.users[0] : booking.users
    
    if (userRelation?.supabaseUid !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (booking.status !== 'CONFIRMED') {
      return NextResponse.json({ error: 'Booking not confirmed' }, { status: 400 })
    }

    // Map data to match what BookingVoucher expects
    const mappedBooking = {
      ...booking,
      hotelBooking: Array.isArray(booking.hotel_bookings) ? booking.hotel_bookings[0] : booking.hotel_bookings,
      user: userRelation
    }

    // Generate PDF
    const buffer = await renderToBuffer(<BookingVoucher booking={mappedBooking} />)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="voucher-${booking.id.substring(0, 8)}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('Voucher Generation Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
