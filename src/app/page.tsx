import SearchHotels from '@/components/SearchHotels'
import { Plane, Hotel, Train, Bus } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-blue-900 flex items-center justify-center text-center text-white px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Discover Your Next Adventure</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">Book hotels, flights, and more with Travelipedia.</p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="bg-white/20 p-4 rounded-full group-hover:bg-blue-600 transition">
                <Hotel size={28} />
              </div>
              <span className="font-medium">Hotels</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="bg-white/20 p-4 rounded-full group-hover:bg-blue-600 transition">
                <Plane size={28} />
              </div>
              <span className="font-medium">Flights</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="bg-white/20 p-4 rounded-full group-hover:bg-blue-600 transition">
                <Train size={28} />
              </div>
              <span className="font-medium">Trains</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="bg-white/20 p-4 rounded-full group-hover:bg-blue-600 transition">
                <Bus size={28} />
              </div>
              <span className="font-medium">Buses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Container */}
      <section className="max-w-6xl mx-auto px-4 -mt-10">
        <SearchHotels />
      </section>

      {/* Featured Destinations */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570160897040-30430ade2211?auto=format&fit=crop&q=80&w=600' },
            { name: 'Goa', image: 'https://images.unsplash.com/photo-1512789172734-7b9803a44bbf?auto=format&fit=crop&q=80&w=600' },
            { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600' },
          ].map((city) => (
            <div key={city.name} className="relative h-64 rounded-xl overflow-hidden group cursor-pointer shadow-md">
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">{city.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
