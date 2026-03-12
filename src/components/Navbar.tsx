import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Plane, User as UserIcon, LogOut } from 'lucide-react'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
            <Plane className="rotate-45" />
            <span>Travelipedia</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/hotels" className="text-gray-600 hover:text-blue-600 font-medium transition">Hotels</Link>
            <Link href="/flights" className="text-gray-600 hover:text-blue-600 font-medium transition">Flights</Link>
            <Link href="/trains" className="text-gray-600 hover:text-blue-600 font-medium transition">Trains</Link>
            <Link href="/buses" className="text-gray-600 hover:text-blue-600 font-medium transition">Buses</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <UserIcon size={20} />
                  <span>Dashboard</span>
                </Link>
                <form action="/auth/signout" method="post">
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
