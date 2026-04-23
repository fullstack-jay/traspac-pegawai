# 🏗️ Backend Laravel — SIMPEG

> Panduan lengkap membangun backend microservice untuk Sistem Informasi Manajemen Pegawai (SIMPEG) menggunakan Laravel 11.

---

## 📋 Daftar Isi

- [Requirements](#requirements)
- [Instalasi](#instalasi)
- [Struktur Database](#struktur-database)
- [Migration](#migration)
- [Model](#model)
- [Routes](#routes)
- [Controllers](#controllers)
- [Request & Response](#request--response)
- [Integrasi ke Nuxt](#integrasi-ke-nuxt)
- [Environment Variables](#environment-variables)

---

## Requirements

| Kebutuhan | Versi |
|-----------|-------|
| PHP | >= 8.2 |
| Laravel | 11.x |
| MySQL / PostgreSQL | >= 8.0 |
| Composer | >= 2.x |

### Package yang Dibutuhkan

```bash
# Auth token (sudah include di Laravel 11)
composer require laravel/sanctum

# Resize & proses foto
composer require intervention/image

# CORS untuk komunikasi dengan Nuxt
composer require fruitcake/laravel-cors
```

---

## Instalasi

```bash
# 1. Buat project baru
composer create-project laravel/laravel simpeg-backend
cd simpeg-backend

# 2. Install packages
composer require laravel/sanctum intervention/image

# 3. Publish Sanctum config
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 4. Jalankan migration
php artisan migrate

# 5. Buat storage link untuk foto
php artisan storage:link

# 6. Jalankan server
php artisan serve
# → http://localhost:8000
```

---

## Struktur Database

### Diagram Relasi

```
users (auth)
  └── id, name, username, password, role, unit_kerja

employees (data pegawai)
  └── id, nip, nama, tempat_lahir, tanggal_lahir,
      jenis_kelamin, alamat, golongan, eselon,
      jabatan, tempat_tugas, agama, unit_kerja,
      no_hp, npwp, foto, deleted_at, timestamps
```

---

## Migration

### `create_users_table`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('username', 50)->unique();
            $table->string('password');
            $table->enum('role', ['admin', 'operator', 'viewer'])->default('viewer');
            $table->string('unit_kerja', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

### `create_employees_table`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('nip', 20)->unique();
            $table->string('nama', 100);
            $table->string('tempat_lahir', 50);
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->text('alamat');
            $table->string('golongan', 5);       // contoh: IV/e, III/a
            $table->string('eselon', 5)->nullable();
            $table->string('jabatan', 150);
            $table->string('tempat_tugas', 100);
            $table->string('agama', 20);
            $table->string('unit_kerja', 100);
            $table->string('no_hp', 20)->nullable();
            $table->string('npwp', 25)->nullable();
            $table->string('foto', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();               // kolom deleted_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
```

---

## Model

### `app/Models/User.php`

```php
<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name',
        'username',
        'password',
        'role',
        'unit_kerja',
    ];

    protected $hidden = [
        'password',
    ];
}
```

### `app/Models/Employee.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nip',
        'nama',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'golongan',
        'eselon',
        'jabatan',
        'tempat_tugas',
        'agama',
        'unit_kerja',
        'no_hp',
        'npwp',
        'foto',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date:Y-m-d',
    ];
}
```

---

## Routes

> **Semua route menggunakan method POST**

```php
<?php

// routes/api.php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\UploadController;

// ─────────────────────────────────────────────────────────
//  AUTH SERVICE
// ─────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/login',   [AuthController::class, 'login']);
    Route::post('/logout',  [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/verify',  [AuthController::class, 'verify'])->middleware('auth:sanctum');
    Route::post('/profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
});

// ─────────────────────────────────────────────────────────
//  EMPLOYEE SERVICE
// ─────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('employees')->group(function () {
    Route::post('/list',   [EmployeeController::class, 'list']);    // daftar + filter + pagination
    Route::post('/all',    [EmployeeController::class, 'all']);     // semua data (untuk cetak)
    Route::post('/detail', [EmployeeController::class, 'detail']); // detail by id
    Route::post('/create', [EmployeeController::class, 'create']); // tambah pegawai
    Route::post('/update', [EmployeeController::class, 'update']); // ubah pegawai
    Route::post('/delete', [EmployeeController::class, 'delete']); // hapus pegawai
    Route::post('/units',  [EmployeeController::class, 'units']);  // list unit kerja
});

// ─────────────────────────────────────────────────────────
//  UPLOAD SERVICE
// ─────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->prefix('upload')->group(function () {
    Route::post('/photo',        [UploadController::class, 'uploadPhoto']);
    Route::post('/photo/delete', [UploadController::class, 'deletePhoto']);
});
```

### Ringkasan Routes

| No | Route | Auth | Fungsi |
|----|-------|------|--------|
| 1 | `POST /api/auth/login` | ❌ | Login & dapat token |
| 2 | `POST /api/auth/logout` | ✅ | Logout & hapus token |
| 3 | `POST /api/auth/verify` | ✅ | Verifikasi token aktif |
| 4 | `POST /api/auth/profile` | ✅ | Data user login |
| 5 | `POST /api/employees/list` | ✅ | Daftar pegawai + filter + pagination |
| 6 | `POST /api/employees/all` | ✅ | Semua pegawai (untuk cetak) |
| 7 | `POST /api/employees/detail` | ✅ | Detail satu pegawai |
| 8 | `POST /api/employees/create` | ✅ | Tambah pegawai baru |
| 9 | `POST /api/employees/update` | ✅ | Ubah data pegawai |
| 10 | `POST /api/employees/delete` | ✅ | Hapus pegawai (soft delete) |
| 11 | `POST /api/employees/units` | ✅ | List unit kerja unik |
| 12 | `POST /api/upload/photo` | ✅ | Upload foto pegawai |
| 13 | `POST /api/upload/photo/delete` | ✅ | Hapus foto pegawai |

---

## Controllers

### `app/Http/Controllers/Api/AuthController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'username'   => $user->username,
                'role'       => $user->role,
                'unit_kerja' => $user->unit_kerja,
                'token'      => $token,
            ],
        ]);
    }

    /**
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ]);
    }

    /**
     * POST /api/auth/verify
     */
    public function verify(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user(),
        ]);
    }

    /**
     * POST /api/auth/profile
     */
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user(),
        ]);
    }
}
```

---

### `app/Http/Controllers/Api/EmployeeController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * POST /api/employees/list
     * Daftar pegawai dengan filter & pagination
     */
    public function list(Request $request)
    {
        $query = Employee::query();

        // Filter pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('jabatan', 'like', "%{$search}%")
                  ->orWhere('unit_kerja', 'like', "%{$search}%");
            });
        }

        if ($request->filled('unit_kerja'))    $query->where('unit_kerja', $request->unit_kerja);
        if ($request->filled('golongan'))      $query->where('golongan', $request->golongan);
        if ($request->filled('jenis_kelamin')) $query->where('jenis_kelamin', $request->jenis_kelamin);
        if ($request->filled('eselon'))        $query->where('eselon', $request->eselon);

        $limit     = $request->input('limit', 10);
        $paginated = $query->orderBy('nama')->paginate($limit);

        return response()->json([
            'success' => true,
            'data'    => $paginated->items(),
            'meta'    => [
                'page'        => $paginated->currentPage(),
                'limit'       => (int) $limit,
                'total'       => $paginated->total(),
                'total_pages' => $paginated->lastPage(),
            ],
        ]);
    }

    /**
     * POST /api/employees/all
     * Semua pegawai tanpa pagination (untuk cetak)
     */
    public function all(Request $request)
    {
        $query = Employee::query();

        if ($request->filled('unit_kerja'))    $query->where('unit_kerja', $request->unit_kerja);
        if ($request->filled('golongan'))      $query->where('golongan', $request->golongan);
        if ($request->filled('jenis_kelamin')) $query->where('jenis_kelamin', $request->jenis_kelamin);

        $employees = $query->orderBy('nama')->get();

        return response()->json([
            'success' => true,
            'data'    => $employees,
        ]);
    }

    /**
     * POST /api/employees/detail
     */
    public function detail(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:employees,id',
        ]);

        $employee = Employee::findOrFail($request->id);

        return response()->json([
            'success' => true,
            'data'    => $employee,
        ]);
    }

    /**
     * POST /api/employees/create
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'nip'           => 'required|string|max:20|unique:employees,nip',
            'nama'          => 'required|string|max:100',
            'tempat_lahir'  => 'required|string|max:50',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat'        => 'required|string',
            'golongan'      => 'required|string|max:5',
            'eselon'        => 'nullable|string|max:5',
            'jabatan'       => 'required|string|max:150',
            'tempat_tugas'  => 'required|string|max:100',
            'agama'         => 'required|string|max:20',
            'unit_kerja'    => 'required|string|max:100',
            'no_hp'         => 'nullable|string|max:20',
            'npwp'          => 'nullable|string|max:25',
            'foto'          => 'nullable|string',
        ]);

        $employee = Employee::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil ditambahkan',
            'data'    => $employee,
        ], 201);
    }

    /**
     * POST /api/employees/update
     */
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:employees,id',
        ]);

        $employee = Employee::findOrFail($request->id);

        $validated = $request->validate([
            'nip'           => 'sometimes|string|max:20|unique:employees,nip,' . $employee->id,
            'nama'          => 'sometimes|string|max:100',
            'tempat_lahir'  => 'sometimes|string|max:50',
            'tanggal_lahir' => 'sometimes|date',
            'jenis_kelamin' => 'sometimes|in:L,P',
            'alamat'        => 'sometimes|string',
            'golongan'      => 'sometimes|string|max:5',
            'eselon'        => 'nullable|string|max:5',
            'jabatan'       => 'sometimes|string|max:150',
            'tempat_tugas'  => 'sometimes|string|max:100',
            'agama'         => 'sometimes|string|max:20',
            'unit_kerja'    => 'sometimes|string|max:100',
            'no_hp'         => 'nullable|string|max:20',
            'npwp'          => 'nullable|string|max:25',
            'foto'          => 'nullable|string',
        ]);

        $employee->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil diperbarui',
            'data'    => $employee->fresh(),
        ]);
    }

    /**
     * POST /api/employees/delete
     */
    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:employees,id',
        ]);

        $employee = Employee::findOrFail($request->id);

        // Hapus foto jika ada
        if ($employee->foto) {
            $path = str_replace('/storage/', 'public/', $employee->foto);
            \Storage::delete($path);
        }

        $employee->delete(); // soft delete

        return response()->json([
            'success' => true,
            'message' => 'Data pegawai berhasil dihapus',
        ]);
    }

    /**
     * POST /api/employees/units
     * Daftar unit kerja unik
     */
    public function units(Request $request)
    {
        $units = Employee::select('unit_kerja')
            ->distinct()
            ->orderBy('unit_kerja')
            ->pluck('unit_kerja');

        return response()->json([
            'success' => true,
            'data'    => $units,
        ]);
    }
}
```

---

### `app/Http/Controllers/Api/UploadController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * POST /api/upload/photo
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'file'        => 'required|image|mimes:jpg,jpeg,png|max:2048', // max 2MB
            'employee_id' => 'nullable|integer',
        ]);

        $file      = $request->file('file');
        $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path      = $file->storeAs('public/photos', $filename);
        $url       = Storage::url($path);

        return response()->json([
            'success' => true,
            'data'    => [
                'url'      => url($url),
                'filename' => $filename,
            ],
        ]);
    }

    /**
     * POST /api/upload/photo/delete
     */
    public function deletePhoto(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
        ]);

        // Ekstrak path dari URL
        $path = 'public/photos/' . basename($request->url);

        if (Storage::exists($path)) {
            Storage::delete($path);
        }

        return response()->json([
            'success' => true,
            'message' => 'Foto berhasil dihapus',
        ]);
    }
}
```

---

## Request & Response

### `POST /api/auth/login`

```json
// Request Body
{
  "username": "admin",
  "password": "admin123"
}

// Response 200
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Administrator",
    "username": "admin",
    "role": "admin",
    "unit_kerja": "Semua Unit",
    "token": "1|abc123xyz..."
  }
}

// Response 401
{
  "success": false,
  "message": "Username atau password salah"
}
```

---

### `POST /api/employees/list`

```json
// Request Body
{
  "search": "saifulloh",
  "unit_kerja": "Sekretariat Utama",
  "golongan": "IV/e",
  "jenis_kelamin": "L",
  "eselon": "I",
  "page": 1,
  "limit": 10
}

// Response 200
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nip": "12130569001",
      "nama": "Saifulloh Rifai",
      "tempat_lahir": "Banjarnegara",
      "tanggal_lahir": "1968-03-15",
      "jenis_kelamin": "L",
      "alamat": "Jl. Melon No.16 Dian Asri",
      "golongan": "IV/e",
      "eselon": "I",
      "jabatan": "Kepala Sekretariat Utama",
      "tempat_tugas": "Jakarta",
      "agama": "Islam",
      "unit_kerja": "Sekretariat Utama",
      "no_hp": "081234567890",
      "npwp": "12.345.678.9-001.000",
      "foto": "http://localhost:8000/storage/photos/abc.jpg",
      "created_at": "2025-01-01T00:00:00.000000Z",
      "updated_at": "2025-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "total_pages": 5
  }
}
```

---

### `POST /api/employees/create`

```json
// Request Body
{
  "nip": "19680315199003001",
  "nama": "Saifulloh Rifai",
  "tempat_lahir": "Banjarnegara",
  "tanggal_lahir": "1968-03-15",
  "jenis_kelamin": "L",
  "alamat": "Jl. Melon No.16 Dian Asri",
  "golongan": "IV/e",
  "eselon": "I",
  "jabatan": "Kepala Sekretariat Utama",
  "tempat_tugas": "Jakarta",
  "agama": "Islam",
  "unit_kerja": "Sekretariat Utama",
  "no_hp": "081234567890",
  "npwp": "12.345.678.9-001.000",
  "foto": "http://localhost:8000/storage/photos/abc.jpg"
}

// Response 201
{
  "success": true,
  "message": "Data pegawai berhasil ditambahkan",
  "data": { ...employee }
}

// Response 422 (validasi gagal)
{
  "message": "The nip has already been taken.",
  "errors": {
    "nip": ["The nip has already been taken."]
  }
}
```

---

### `POST /api/employees/update`

```json
// Request Body
{
  "id": 1,
  "nama": "Saifulloh Rifai Updated",
  "jabatan": "Jabatan Baru",
  "golongan": "IV/e"
}

// Response 200
{
  "success": true,
  "message": "Data pegawai berhasil diperbarui",
  "data": { ...employee }
}
```

---

### `POST /api/employees/delete`

```json
// Request Body
{ "id": 1 }

// Response 200
{
  "success": true,
  "message": "Data pegawai berhasil dihapus"
}
```

---

### `POST /api/upload/photo`

```
// Request: multipart/form-data
// Header: Authorization: Bearer {token}
// Field:
//   file        → file gambar (jpg/png, max 2MB)
//   employee_id → integer (opsional)
```

```json
// Response 200
{
  "success": true,
  "data": {
    "url": "http://localhost:8000/storage/photos/uuid-filename.jpg",
    "filename": "uuid-filename.jpg"
  }
}
```

---

## Seeder (Data Awal)

### `database/seeders/UserSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name'       => 'Administrator',
                'username'   => 'admin',
                'password'   => Hash::make('admin123'),
                'role'       => 'admin',
                'unit_kerja' => 'Semua Unit',
            ],
            [
                'name'       => 'Operator BKN',
                'username'   => 'operator',
                'password'   => Hash::make('operator123'),
                'role'       => 'operator',
                'unit_kerja' => 'Biro Kepegawaian',
            ],
            [
                'name'       => 'Viewer',
                'username'   => 'viewer',
                'password'   => Hash::make('viewer123'),
                'role'       => 'viewer',
                'unit_kerja' => 'Biro Umum',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['username' => $user['username']], $user);
        }
    }
}
```

```bash
# Jalankan seeder
php artisan db:seed --class=UserSeeder
```

---

## CORS Configuration

### `config/cors.php`

```php
'paths' => ['api/*'],

'allowed_methods' => ['POST'],

'allowed_origins' => [
    'http://localhost:3000',   // Nuxt dev
    'https://simpeg.example.com', // Production
],

'allowed_headers' => ['Content-Type', 'Authorization', 'Accept'],

'supports_credentials' => false,
```

---

## Environment Variables

### `.env`

```env
APP_NAME=SIMPEG
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simpeg
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

FILESYSTEM_DISK=public
```

---

## Integrasi ke Nuxt

Setelah backend siap, update file service di Nuxt:

### `app/services/employeeService.ts`

```typescript
// Ganti mock dengan real API call

async getEmployees(filter: EmployeeFilter = {}, page = 1, limit = 10) {
  const config = useRuntimeConfig()
  const token  = localStorage.getItem('auth_token')

  const res = await $fetch<EmployeeResponse>(
    `${config.public.employeeServiceUrl}/api/employees/list`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: { ...filter, page, limit },
    }
  )
  return res
}
```

### `app/services/authService.ts`

```typescript
async login(credentials: LoginCredentials): Promise<AuthUser> {
  const config = useRuntimeConfig()

  const res = await $fetch<{ success: boolean; data: AuthUser }>(
    `${config.public.authServiceUrl}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: credentials,
    }
  )

  if (!res.success) throw new Error('Login gagal')

  // Simpan token terpisah
  localStorage.setItem('auth_token', res.data.token)

  return res.data
}
```

---

## Checklist Deployment

- [ ] Set `APP_ENV=production` dan `APP_DEBUG=false`
- [ ] Jalankan `php artisan config:cache`
- [ ] Jalankan `php artisan route:cache`
- [ ] Jalankan `php artisan storage:link`
- [ ] Set permission folder `storage/` dan `bootstrap/cache/`
- [ ] Konfigurasi CORS sesuai domain production
- [ ] Setup HTTPS untuk keamanan token

---

> **Total: 13 routes — semua menggunakan method POST**
>
> © 2025 BIG - Badan Informasi Geospasial
