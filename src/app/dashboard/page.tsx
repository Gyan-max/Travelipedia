import { createClient } from '@/utils/supabase/server'
// import prisma from '@/lib/prisma' (Removing broken prisma import)
import { redirect } from 'next/navigation'
import { Hotel, Plane, Calendar, CheckCircle, Clock, XCircle, FileText, Download } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string; status?: string }>
}) {
  const params = await searchParams;
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Find the internal user to get their bookings using Supabase instead of Prisma
  const { data: dbUser, error: userError } = await supabase
    .from('users')
    .select(`
      *,
      bookings (
        *,
        hotel_bookings (*)
      )
    `)
    .eq('supabaseUid', user.id)
    .single()

  if (userError || !dbUser) {
    // If user exists in Supabase but not in our DB, they might need to be synced.
    redirect('/')
  }

  // Map the join results to match the expected format (Supabase returns arrays for joins)
  const bookings = (dbUser.bookings || []).map((b: any) => ({
    ...b,
    hotelBooking: b.hotel_bookings?.[0] || null,
    totalAmount: b.totalAmount || 0,
    createdAt: b.created_at || b.createdAt
  })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Success Alert */}
        {params.status === 'success' && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-r-xl mb-12 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-green-500 p-3 rounded-full text-white">
              <CheckCircle size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Booking Confirmed!</h2>
              <p className="text-lg">Your reservation has been successfully placed. A confirmation email with your voucher is on its way.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {dbUser.name}</h1>
            <p className="text-gray-600 mt-1">Manage your bookings and travel preferences.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border text-center">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border shadow-sm">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Calendar size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">You haven't made any bookings yet. Start planning your next trip today!</p>
              <Link href="/hotels" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition inline-block">
                Browse Hotels
              </Link>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition">
                <div className="p-6 flex flex-col lg:flex-row gap-8">
                  
                  {/* Icon & Type */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className={`p-4 rounded-2xl ${booking.type === 'HOTEL' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {booking.type === 'HOTEL' ? <Hotel size={32} /> : <Plane size={32} />}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{booking.type}</p>
                      <h3 className="text-xl font-bold text-gray-900">
                        {booking.hotelBooking?.hotelName || 'Travel Service'}
                      </h3>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {booking.status === 'CONFIRMED' ? (
                          <span className="flex items-center gap-1.5 text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                            <CheckCircle size={14} /> Confirmed
                          </span>
                        ) : booking.status === 'PENDING' ? (
                          <span className="flex items-center gap-1.5 text-sm font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-200">
                            <Clock size={14} /> Pending
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-sm font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                            <XCircle size={14} /> Cancelled
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Booking Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                      <p className="font-bold text-gray-900 text-lg">
                        ₹{booking.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 lg:border-l lg:pl-8">
                    {booking.status === 'CONFIRMED' && (
                      <>
                        <a 
                          href={`/api/bookings/${booking.id}/voucher`}
                          className="flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-blue-100"
                        >
                          <Download size={18} /> Voucher
                        </a>
                        <button className="flex items-center gap-2 text-gray-600 font-semibold hover:bg-gray-50 px-4 py-2 rounded-lg transition border border-transparent hover:border-gray-100">
                          <FileText size={18} /> Invoice
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
