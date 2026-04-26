export interface Employee {
  id?: string
  no?: number
  nip: string
  nama: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: 'L' | 'P'
  alamat: string

  // Nilai nama (untuk tampilan)
  golongan: string
  eselon: string
  agama: string
  unitKerja: string

  jabatan: string
  tempatTugas: string
  noHp: string
  npwp: string
  foto?: string

  // Foreign key ID (untuk kirim ke backend — relasi ke tabel master)
  golonganId?: number | null   // FK → golongans.id
  eselonId?: number | null     // FK → eselons.id
  agamaId?: number | null      // FK → agamas.id
  unitKerjaId?: number | null  // FK → unit_kerjas.id

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
