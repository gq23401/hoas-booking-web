'use client'
import Navigation from '@/components/Navigation'
import { Flame } from 'lucide-react'

export default function SaunaPage() {
  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <Navigation />
      <main className="max-w-lg mx-auto px-5 py-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
          <Flame className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-navy">Sauna Booking</h1>
        <p className="font-body text-slate-500 mt-3 max-w-xs">
          Sauna bookings are available Thursday through Sunday, 16:00–21:00. This feature is coming soon.
        </p>
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left w-full max-w-xs">
          <p className="font-display font-bold text-xs text-amber-600 uppercase tracking-wider mb-2">When it launches</p>
          <ul className="font-body text-sm text-amber-800 space-y-1">
            <li>· 1 slot per week per tenant</li>
            <li>· Thu–Sun, 16:00–21:00</li>
            <li>· 5 hourly slots per day</li>
            <li>· No refunds on cancellation</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
