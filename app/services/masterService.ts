/**
 * Master Data Service → Laravel /api/master/*
 * Fetch data referensi: golongan, eselon, agama, unit kerja
 */

import { apiPost } from '~/utils/api'

export interface MasterItem {
  id: number
  nama: string
  kode?: string
  keterangan?: string
  grade?: string
}

export const masterService = {
  async getGolongan(): Promise<MasterItem[]> {
    try {
      const res = await apiPost<any>('/master/golongan', {})
      const list = Array.isArray(res) ? res : (res?.data ?? [])
      if (list.length > 0) return list
    } catch {}
    // Fallback statis
    return ['I/a','I/b','I/c','I/d','II/a','II/b','II/c','II/d',
      'III/a','III/b','III/c','III/d','IV/a','IV/b','IV/c','IV/d','IV/e']
      .map((nama, i) => ({ id: i + 1, nama }))
  },

  async getEselon(): Promise<MasterItem[]> {
    try {
      const res = await apiPost<any>('/master/eselon', {})
      const list = Array.isArray(res) ? res : (res?.data ?? [])
      if (list.length > 0) return list
    } catch {}
    return ['I','II','III','IV','V'].map((nama, i) => ({ id: i + 1, nama }))
  },

  async getAgama(): Promise<MasterItem[]> {
    try {
      const res = await apiPost<any>('/master/agama', {})
      const list = Array.isArray(res) ? res : (res?.data ?? [])
      if (list.length > 0) return list
    } catch {}
    return ['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu']
      .map((nama, i) => ({ id: i + 1, nama }))
  },

  async getUnitKerja(): Promise<MasterItem[]> {
    try {
      const res = await apiPost<string[]>('/employees/units', {})
      const list = Array.isArray(res) ? res : []
      return list.map((nama, i) => ({ id: i + 1, nama }))
    } catch {
      return []
    }
  },
}
