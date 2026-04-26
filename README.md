# SIMPEG - Sistem Informasi Manajemen Pegawai

Aplikasi manajemen data pegawai PNS berbasis **Nuxt 3** dengan arsitektur **microservice frontend** yang profesional.

## 🏗️ Arsitektur Microservice Frontend

Aplikasi ini dibangun dengan pendekatan **microservice frontend** dimana setiap service memiliki tanggung jawab spesifik:

### Services Layer

1. **Auth Service** (`app/services/authService.ts`)
   - Endpoint: `AUTH_SERVICE_URL` (default: http://localhost:3001)
   - Fungsi: Login, logout, session management, token verification

2. **Employee Service** (`app/services/employeeService.ts`)
   - Endpoint: `EMPLOYEE_SERVICE_URL` (default: http://localhost:3002)
   - Fungsi: CRUD pegawai, filter, pagination, search
   - Seed data 7 pegawai untuk demo

3. **Upload Service** (`app/services/uploadService.ts`)
   - Endpoint: `UPLOAD_SERVICE_URL` (default: http://localhost:3003)
   - Fungsi: Upload foto pegawai (max 2MB)
   - Demo mode: convert to base64

4. **Print Service** (`app/services/printService.ts`)
   - Fungsi: Generate print layout untuk daftar pegawai
   - Format: A3 landscape dengan semua kolom sesuai tabel referensi

### State Management

- **Pinia stores** untuk centralized state management
- `authStore`: User authentication state
- `employeeStore`: Employee data, filters, pagination

## ✨ Fitur Lengkap

### ✅ Fitur yang Diminta

- [x] **a. Login aplikasi** - Multi-role (admin, operator, viewer)
- [x] **b. Upload foto pegawai** - Drag & drop, max 2MB
- [x] **c. Melihat daftar pegawai** - Table view dengan pagination
- [x] **d. Pencarian data pegawai** - Real-time search (nama, NIP, jabatan)
- [x] **e. Filter unit kerja** - Dropdown filter unit kerja
- [x] **f. Tambah data pegawai** - Form lengkap dengan validasi
- [x] **g. Ubah data pegawai** - Edit form dengan pre-fill data
- [x] **h. Hapus data pegawai** - Dengan konfirmasi modal
- [x] **i. Cetak daftar pegawai** - Print layout A3 landscape
- [x] **j. Kolom sesuai cetakan** - 15 kolom lengkap sesuai tabel referensi

### 🎯 Fitur Tambahan

- Dashboard dengan statistik pegawai
- Filter multi-kriteria (unit kerja, golongan, jenis kelamin)
- Responsive design (mobile-friendly)
- Role-based access control (RBAC)
- Toast notifications
- Loading states & error handling
- Professional UI/UX dengan Tailwind CSS

## 📊 Struktur Database

Database sudah dinormalisasi. Field seperti golongan, eselon, agama, dan unit kerja disimpan sebagai relasi ke tabel master masing-masing.

### Tabel Utama

#### `users` — Autentikasi
```sql
id, name, username (unique), password (hashed),
role (admin | operator | viewer), unit_kerja,
created_at, updated_at
```

#### `employees` — Data Pegawai
```sql
id, nip (unique), nama, tempat_lahir, tanggal_lahir,
jenis_kelamin (L/P), alamat, jabatan, tempat_tugas,
no_hp, npwp, foto (URL),
golongan_id (FK → golongans.id),
eselon_id   (FK → eselons.id),
agama_id    (FK → agamas.id),
unit_kerja_id (FK → unit_kerjas.id),
created_at, updated_at, deleted_at (soft delete)
```

### Tabel Referensi (Master Data)

| Tabel | Kolom Utama | Contoh Data |
|-------|-------------|-------------|
| `golongans` | id, nama, grade, keterangan | I/a, I/b, …, IV/e |
| `eselons` | id, nama, keterangan | I, II, III, IV |
| `agamas` | id, nama | Islam, Kristen, Katolik, Hindu, Buddha, Konghucu |
| `unit_kerjas` | id, nama, kode | SET, PDG, PPS, PIG, PR, PSK, PPD |

### TypeScript Interface (Frontend)

```typescript
interface Employee {
  id?: string
  nip: string
  nama: string
  tempatLahir: string
  tanggalLahir: string           // format: YYYY-MM-DD
  jenisKelamin: 'L' | 'P'
  alamat: string
  jabatan: string
  tempatTugas: string
  noHp: string
  npwp: string
  foto?: string                  // URL foto dari server

  // Nilai nama — untuk ditampilkan di UI
  golongan: string               // contoh: "IV/e"
  eselon: string                 // contoh: "II"
  agama: string                  // contoh: "Islam"
  unitKerja: string              // contoh: "SET"

  // Foreign key ID — dikirim ke backend saat create/update
  golonganId?: number | null     // FK → golongans.id
  eselonId?: number | null       // FK → eselons.id
  agamaId?: number | null        // FK → agamas.id
  unitKerjaId?: number | null    // FK → unit_kerjas.id

  createdAt?: string
  updatedAt?: string
}
```

> **Catatan:** Frontend menyimpan dua representasi untuk field relasi — nama (untuk tampilan) dan ID (untuk dikirim ke backend). Konversi dilakukan di `employeeService.ts` via fungsi `mapEmployee()`.

## 🚀 Instalasi & Menjalankan

### Prerequisites

- Node.js 20+ (gunakan nvm: `nvm use 20`)
- npm 10+

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di: http://localhost:3000

### Build Production

```bash
npm run build
npm run preview
```
## 📁 Struktur Folder

```
pegawai/
├── app/
│   ├── assets/css/          # Tailwind CSS
│   ├── components/          # Vue components
│   │   └── EmployeeForm.vue # Form pegawai reusable
│   ├── layouts/             # Layout templates
│   │   ├── default.vue      # Main layout dengan sidebar
│   │   └── auth.vue         # Auth layout (login)
│   ├── middleware/          # Route middleware
│   │   └── auth.ts          # Auth guard
│   ├── pages/               # File-based routing
│   │   ├── index.vue        # Dashboard
│   │   ├── login.vue        # Login page
│   │   └── pegawai/         # Employee pages
│   │       ├── index.vue    # List pegawai
│   │       ├── tambah.vue   # Tambah pegawai
│   │       └── [id]/
│   │           ├── index.vue # Detail pegawai
│   │           └── edit.vue  # Edit pegawai
│   ├── plugins/             # Nuxt plugins
│   │   └── auth.client.ts   # Restore session
│   ├── services/            # Microservices layer
│   │   ├── authService.ts
│   │   ├── employeeService.ts
│   │   ├── uploadService.ts
│   │   └── printService.ts
│   ├── stores/              # Pinia stores
│   │   ├── auth.ts
│   │   └── employee.ts
│   └── types/               # TypeScript types
│       ├── auth.ts
│       └── employee.ts
├── nuxt.config.ts           # Nuxt configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json
```

## 🔧 Konfigurasi Microservice

Untuk production, set environment variables untuk backend microservices:

```bash
# .env
AUTH_SERVICE_URL=https://auth-api.example.com
EMPLOYEE_SERVICE_URL=https://employee-api.example.com
UPLOAD_SERVICE_URL=https://upload-api.example.com
```

Saat ini aplikasi menggunakan **mock data** untuk demo. Untuk integrasi dengan backend real:

1. Uncomment kode API call di setiap service
2. Comment bagian mock/demo
3. Set environment variables sesuai endpoint backend

## 🎨 Tech Stack

- **Framework**: Nuxt 4 (Vue 3 + Vite)
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Backend**: Laravel 11 + Sanctum
- **Database**: MySQL / PostgreSQL (normalized schema)

## 📝 Catatan Implementasi

### Microservice Pattern

Setiap service (`authService`, `employeeService`, dll) dirancang untuk berkomunikasi dengan backend microservice terpisah. Ini memberikan:

- **Separation of Concerns**: Setiap service fokus pada domain spesifik
- **Scalability**: Service dapat di-scale independent
- **Maintainability**: Mudah maintain dan test
- **Flexibility**: Mudah swap/upgrade service tanpa affect yang lain

### Mock Data

Aplikasi saat ini menggunakan mock data untuk demo. Data disimpan di memory dan akan reset saat reload. Untuk production:

1. Implement backend API sesuai interface di services
2. Update service files untuk call real API
3. Handle authentication token di HTTP headers
4. Implement proper error handling

### Print Feature

Print menggunakan `window.open()` dengan HTML template. Browser akan membuka window baru dengan layout print-optimized (A3 landscape). User bisa:

- Preview sebelum print
- Save as PDF
- Adjust print settings


---

**Dibuat dengan menggunakan Nuxt 3 + Tailwind CSS**
