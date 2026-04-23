/**
 * API Helper — semua request ke Laravel backend
 * Base URL: http://127.0.0.1:8000
 */

function getToken(): string {
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem('auth_user')
      if (stored) return JSON.parse(stored).token || ''
    } catch {}
  }
  return ''
}

function getBaseUrl(): string {
  const config = useRuntimeConfig()
  return config.public.apiBase as string
}

export async function apiPost<T = any>(
  path: string,
  body: Record<string, any> = {},
  withAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (withAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await $fetch<{ success: boolean; data?: any; message?: string; errors?: any; meta?: any }>(
      `${getBaseUrl()}/api${path}`,
      {
        method: 'POST',
        headers,
        body,
      }
    )

    if (!res.success) {
      throw new Error(res.message || 'Terjadi kesalahan')
    }

    // Jika response punya meta (pagination), return full { data, meta }
    if (res.meta !== undefined && res.meta !== null) {
      return { data: res.data, meta: res.meta } as T
    }

    return res.data as T
  } catch (err: any) {
    const errorMessage = err.data?.message || err.message || 'Terjadi kesalahan'
    throw new Error(errorMessage)
  }
}

/**
 * Khusus untuk endpoint pagination — selalu return { data, meta }
 */
export async function apiPostList<T = any>(
  path: string,
  body: Record<string, any> = {}
): Promise<{ data: T[]; meta: any }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await $fetch<{ success: boolean; data: T[]; meta: any; message?: string }>(
      `${getBaseUrl()}/api${path}`,
      { method: 'POST', headers, body }
    )

    if (!res.success) throw new Error(res.message || 'Terjadi kesalahan')

    return { data: res.data ?? [], meta: res.meta ?? {} }
  } catch (err: any) {
    const errorMessage = err.data?.message || err.message || 'Terjadi kesalahan'
    throw new Error(errorMessage)
  }
}

export async function apiUpload<T = any>(
  path: string,
  formData: FormData
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await $fetch<{ success: boolean; data?: any; message?: string }>(
      `${getBaseUrl()}/api${path}`,
      {
        method: 'POST',
        headers,
        body: formData,
      }
    )

    if (!res.success) {
      throw new Error(res.message || 'Upload gagal')
    }

    return res.data as T
  } catch (err: any) {
    // Extract error message from $fetch error response
    const errorMessage = err.data?.message || err.message || 'Upload gagal'
    throw new Error(errorMessage)
  }
}
