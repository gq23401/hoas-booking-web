import { getToken } from './auth'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}

export interface AuthResponse {
  access_token: string
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
    room_count?: number
  }
}

export const authAPI = {
  login: (email: string, password: string) =>
    req<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data: { email: string; password: string; first_name: string; last_name: string; lease_code: string }) =>
    req<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  logout: () => req('/auth/logout', { method: 'POST' }),
}

export interface Booking {
  id: string
  machine_id: string
  starts_at: string
  ends_at: string
  status: string
}

export interface TimeSlot {
  starts_at: string
  ends_at: string
  is_available: boolean
}

export const laundryAPI = {
  getAvailability: (machineId: string, date: string) =>
    req<TimeSlot[]>(`/laundry/machines/${machineId}/availability?date=${date}`),

  book: (machineId: string, startsAt: string) =>
    req<Booking>('/laundry/bookings', {
      method: 'POST',
      body: JSON.stringify({ machine_id: machineId, starts_at: startsAt }),
    }),

  cancelBooking: (bookingId: string) =>
    req(`/laundry/bookings/${bookingId}`, { method: 'DELETE' }),

  getMyBookings: () => req<Booking[]>('/laundry/bookings/my'),
}
