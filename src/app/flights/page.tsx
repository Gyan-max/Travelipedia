import { Plane, Search, Filter, MapPin, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; date?: string; passengers?: string }>
}) {
  const params = await searchParams;

  // Mock flight data
  const flights = [
    {
      id: 'F101',
      airline: 'Air India',
      logo: 'https://www.airindia.in/images/airindia-logo.png',
      from: params.from || 'Delhi (DEL)',
      to: params.to || 'Mumbai (BOM)',
      departure: '08:00 AM',
      arrival: '10:15 AM',
      duration: '2h 15m',
      price: 5450,
      stops: 'Non-stop'
    },
    {
      id: 'F102',
      airline: 'IndiGo',
      logo: 'https://www.goindigo.in/content/dam/goindigo/6e-website/home/indigo-logo.png',
      from: params.from || 'Delhi (DEL)',
      to: params.to || 'Mumbai (BOM)',
      departure: '10:30 AM',
      arrival: '12:45 PM',
      duration: '2h 15m',
      price: 4890,
      stops: 'Non-stop'
    },
    {
      id: 'F103',
      airline: 'Vistara',
      logo: 'https://www.airvistara.com/content/dam/airvistara/header/Vistara_logo.png',
      from: params.from || 'Delhi (DEL)',
      to: params.to || 'Mumbai (BOM)',
      departure: '02:00 PM',
      arrival: '04:20 PM',
      duration: '2h 20m',
      price: 6200,
      stops: 'Non-stop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Plane className="rotate-45" size={32} />
            Flights from {params.from || 'Delhi'} to {params.to || 'Mumbai'}
          </h1>
          <p className="mt-2 opacity-80">{params.date || 'Anytime'} • {params.passengers || '1'} Traveler</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-8">
              <div className="flex items-center gap-2 border-b pb-4">
                <Filter size={20} className="text-blue-600" />
                <h2 className="font-bold text-lg">Filters</h2>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Stops</h3>
                <div className="space-y-3">
                  {['Non-stop', '1 Stop', '2+ Stops'].map(stop => (
                    <label key={stop} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                      <span className="text-gray-600 group-hover:text-blue-600 transition">{stop}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 text-gray-900">Airlines</h3>
                <div className="space-y-3">
                  {['Air India', 'IndiGo', 'Vistara', 'SpiceJet'].map(airline => (
                    <label key={airline} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                      <span className="text-gray-600 group-hover:text-blue-600 transition">{airline}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Flight List */}
          <div className="lg:w-3/4 space-y-4">
            {flights.map(flight => (
              <div key={flight.id} className="bg-white rounded-2xl border p-6 hover:shadow-lg transition flex flex-col md:flex-row items-center gap-8">
                <div className="flex items-center gap-4 md:w-48 text-center md:text-left">
                  <div className="bg-gray-100 p-2 rounded-lg w-12 h-12 flex items-center justify-center">
                    <Plane size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{flight.airline}</p>
                    <p className="text-xs text-gray-500">{flight.id}</p>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-between gap-4 w-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{flight.departure}</p>
                    <p className="text-sm text-gray-500 font-medium">{flight.from.split(' ')[0]}</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center max-w-[120px]">
                    <p className="text-xs text-gray-400 font-bold mb-1">{flight.duration}</p>
                    <div className="w-full h-px bg-gray-200 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <p className="text-xs text-blue-600 font-bold mt-1">{flight.stops}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{flight.arrival}</p>
                    <p className="text-sm text-gray-500 font-medium">{flight.to.split(' ')[0]}</p>
                  </div>
                </div>

                <div className="md:w-48 flex flex-col items-center md:items-end border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8 gap-2">
                  <p className="text-3xl font-black text-blue-600">₹{flight.price.toLocaleString()}</p>
                  <button className="bg-blue-600 text-white w-full py-2 rounded-lg font-bold hover:bg-blue-700 transition">
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
