import { tboClient } from '@/lib/tbo'
import { MapPin, Star, Filter, SlidersHorizontal, Search } from 'lucide-react'
import Link from 'next/link'

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; checkIn?: string; checkOut?: string; guests?: string; priceRange?: string; rating?: string }>
}) {
  const params = await searchParams;
  let hotels = await tboClient.searchHotels(params)

  // Basic filtering logic (since we're using mock data)
  if (params.rating) {
    hotels = hotels.filter(h => h.StarRating >= parseInt(params.rating!))
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="text-blue-600" size={24} />
                Hotels in {params.city || 'your destination'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {hotels.length} properties found • {params.checkIn || 'anytime'} - {params.checkOut || 'anytime'}
              </p>
            </div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
            >
              <SlidersHorizontal size={18} /> Modify Search
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Filter size={20} className="text-blue-600" />
                <h2 className="font-bold text-lg">Filters</h2>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-3">
                  {['Under ₹2,000', '₹2,000 - ₹5,000', '₹5,000 - ₹10,000', 'Over ₹10,000'].map((range) => (
                    <label key={range} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-gray-600 group-hover:text-blue-600 transition">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-8 border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Star Rating</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2].map((star) => (
                    <label key={star} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <div className="flex items-center gap-1 text-yellow-500">
                          {Array(star).fill(0).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">({hotels.filter(h => h.StarRating === star).length})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Amenities</h3>
                <div className="space-y-3">
                  {['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Gym'].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-gray-600 group-hover:text-blue-600 transition">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results List */}
          <div className="lg:w-3/4">
            <div className="flex flex-col gap-6">
              {hotels.map((hotel: any) => (
                <div key={hotel.HotelCode} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="md:w-72 h-64 relative group">
                    <img
                      src={hotel.Images[0]}
                      alt={hotel.HotelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" fill="currentColor" />
                      <span className="text-sm font-bold">{hotel.StarRating}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition cursor-pointer">{hotel.HotelName}</h2>
                      </div>
                      
                      <p className="text-gray-500 flex items-center gap-1 text-sm mb-4">
                        <MapPin size={16} /> {hotel.Address}
                      </p>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-6">
                        {hotel.Description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {['Free Cancellation', 'Breakfast Included', 'No Prepayment'].map(tag => (
                          <span key={tag} className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t pt-6">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Price for 1 night</p>
                        <p className="text-3xl font-black text-blue-600">
                          ₹{hotel.Price.Amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">+ ₹{Math.round(hotel.Price.Amount * 0.12).toLocaleString()} taxes & fees</p>
                      </div>
                      
                      <Link
                        href={`/hotels/${hotel.HotelCode}`}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all transform active:scale-95 shadow-lg shadow-blue-200"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {hotels.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No hotels found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
