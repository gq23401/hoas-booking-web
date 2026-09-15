'use client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { getUser, clearToken } from '@/lib/auth'
import { authAPI } from '@/lib/api'
import { WashingMachine, Flame, LayoutDashboard, LogOut } from 'lucide-react'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const user = getUser()

  const handleLogout = async () => {
    try { await authAPI.logout() } catch {}
    clearToken()
    router.push('/auth/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/laundry', label: 'Laundry', icon: WashingMachine },
    { href: '/sauna', label: 'Sauna', icon: Flame },
  ]

  return (
    <>
      <nav className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-display font-bold text-navy tracking-widest text-sm">HOAS</span>
            <span className="font-display text-blue-accent text-sm">Booking</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display font-semibold text-sm transition-colors ${pathname === href ? 'bg-navy text-white' : 'text-slate-500 hover:text-navy hover:bg-slate-50'}`}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="font-body text-sm text-slate-500">{user.first_name} {user.last_name}</span>}
          <button onClick={handleLogout} className="flex items-center gap-2 font-display font-semibold text-sm text-slate-400 hover:text-navy transition-colors">
            <LogOut className="w-4 h-4" />Sign out
          </button>
        </div>
      </nav>
      <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="flex items-center gap-1">
          <span className="font-display font-bold text-navy tracking-widest text-sm">HOAS</span>
          <span className="font-display text-blue-accent text-sm">Booking</span>
        </div>
        {user && <span className="font-body text-xs text-slate-400">{user.first_name}</span>}
      </header>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-10">
        <div className="flex">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${pathname === href ? 'text-navy' : 'text-slate-400'}`}>
              <Icon className="w-5 h-5" />
              <span className="font-display font-semibold text-[10px] uppercase tracking-wider">{label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="flex-1 flex flex-col items-center gap-1 py-3 text-slate-400">
            <LogOut className="w-5 h-5" />
            <span className="font-display font-semibold text-[10px] uppercase tracking-wider">Out</span>
          </button>
        </div>
      </nav>
    </>
  )
}
