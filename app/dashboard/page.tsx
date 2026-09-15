'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { WashingMachine, CalendarDays, ChevronRight, Zap } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { laundryAPI, type Booking } from '@/lib/api'
import { isLoggedIn, getUser } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const user = getUser()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/auth/login'); return }
    laundryAPI.getMyBookings().then(setBookings).catch(console.error).finally(() => setLoading(false))
  }, [router])

  const quota = user?.room_count ? user.room_count * 5 : 0
  const used = bookings.length
  const pct = quota > 0 ? Math.round((used / quota) * 100) : 0

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navigation />
      <main className="max-w-2xl mx-auto px-5 py-6 lg:py-10">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy">
            Good {getGreeting()}, {user?.first_name ?? 'Tenant'}.
          </h1>
          <p className="font-body text-slate-500 mt-1">
            {bookings.length === 0 ? 'You have no upcoming reservations.' : `${bookings.length} upcoming reservation${bookings.length !== 1 ? 's' : ''}.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link href="/laundry" className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group">
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-navy transition-colors">
              <WashingMachine className="w-5 h-5 text-navy group-hover:text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-navy text-sm">Book Laundry</p>
              <p className="font-body text-xs text-slate-400 mt-0.5">07:00 – 22:00</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 self-end" />
          </Link>
          <div className="card p-5 flex flex-col gap-3 opacity-60">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-display font-bold text-navy text-sm">Book Sauna</p>
              <p className="font-body text-xs text-slate-400 mt-0.5">Thu – Sun</p>
            </div>
            <span className="text-[10px] font-display font-semibold text-slate-300 tracking-wider uppercase self-end">Coming soon</span>
          </div>
        </div>

        {quota > 0 && (
          <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider">Monthly quota</p>
              <span className="font-display font-bold text-sm text-navy">{used} / {quota} slots</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${pct >= 80 ? 'bg-amber-400' : 'bg-blue-accent'}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="font-body text-xs text-slate-400 mt-2">{quota - used} slots remaining this month</p>
          </div>
        )}

        <div>
          <h2 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Your reservations</h2>
          {loading ? (
            <div className="flex flex-col gap-3">{[...Array(3)].map((_, i) => <div key={i} className="card p-4 animate-pulse h-16 bg-slate-50" />)}</div>
          ) : bookings.length === 0 ? (
            <div className="card p-8 text-center">
              <CalendarDays className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="font-display font-semibold text-slate-400">No upcoming bookings</p>
              <p className="font-body text-sm text-slate-300 mt-1">Book a laundry slot to get started</p>
              <Link href="/laundry" className="btn-primary inline-flex mt-4 text-sm py-2 px-5">Book now</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {bookings.map(b => (
                <BookingItem key={b.id} booking={b} onCancel={() => setBookings(prev => prev.filter(x => x.id !== b.id))} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function BookingItem({ booking, onCancel }: { booking: Booking; onCancel: () => void }) {
  const start = parseISO(booking.starts_at)
  const end = parseISO(booking.ends_at)
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!confirm('Cancel this booking?')) return
    setCancelling(true)
    try { await laundryAPI.cancelBooking(booking.id); onCancel() }
    catch (e: unknown) { alert(e instanceof Error ? e.message : 'Could not cancel') }
    finally { setCancelling(false) }
  }

  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
        <WashingMachine className="w-5 h-5 text-navy" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-sm text-navy">{format(start, 'EEE dd MMM')} · {format(start, 'HH:mm')}–{format(end, 'HH:mm')}</p>
        <p className="font-body text-xs text-slate-400 truncate">Machine {booking.machine_id.slice(-4).toUpperCase()} · {booking.status}</p>
      </div>
      <button onClick={handleCancel} disabled={cancelling} className="text-xs font-display font-semibold text-red-400 hover:text-red-600 transition-colors shrink-0 disabled:opacity-50">
        {cancelling ? '…' : 'Cancel'}
      </button>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
