export interface Employee {
  id?: string
  no?: number
  nip: string
  nama: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: 'L' | 'P'
  alamat: string
  golongan: string
  eselon: string
  jabatan: string
  tempatTugas: string
  agama: string
  unitKerja: string
  noHp: string
  npwp: string
  foto?: string
  createdAt?: string
  updatedAt?: string
}

export interface EmployeeFilter {
  search?: string
  unitKerja?: string
  golongan?: string
  eselon?: string
  jenisKelamin?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface EmployeeResponse {
  data: Employee[]
  meta: PaginationMeta
}
