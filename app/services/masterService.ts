/**
 * Master Data Service → Laravel /api/master/*
 */

import { apiPost } from '~/utils/api'

export interface MasterItem {
  id: number
  nama: string
  kode?: string
  keterangan?: string
  grade?: string
}

function normalise(item: any, index: number): MasterItem {
  if (typeof item === 'string') return { id: index + 1, nama: item }
  return {
    id:         item.id   ?? index + 1,
    nama:       item.nama ?? item.name ?? String(item),
    kode:       item.kode,
    keterangan: item.keterangan,
    grade:      item.grade,
  }
}

export const masterService = {
  async getGolongan(): Promise<MasterItem[]> {
    try {
      const res = await apiPost<any>('/master/golongans', {})
      const list = Array.isArray(res) ? res : (res?.data ?? [])
      return list.map(normalise)
    } catch {
      return ['I/a','I/b','I/c','I/d','II/a','II/b','II/c','II/d',
        'III/a','III/b','III/c','III/d','IV/a','IV/b','IV/c','IV/d','IV/e']
        .map((nama, i) => ({ id: i + 1, nama }))
    }
  },

  async getEselon(): Promise<MasterItem[]> {
    try {
      const res = await apiPost<any>('/master/eselons', {})
      const list = Array.isArray(res) ? res : (res?.data ?? [])
      return list.map(normalise)
    } catch {
      return ['I','II','III','IV','V'].map((nama, i) => ({ id: i + 1, nama }))
    }
  },

  async getAgama(): Promise<MasterItem[]> {
    try {
      const res = await apiPost<any>('/master/agamas', {})
      const list = Array.isArray(res) ? res : (res?.data ?? [])
      return list.map(normalise)
    } catch {
      return ['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu']
        .map((nama, i) => ({ id: i + 1, nama }))
    }
  },

  async getUnitKerja(): Promise<MasterItem[]> {
    try {
      const res = await apiPost<any>('/master/unit-kerjas', {})
      const list = Array.isArray(res) ? res : (res?.data ?? [])
      return list.map(normalise)
    } catch {
      return []
    }
  },
}
