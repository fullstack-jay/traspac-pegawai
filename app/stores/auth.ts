import { defineStore } from 'pinia'
import { authService } from '~/services/authService'
import type { AuthUser, LoginCredentials } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    loading: false,
    error: null as string | null,
    _hydrated: false as boolean,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isOperator: (state) => state.user?.role === 'admin' || state.user?.role === 'operator',
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      try {
        const user = await authService.login(credentials)
        this.user = user
        // Persist to localStorage
        if (import.meta.client) {
          localStorage.setItem('auth_user', JSON.stringify(user))
        }
        return user
      } catch (err: any) {
        this.error = err.message || 'Login gagal'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      if (this.user?.token) {
        await authService.logout(this.user.token).catch(() => {})
      }
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem('auth_user')
      }
    },

    restoreSession() {
      // Skip if already hydrated
      if (this._hydrated) return

      if (import.meta.client) {
        const stored = localStorage.getItem('auth_user')
        if (stored) {
          try {
            this.user = JSON.parse(stored)
            this._hydrated = true
          } catch {
            localStorage.removeItem('auth_user')
          }
        }
      }
    },
  },
})
