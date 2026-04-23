# SIMPEG - Sistem Informasi Manajemen Pegawai

Aplikasi manajemen data pegawai PNS berbasis **Nuxt 3** dengan arsitektur **microservice frontend** yang profesional.

## 🏗️ Arsitektur Microservice Frontend

Aplikasi ini dibangun dengan pendekatan **microservice frontend** dimana setiap service memiliki tanggung jawab spesifik:

### Services Layer

1. **Auth Service** (`app/services/authService.ts`)
   - Endpoint: `AUTH_SERVICE_URL` (default: http://localhost:3001)
   - Fungsi: Login, logout, session management, token verification
   - Mock users tersedia untuk demo

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

Berdasarkan tabel referensi, struktur data pegawai:

```typescript
interface Employee {
  id: string
  nip: string                    // NIP pegawai
  nama: string                   // Nama lengkap
  tempatLahir: string            // Tempat lahir
  tanggalLahir: string           // Tanggal lahir (YYYY-MM-DD)
  jenisKelamin: 'L' | 'P'        // Jenis kelamin
  alamat: string                 // Alamat lengkap
  golongan: string               // Golongan (I/a - IV/e)
  eselon: string                 // Eselon (I - V)
  jabatan: string                // Nama jabatan
  tempatTugas: string            // Kota tempat tugas
  agama: string                  // Agama
  unitKerja: string              // Unit kerja
  noHp: string                   // Nomor HP
  npwp: string                   // NPWP
  foto?: string                  // URL/base64 foto
  createdAt?: string
  updatedAt?: string
}
```

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

## 👤 Demo Akun Login

| Role     | Username   | Password     | Akses                          |
|----------|------------|--------------|--------------------------------|
| Admin    | `admin`    | `admin123`   | Full access (CRUD + Delete)    |
| Operator | `operator` | `operator123`| CRUD (tanpa delete)            |
| Viewer   | `viewer`   | `viewer123`  | Read only                      |

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

- **Framework**: Nuxt 3 (Vue 3 + Vite)
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Architecture**: Microservice Frontend Pattern

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

## 📄 License

© 2025 BIG - Badan Informasi Geospasial

---

**Dibuat dengan ❤️ menggunakan Nuxt 3 + Tailwind CSS**
