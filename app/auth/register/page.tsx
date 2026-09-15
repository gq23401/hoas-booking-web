'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { setToken, setUser } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', lease_code: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      setToken(res.access_token)
      setUser(res.user)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cream">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="font-display font-bold text-navy text-xl tracking-widest">HOAS</span>
            <span className="font-display text-blue-accent text-xl">Booking</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-navy">Create account</h1>
          <p className="font-body text-slate-500 mt-2 text-sm">You&apos;ll need the lease code from your building manager.</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-display text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">First name</label>
                <input className="input-field" placeholder="Matti" value={form.first_name} onChange={set('first_name')} required />
              </div>
              <div>
                <label className="font-display text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Last name</label>
                <input className="input-field" placeholder="Virtanen" value={form.last_name} onChange={set('last_name')} required />
              </div>
            </div>
            <div>
              <label className="font-display text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Email</label>
              <input type="email" className="input-field" placeholder="matti@email.fi" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="font-display text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Password</label>
              <input type="password" className="input-field" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
            </div>
            <div>
              <label className="font-display text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Lease code</label>
              <input className="input-field font-display tracking-widest uppercase" placeholder="LEASE-001" value={form.lease_code} onChange={set('lease_code')} required />
              <p className="font-body text-xs text-slate-400 mt-1">Provided by your building manager on move-in</p>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-body">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary mt-2 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
        <p className="text-center font-body text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-accent font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
