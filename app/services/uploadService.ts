/**
 * Upload Service → Laravel /api/upload/*
 * Base: http://127.0.0.1:8000
 */

import { apiUpload, apiPost } from '~/utils/api'

export const uploadService = {
  /**
   * POST /api/upload/photo  (multipart/form-data)
   */
  async uploadPhoto(file: File, employeeId: string): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('File harus berupa gambar')
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Ukuran file maksimal 2MB')
    }

    const formData = new FormData()
    formData.append('file', file)
    if (employeeId && employeeId !== 'new') {
      formData.append('employee_id', employeeId)
    }

    const res = await apiUpload<{ url: string; filename: string }>('/upload/photo', formData)
    return res.url
  },

  /**
   * POST /api/upload/photo/delete
   */
  async deletePhoto(photoUrl: string): Promise<void> {
    if (!photoUrl) return
    await apiPost('/upload/photo/delete', { url: photoUrl }).catch(() => {})
  },
}
