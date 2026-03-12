import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { BookingVoucher } from '@/lib/pdf-generator'
import React from 'react'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        hotelBooking: true,
        user: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Security check: Ensure the user owns this booking
    if (booking.user.supabaseUid !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (booking.status !== 'CONFIRMED') {
      return NextResponse.json({ error: 'Booking not confirmed' }, { status: 400 })
    }

    // Generate PDF
    const buffer = await renderToBuffer(<BookingVoucher booking={booking} />)

    return new NextResponse(buffer, {
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
