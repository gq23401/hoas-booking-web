'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { laundryAPI, type TimeSlot } from '@/lib/api'
import { isLoggedIn } from '@/lib/auth'

const DEMO_MACHINE_ID = '00000000-0000-0000-0000-000000000011'
const DEMO_MACHINE_NAME = 'Washing Machine 1 · Staircase B'

export default function LaundryPage() {
  const router = useRouter()
  const [date, setDate] = useState(addDays(new Date(), 1))
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/auth/login'); return }
  }, [router])

  const loadSlots = useCallback(async () => {
    setLoading(true); setSlots([])
    try {
      const data = await laundryAPI.getAvailability(DEMO_MACHINE_ID, format(date, 'yyyy-MM-dd'))
      setSlots(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [date])

  useEffect(() => { loadSlots() }, [loadSlots])

  const handleBook = async (slot: TimeSlot) => {
    if (!slot.is_available) return
    if (!confirm(`Book ${formatTime(slot.starts_at)}–${formatTime(slot.ends_at)} on ${format(date, 'EEE dd MMM')}?`)) return
    setBooking(slot.starts_at)
    try {
      await laundryAPI.book(DEMO_MACHINE_ID, slot.starts_at)
      setSuccess(slot.starts_at)
      await loadSlots()
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Booking failed') }
    finally { setBooking(null) }
  }

  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <Navigation />
      <main className="max-w-lg mx-auto px-5 py-6 lg:py-10">
        <div className="mb-6">
          <h1 className="font-display font-extrabold text-2xl text-navy">Book Laundry</h1>
          <p className="font-body text-slate-500 text-sm mt-1">{DEMO_MACHINE_NAME}</p>
        </div>

        <div className="card p-4 flex items-center justify-between mb-6">
          <button onClick={() => setDate(d => addDays(d, -1))} disabled={isToday} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft className="w-4 h-4 text-navy" />
          </button>
          <div className="text-center">
            <p className="font-display font-bold text-navy text-sm">{format(date, 'EEEE')}</p>
            <p className="font-display font-extrabold text-2xl text-navy leading-none">{format(date, 'd MMM')}</p>
          </div>
          <button onClick={() => setDate(d => addDays(d, 1))} className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-navy" />
          </button>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="font-display font-bold text-emerald-800 text-sm">Booking confirmed!</p>
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-4">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" /><span className="font-display text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Available</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-100 border border-slate-200" /><span className="font-display text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Reserved</span></div>
          </div>
          {loading ? (
            <div className="flex flex-col">{[...Array(8)].map((_, i) => <div key={i} className="flex items-center px-5 py-3 border-b border-slate-50 animate-pulse"><div className="w-12 h-3 bg-slate-100 rounded mr-4" /><div className="flex-1 h-8 bg-slate-100 rounded-lg" /></div>)}</div>
          ) : slots.length === 0 ? (
            <div className="p-8 text-center font-body text-slate-400 text-sm">No slots available for this date</div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-50">
              {slots.map(slot => {
                const isBooking = booking === slot.starts_at
                const wasBooked = success === slot.starts_at && !slot.is_available
                return (
                  <div key={slot.starts_at} className="flex items-center px-5 py-2.5 gap-4">
                    <span className="font-display font-semibold text-sm text-slate-400 w-14 shrink-0">{formatTime(slot.starts_at)}</span>
                    <button onClick={() => handleBook(slot)} disabled={!slot.is_available || !!isBooking} className={`flex-1 h-9 rounded-lg text-xs font-display font-bold tracking-wide uppercase transition-all duration-150 ${wasBooked ? 'bg-blue-accent text-white border border-blue-600' : slot.is_available ? 'slot-available' : 'slot-reserved'} ${isBooking ? 'animate-pulse' : ''}`}>
                      {isBooking ? 'Booking…' : wasBooked ? '✓ Your booking' : slot.is_available ? 'Available' : 'Reserved'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <p className="font-body text-xs text-slate-400 text-center mt-4">Cancellations within 12 hours count toward your monthly quota.</p>
      </main>
    </div>
  )
}

function formatTime(isoStr: string): string {
  try { return format(parseISO(isoStr), 'HH:mm') } catch { return '' }
}
