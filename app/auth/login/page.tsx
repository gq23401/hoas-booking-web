'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { setToken, setUser } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login(email, password)
      setToken(res.access_token)
      setUser(res.user)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand panel */}
      <div className="bg-navy lg:w-[42%] flex flex-col justify-between p-8 lg:p-14">
        <div>
          <span className="font-display font-bold text-white text-lg tracking-widest uppercase">HOAS</span>
          <span className="font-display text-blue-300 text-lg ml-2">Booking</span>
        </div>
        <div className="py-12 lg:py-0">
          <h1 className="font-display font-extrabold text-white text-4xl lg:text-5xl leading-tight">
            Your building,<br />your schedule.
          </h1>
          <p className="font-body text-blue-200 mt-4 text-lg leading-relaxed">
            Book laundry machines and saunas in your apartment building. Simple, fair, transparent.
          </p>
          <div className="mt-10 hidden lg:flex flex-col gap-2">
            {[{time:'07:00',type:'reserved'},{time:'09:00',type:'yours'},{time:'11:00',type:'reserved'},{time:'14:00',type:'available'}].map(({time, type}) => (
              <div key={time} className="flex items-center gap-3">
                <span className="font-display text-blue-400 text-xs w-12">{time}</span>
                <div className={`h-7 rounded flex items-center px-3 text-xs font-display font-semibold ${
                  type === 'yours' ? 'bg-blue-accent text-white w-28' :
                  type === 'available' ? 'bg-emerald-500 text-white w-32' :
                  'bg-white/10 text-white/40 w-20'
                }`}>
                  {type === 'yours' ? 'YOUR SLOT' : type === 'available' ? 'AVAILABLE' : 'RESERVED'}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="font-body text-blue-400 text-sm hidden lg:block">&copy; {new Date().getFullYear()} HOAS Booking</p>
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-14">
        <div className="w-full max-w-sm">
          <h2 className="font-display font-bold text-2xl text-navy">Sign in</h2>
          <p className="font-body text-slate-500 mt-1 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-blue-accent font-medium hover:underline">Register here</Link>
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label className="font-display text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Email address</label>
              <input type="email" className="input-field" placeholder="you@apartment.fi" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label className="font-display text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Password</label>
              <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-body">{error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-primary mt-2 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="font-display text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Demo credentials</p>
            <p className="font-body text-sm text-slate-600">
              <span className="font-medium">Email:</span> tenant@test.com<br />
              <span className="font-medium">Password:</span> password123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
