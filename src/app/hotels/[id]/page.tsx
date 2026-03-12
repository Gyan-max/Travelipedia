import { tboClient } from '@/lib/tbo'
import { MapPin, Star, CheckCircle2 } from 'lucide-react'
import BookingButton from '@/components/BookingButton'

export default async function HotelDetailsPage({ params }: { params: { id: string } }) {
  const hotel = await tboClient.getHotelDetails(params.id)

  // Mock booking data (normally from search params or session)
  const bookingData = {
    hotelName: hotel.HotelName,
    hotelCode: hotel.HotelCode,
    checkIn: '2026-03-20',
    checkOut: '2026-03-22',
    rooms: 1,
    guests: 2,
    city: 'Mumbai',
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-[50vh] overflow-hidden">
        <img src={hotel.Images[0]} alt={hotel.HotelName} className="w-full h-full object-cover" />
        <img src={hotel.Images[1]} alt={hotel.HotelName} className="w-full h-full object-cover hidden md:block" />
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Main Info */}
          <div className="md:w-2/3">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex bg-yellow-400 text-white px-2 py-1 rounded text-sm font-bold items-center gap-1">
                <Star size={14} fill="currentColor" /> {hotel.StarRating} Star Hotel
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{hotel.HotelName}</h1>
            <p className="text-gray-600 flex items-center gap-2 mb-8 text-lg">
              <MapPin size={20} /> {hotel.Address}
            </p>

            <div className="border-t border-b py-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {hotel.Description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.Amenities.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span className="text-lg font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="md:w-1/3">
            <div className="bg-white border rounded-2xl p-6 shadow-xl sticky top-24">
              <div className="mb-6 pb-6 border-b">
                <p className="text-gray-500 mb-1">Total Price for 2 nights</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600">₹{(hotel.Price.Amount * 2).toLocaleString()}</span>
                  <span className="text-gray-400 font-medium">incl. taxes</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Check-In</span>
                  <span className="font-semibold">{bookingData.checkIn}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Check-Out</span>
                  <span className="font-semibold">{bookingData.checkOut}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Guests</span>
                  <span className="font-semibold">{bookingData.guests}</span>
                </div>
              </div>

              <BookingButton 
                amount={hotel.Price.Amount * 2} 
                bookingData={bookingData} 
                type="HOTEL" 
              />
              
              <p className="text-center text-gray-400 text-xs mt-4">
                Secure payment via Razorpay. No cancellation charges up to 24h before check-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
