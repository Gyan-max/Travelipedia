import { Bus, Search, Filter, MapPin, Clock, Star } from 'lucide-react'
import Link from 'next/link'

export default async function BusesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; date?: string; passengers?: string }>
}) {
  const params = await searchParams;

  // Mock bus data
  const buses = [
    {
      id: 'B101',
      operator: 'Zingbus',
      type: 'A/C Sleeper (2+1)',
      from: params.from || 'Delhi',
      to: params.to || 'Jaipur',
      departure: '10:00 PM',
      arrival: '04:30 AM',
      duration: '6h 30m',
      price: 850,
      rating: 4.5,
      seats: 12
    },
    {
      id: 'B102',
      operator: 'SRS Travels',
      type: 'A/C Semi Sleeper (2+2)',
      from: params.from || 'Delhi',
      to: params.to || 'Jaipur',
      departure: '11:15 PM',
      arrival: '05:45 AM',
      duration: '6h 30m',
      price: 720,
      rating: 4.2,
      seats: 8
    },
    {
      id: 'B103',
      operator: 'RSRTC',
      type: 'Super Luxury A/C',
      from: params.from || 'Delhi',
      to: params.to || 'Jaipur',
      departure: '06:00 AM',
      arrival: '12:00 PM',
      duration: '6h 00m',
      price: 950,
      rating: 3.9,
      seats: 25
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bus size={32} />
            Buses from {params.from || 'Delhi'} to {params.to || 'Jaipur'}
          </h1>
          <p className="mt-2 opacity-80 text-green-50">{params.date || 'Anytime'} • {params.passengers || '1'} Seat</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-8">
              <div className="flex items-center gap-2 border-b pb-4">
                <Filter size={20} className="text-green-700" />
                <h2 className="font-bold text-lg">Filters</h2>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Bus Type</h3>
                <div className="space-y-3">
                  {['A/C Seater', 'A/C Sleeper', 'Non-A/C', 'Volvo/Luxury'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-700" />
                      <span className="text-gray-600 group-hover:text-green-700 transition">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 text-gray-900">Operator</h3>
                <div className="space-y-3">
                  {['Zingbus', 'SRS Travels', 'RSRTC', 'VRL Travels'].map(op => (
                    <label key={op} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-700" />
                      <span className="text-gray-600 group-hover:text-green-700 transition">{op}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Bus List */}
          <div className="lg:w-3/4 space-y-4">
            {buses.map(bus => (
              <div key={bus.id} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-64">
                  <h3 className="font-bold text-xl text-gray-900">{bus.operator}</h3>
                  <p className="text-sm text-gray-500 font-medium">{bus.type}</p>
                  <div className="flex items-center gap-1 mt-3">
                    <div className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> {bus.rating}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">(250 ratings)</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-between gap-4 w-full border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{bus.departure}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">{bus.from}</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center max-w-[150px]">
                    <p className="text-xs text-gray-400 font-bold mb-1">{bus.duration}</p>
                    <div className="w-full h-0.5 bg-green-100 flex items-center justify-center">
                      <Bus size={12} className="text-green-700" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{bus.arrival}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">{bus.to}</p>
                  </div>
                </div>

                <div className="md:w-56 flex flex-col items-center md:items-end border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8 gap-1">
                  <p className="text-xs text-gray-400 font-bold uppercase">Price starting from</p>
                  <p className="text-3xl font-black text-green-700">₹{bus.price.toLocaleString()}</p>
                  <p className="text-xs text-green-600 font-bold mb-2">{bus.seats} seats left</p>
                  <button className="bg-green-700 text-white w-full py-2 rounded-lg font-bold hover:bg-green-800 transition shadow-lg shadow-green-100">
                    Select Seats
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
