'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookingButtonProps {
  amount: number
  bookingData: any
  type: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function BookingButton({ amount, bookingData, type }: BookingButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBooking = async () => {
    setLoading(true)
    try {
      // 1. Create order on server
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, bookingData, type }),
      })

      const data = await res.json()

      if (data.error) {
        if (res.status === 401) {
          router.push('/login')
          return
        }
        throw new Error(data.error)
      }

      // 2. Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'Travelipedia',
          description: `Booking for ${bookingData.hotelName || 'Travel Service'}`,
          order_id: data.order.id,
          handler: async function (response: any) {
            // 3. Verify payment on server
            const verifyRes = await fetch('/api/bookings/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: data.bookingId,
              }),
            })

            if (verifyRes.ok) {
              router.push(`/dashboard?bookingId=${data.bookingId}&status=success`)
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          },
          prefill: {
            name: '',
            email: '',
          },
          theme: {
            color: '#2563eb',
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (error: any) {
      console.error('Payment Error:', error)
      alert(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBooking}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-700 transition disabled:bg-blue-300"
    >
      {loading ? 'Processing...' : 'Book Now'}
    </button>
  )
}
