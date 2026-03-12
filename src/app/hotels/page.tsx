import { tboClient } from '@/lib/tbo'
import { MapPin, Star } from 'lucide-react'
import Link from 'next/link'

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: { city?: string; checkIn?: string; checkOut?: string; guests?: string }
}) {
  const hotels = await tboClient.searchHotels(searchParams)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Hotels in {searchParams.city || 'your destination'}
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {hotels.map((hotel: any) => (
            <div key={hotel.HotelCode} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-100">
              <div className="md:w-1/3 h-64">
                <img
                  src={hotel.Images[0]}
                  alt={hotel.HotelName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{hotel.HotelName}</h2>
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      <Star size={16} fill="currentColor" />
                      <span className="font-semibold">{hotel.StarRating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 flex items-center gap-2 mb-4">
                    <MapPin size={18} /> {hotel.Address}
                  </p>
                  
                  <p className="text-gray-700 line-clamp-2 mb-4">
                    {hotel.Description}
                  </p>
                </div>

                <div className="flex justify-between items-end border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Price per night</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{hotel.Price.Amount.toLocaleString()}
                    </p>
                  </div>
                  
                  <Link
                    href={`/hotels/${hotel.HotelCode}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
