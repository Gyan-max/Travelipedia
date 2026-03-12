'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Search, MapPin, Users } from 'lucide-react'

export default function SearchHotels() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({
      city,
      checkIn,
      checkOut,
      guests: guests.toString(),
    })
    router.push(`/hotels?${params.toString()}`)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg -mt-12 relative z-10">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin size={16} /> Destination
          </label>
          <input
            type="text"
            placeholder="Where are you going?"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar size={16} /> Check-In
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar size={16} /> Check-Out
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users size={16} /> Guests
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
            >
              <Search size={20} /> Search
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
