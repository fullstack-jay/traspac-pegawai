export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
  name: string
  role: 'admin' | 'operator' | 'viewer'
  unitKerja?: string
  token: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
