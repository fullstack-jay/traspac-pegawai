/**
 * Auth Service → Laravel /api/auth/*
 * Base: http://127.0.0.1:8000
 * Request body & response: camelCase
 */

import type { LoginCredentials, AuthUser } from '~/types/auth'
import { apiPost } from '~/utils/api'

export const authService = {
  /**
   * POST /api/auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const data = await apiPost<{
      id: number
      name: string
      username: string
      role: 'admin' | 'operator' | 'viewer'
      unitKerja: string
      token: string
    }>('/auth/login', credentials, false)

    return {
      id:        String(data.id),
      name:      data.name,
      username:  data.username,
      role:      data.role,
      unitKerja: data.unitKerja ?? '',
      token:     data.token,
    }
  },

  /**
   * POST /api/auth/logout
   */
  async logout(token: string): Promise<void> {
    await apiPost('/auth/logout', {}).catch(() => {})
  },

  /**
   * POST /api/auth/verify
   */
  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const data = await apiPost<any>('/auth/verify', {})
      return {
        id:        String(data.id),
        name:      data.name,
        username:  data.username,
        role:      data.role,
        unitKerja: data.unitKerja ?? '',
        token,
      }
    } catch {
      return null
    }
  },
}
