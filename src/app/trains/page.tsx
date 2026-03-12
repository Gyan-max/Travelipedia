import { Train, Search, Filter, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function TrainsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; date?: string; passengers?: string }>
}) {
  const params = await searchParams;

  // Mock train data
  const trains = [
    {
      id: '12951',
      name: 'Rajdhani Express',
      from: params.from || 'Mumbai Central',
      to: params.to || 'New Delhi',
      departure: '04:40 PM',
      arrival: '08:30 AM',
      duration: '15h 50m',
      price: 2850,
      class: '3A, 2A, 1A'
    },
    {
      id: '12925',
      name: 'Paschim Express',
      from: params.from || 'Mumbai Central',
      to: params.to || 'Kalka',
      departure: '11:25 AM',
      arrival: '04:45 PM',
      duration: '29h 20m',
      price: 1250,
      class: 'SL, 3A, 2A'
    },
    {
      id: '12137',
      name: 'Punjab Mail',
      from: params.from || 'CSMT Mumbai',
      to: params.to || 'Firozpur',
      departure: '07:35 PM',
      arrival: '05:10 AM',
      duration: '33h 35m',
      price: 1380,
      class: 'SL, 3A, 2A'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-orange-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Train size={32} />
            Trains from {params.from || 'Mumbai'} to {params.to || 'Delhi'}
          </h1>
          <p className="mt-2 opacity-80 text-orange-50">{params.date || 'Anytime'} • {params.passengers || '1'} Passenger</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-8">
              <div className="flex items-center gap-2 border-b pb-4">
                <Filter size={20} className="text-orange-600" />
                <h2 className="font-bold text-lg">Filters</h2>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Class</h3>
                <div className="space-y-3">
                  {['1A', '2A', '3A', 'SL', 'CC'].map(cls => (
                    <label key={cls} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-orange-600" />
                      <span className="text-gray-600 group-hover:text-orange-600 transition">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 text-gray-900">Departure Time</h3>
                <div className="space-y-3">
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                    <label key={time} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-orange-600" />
                      <span className="text-gray-600 group-hover:text-orange-600 transition">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Train List */}
          <div className="lg:w-3/4 space-y-4">
            {trains.map(train => (
              <div key={train.id} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-64">
                  <h3 className="font-bold text-xl text-gray-900">{train.name}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">#{train.id}</p>
                  <div className="flex gap-1 mt-4">
                    {train.class.split(', ').map(c => (
                      <span key={c} className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-between gap-4 w-full border-t md:border-t-0 pt-6 md:pt-0">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{train.departure}</p>
                    <p className="text-sm text-gray-500 font-medium">Starts</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center max-w-[150px]">
                    <p className="text-xs text-gray-400 font-bold mb-1">{train.duration}</p>
                    <div className="w-full h-0.5 bg-orange-100 relative">
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-200"></div>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-600"></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{train.arrival}</p>
                    <p className="text-sm text-gray-500 font-medium">Arrives</p>
                  </div>
                </div>

                <div className="md:w-48 flex flex-col items-center md:items-end border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8 gap-2">
                  <p className="text-3xl font-black text-orange-600">₹{train.price.toLocaleString()}</p>
                  <button className="bg-orange-600 text-white w-full py-2 rounded-lg font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-100">
                    Book Now
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
