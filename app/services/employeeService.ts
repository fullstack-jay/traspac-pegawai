/**
 * Employee Service → Laravel /api/employees/*
 * Base: http://127.0.0.1:8000
 * Request body: camelCase
 */

import type { Employee, EmployeeFilter, EmployeeResponse } from '~/types/employee'
import { apiPost, apiPostList } from '~/utils/api'

// Map response dari Laravel → Employee (pure camelCase, support nested objects)
function mapEmployee(e: any): Employee {
  // Helper: ambil nilai dari field yang bisa string atau nested object
  const str = (val: any, key = 'nama'): string => {
    if (!val) return ''
    if (typeof val === 'string') return val
    if (typeof val === 'object') return val[key] ?? val.name ?? val.nama ?? ''
    return String(val)
  }

  return {
    id:           String(e.id),
    no:           e.no,
    nip:          e.nip,
    nama:         e.nama,
    tempatLahir:  e.tempatLahir,
    tanggalLahir: e.tanggalLahir,
    jenisKelamin: e.jenisKelamin,
    alamat:       e.alamat,
    golongan:     str(e.golongan),       // bisa "IV/e" atau {nama:"IV/e",...}
    eselon:       str(e.eselon) ?? '',   // bisa "I" atau {nama:"I",...}
    jabatan:      e.jabatan,
    tempatTugas:  e.tempatTugas,
    agama:        str(e.agama),          // bisa "Islam" atau {nama:"Islam",...}
    unitKerja:    str(e.unitKerja),      // bisa "Sekretariat" atau {nama:"Sekretariat",...}
    noHp:         e.noHp  ?? '',
    npwp:         e.npwp  ?? '',
    foto:         e.foto  ?? '',
    createdAt:    e.createdAt,
    updatedAt:    e.updatedAt,
  }
}

export const employeeService = {
  /**
   * POST /api/employees/list
   */
  async getEmployees(filter: EmployeeFilter = {}, page = 1, limit = 10): Promise<EmployeeResponse> {
    const res = await apiPostList<any>('/employees/list', {
      search:        filter.search       ?? '',
      unitKerja:     filter.unitKerja    ?? '',
      golongan:      filter.golongan     ?? '',
      jenisKelamin:  filter.jenisKelamin ?? '',
      eselon:        filter.eselon       ?? '',
      sortColumn:    filter.sortBy       ?? 'id',
      sortColumnDir: filter.sortDir      ?? 'asc',
      pageNumber:    page,
      pageSize:      limit,
    })

    // Meta dari backend: { pageNumber, pageSize, total, totalPages }
    const meta = res.meta
    return {
      data:  res.data.map(mapEmployee),
      meta: {
        page:       meta.pageNumber ?? page,
        limit:      meta.pageSize   ?? limit,
        total:      meta.total      ?? 0,
        totalPages: meta.totalPages ?? 1,
      },
    }
  },

  /**
   * POST /api/employees/all  (untuk cetak)
   */
  async getAllEmployees(filter: EmployeeFilter = {}): Promise<Employee[]> {
    const res = await apiPost<{ data: any[] } | any[]>('/employees/all', {
      unitKerja:    filter.unitKerja    || undefined,
      golongan:     filter.golongan     || undefined,
      jenisKelamin: filter.jenisKelamin || undefined,
    })
    // Handle jika backend return array langsung atau { data: [] }
    const list = Array.isArray(res) ? res : (res as any).data ?? res
    return list.map(mapEmployee)
  },

  /**
   * POST /api/employees/detail
   */
  async getEmployee(id: string): Promise<Employee> {
    const res = await apiPost<any>('/employees/detail', { id: Number(id) })
    return mapEmployee(res)
  },

  /**
   * POST /api/employees/create
   */
  async createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    const d = data as any
    const res = await apiPost<any>('/employees/create', {
      nip:           d.nip,
      nama:          d.nama,
      tempatLahir:   d.tempatLahir,
      tempat_lahir:  d.tempatLahir,
      tanggalLahir:  d.tanggalLahir,
      tanggal_lahir: d.tanggalLahir,
      jenisKelamin:  d.jenisKelamin,
      jenis_kelamin: d.jenisKelamin,
      alamat:        d.alamat,
      // Kirim ID (untuk relasi) dan nama (fallback)
      golonganId:    d.golonganId   ?? null,
      golongan_id:   d.golonganId   ?? null,
      golongan:      d.golongan     || null,
      eselonId:      d.eselonId     ?? null,
      eselon_id:     d.eselonId     ?? null,
      eselon:        d.eselon       || null,
      jabatan:       d.jabatan,
      tempatTugas:   d.tempatTugas,
      tempat_tugas:  d.tempatTugas,
      agamaId:       d.agamaId      ?? null,
      agama_id:      d.agamaId      ?? null,
      agama:         d.agama        || null,
      unitKerjaId:   d.unitKerjaId  ?? null,
      unit_kerja_id: d.unitKerjaId  ?? null,
      unitKerja:     d.unitKerja    || null,
      unit_kerja:    d.unitKerja    || null,
      noHp:          d.noHp         || null,
      no_hp:         d.noHp         || null,
      npwp:          d.npwp         || null,
      foto:          d.foto         || null,
    })
    return mapEmployee(res)
  },

  /**
   * POST /api/employees/update
   */
  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    const d = data as any
    const res = await apiPost<any>('/employees/update', {
      id:            Number(id),
      nip:           d.nip,
      nama:          d.nama,
      tempatLahir:   d.tempatLahir,
      tempat_lahir:  d.tempatLahir,
      tanggalLahir:  d.tanggalLahir,
      tanggal_lahir: d.tanggalLahir,
      jenisKelamin:  d.jenisKelamin,
      jenis_kelamin: d.jenisKelamin,
      alamat:        d.alamat,
      golonganId:    d.golonganId   ?? null,
      golongan_id:   d.golonganId   ?? null,
      golongan:      d.golongan     || null,
      eselonId:      d.eselonId     ?? null,
      eselon_id:     d.eselonId     ?? null,
      eselon:        d.eselon       || null,
      jabatan:       d.jabatan,
      tempatTugas:   d.tempatTugas,
      tempat_tugas:  d.tempatTugas,
      agamaId:       d.agamaId      ?? null,
      agama_id:      d.agamaId      ?? null,
      agama:         d.agama        || null,
      unitKerjaId:   d.unitKerjaId  ?? null,
      unit_kerja_id: d.unitKerjaId  ?? null,
      unitKerja:     d.unitKerja    || null,
      unit_kerja:    d.unitKerja    || null,
      noHp:          d.noHp         ?? null,
      no_hp:         d.noHp         ?? null,
      npwp:          d.npwp         ?? null,
      foto:          d.foto         ?? null,
    })
    return mapEmployee(res)
  },

  /**
   * POST /api/employees/delete
   */
  async deleteEmployee(id: string): Promise<void> {
    await apiPost('/employees/delete', { id: Number(id) })
  },

  /**
   * POST /api/employees/units
   */
  async getUnitKerjaList(): Promise<string[]> {
    const res = await apiPost<string[]>('/employees/units', {})
    return res
  },
}
