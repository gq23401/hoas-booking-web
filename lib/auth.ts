export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('hoas_token')
}
export const setToken = (token: string) => localStorage.setItem('hoas_token', token)
export const clearToken = () => {
  localStorage.removeItem('hoas_token')
  localStorage.removeItem('hoas_user')
}
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('hoas_user')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}
export const setUser = (user: User) => localStorage.setItem('hoas_user', JSON.stringify(user))
export const isLoggedIn = (): boolean => !!getToken()

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  room_count?: number
}
