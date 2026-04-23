<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold text-gray-900">Daftar Pegawai</h2>
        <p class="text-sm text-gray-500">Total {{ employeeStore.meta.total }} pegawai ditemukan</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button @click="handlePrint" class="btn-secondary text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          <span class="hidden sm:inline">Cetak</span>
        </button>
        <NuxtLink v-if="authStore.isOperator" to="/pegawai/tambah" class="btn-primary text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="hidden sm:inline">Tambah Pegawai</span>
          <span class="sm:hidden">Tambah</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="card p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <div class="sm:col-span-2 xl:col-span-2 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input v-model="searchQuery" type="text" placeholder="Cari nama, NIP, jabatan..."
            class="input-field pl-10" @input="debouncedSearch"/>
        </div>
        <select v-model="filterUnitKerja" @change="applyFilter" class="input-field">
          <option value="">Semua Unit Kerja</option>
          <option v-for="unit in employeeStore.unitKerjaList" :key="unit" :value="unit">{{ unit }}</option>
        </select>
        <select v-model="filterGolongan" @change="applyFilter" class="input-field">
          <option value="">Semua Golongan</option>
          <option v-for="gol in golonganList" :key="gol" :value="gol">{{ gol }}</option>
        </select>
        <select v-model="filterJK" @change="applyFilter" class="input-field">
          <option value="">Semua Jenis Kelamin</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>
      <div v-if="hasActiveFilter" class="flex items-center gap-2 mt-3 flex-wrap">
        <span class="text-xs text-gray-500">Filter aktif:</span>
        <span v-if="searchQuery" class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
          Cari: "{{ searchQuery }}" <button @click="clearSearch" class="hover:text-blue-900">×</button>
        </span>
        <span v-if="filterUnitKerja" class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
          Unit: {{ filterUnitKerja }} <button @click="filterUnitKerja = ''; applyFilter()" class="hover:text-green-900">×</button>
        </span>
        <span v-if="filterGolongan" class="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
          Gol: {{ filterGolongan }} <button @click="filterGolongan = ''; applyFilter()" class="hover:text-purple-900">×</button>
        </span>
        <span v-if="filterJK" class="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
          JK: {{ filterJK === 'L' ? 'Laki-laki' : 'Perempuan' }}
          <button @click="filterJK = ''; applyFilter()" class="hover:text-orange-900">×</button>
        </span>
        <button @click="resetFilter" class="text-xs text-red-500 hover:text-red-700 underline">Reset semua</button>
      </div>
    </div>

    <!-- Table -->
    <div class="card" style="overflow:hidden;">
      <!-- Loading -->
      <div v-if="employeeStore.loading" class="flex items-center justify-center py-16">
        <div class="flex flex-col items-center gap-3">
          <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p class="text-sm text-gray-500">Memuat data...</p>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!employeeStore.hasEmployees" class="flex flex-col items-center justify-center py-16 gap-3">
        <span class="text-5xl">📋</span>
        <p class="text-gray-500 font-medium">Tidak ada data pegawai</p>
        <p class="text-gray-400 text-sm">Coba ubah filter pencarian</p>
      </div>

      <template v-else>
        <!-- ══ MOBILE: Card list (< lg) ══ -->
        <div class="lg:hidden divide-y divide-gray-100">
          <div
            v-for="(emp, idx) in employees"
            :key="emp.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between gap-3">
              <!-- Kiri: info utama -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs text-gray-400 font-mono">{{ emp.no ?? idx + 1 }}</span>
                  <span :class="['inline-block px-1.5 py-0.5 rounded-full text-xs font-semibold', emp.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
                    {{ emp.jenisKelamin }}
                  </span>
                  <span class="inline-block bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-xs font-semibold">
                    {{ emp.golongan }}
                  </span>
                  <span v-if="emp.eselon" class="inline-block bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                    Eselon {{ emp.eselon }}
                  </span>
                </div>
                <p class="font-semibold text-gray-900 text-sm">{{ emp.nama }}</p>
                <p class="text-xs text-gray-500 font-mono mt-0.5">{{ emp.nip }}</p>
                <p class="text-xs text-blue-700 mt-1 font-medium">{{ emp.jabatan }}</p>
                <div class="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                  <span class="text-xs text-gray-500">📍 {{ emp.tempatTugas }}</span>
                  <span class="text-xs text-gray-500">🏢 {{ emp.unitKerja }}</span>
                  <span class="text-xs text-gray-500">🕌 {{ emp.agama }}</span>
                </div>
                <p v-if="emp.noHp" class="text-xs text-gray-400 mt-1">📞 {{ emp.noHp }}</p>
              </div>

              <!-- Kanan: aksi -->
              <div class="flex-shrink-0 relative">
                <button
                  :ref="el => { if (el) btnRefs[emp.id!] = el as HTMLElement }"
                  @click.stop="toggleMenu(emp.id!)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5"  r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="12" cy="19" r="1.5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ DESKTOP: Table (≥ lg) ══ -->
        <div
          class="hidden lg:block w-full overflow-x-auto"
          style="border-radius:0 0 0.75rem 0.75rem; transform:translateZ(0); will-change:transform;"
        >
        <table class="w-full" style="min-width:1280px;">
          <thead>
            <tr>
              <th class="table-header" style="width:40px">No</th>
              <th class="table-header" style="width:56px">Aksi</th>
              <th class="table-header cursor-pointer select-none" @click="toggleSort('nip')">
                <div class="flex items-center justify-center gap-1">
                  NIP <SortIcon :field="'nip'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header cursor-pointer select-none" @click="toggleSort('nama')">
                <div class="flex items-center justify-center gap-1">
                  Nama <SortIcon :field="'nama'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header cursor-pointer select-none" @click="toggleSort('tempatLahir')">
                <div class="flex items-center justify-center gap-1">
                  Tempat Lahir <SortIcon :field="'tempatLahir'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header">Alamat</th>
              <th class="table-header cursor-pointer select-none" @click="toggleSort('tanggalLahir')">
                <div class="flex items-center justify-center gap-1">
                  Tgl Lahir <SortIcon :field="'tanggalLahir'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header" style="width:36px">L/P</th>
              <th class="table-header cursor-pointer select-none" style="width:52px" @click="toggleSort('golongan')">
                <div class="flex items-center justify-center gap-1">
                  Gol <SortIcon :field="'golongan'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header cursor-pointer select-none" style="width:60px" @click="toggleSort('eselon')">
                <div class="flex items-center justify-center gap-1">
                  Eselon <SortIcon :field="'eselon'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header cursor-pointer select-none" @click="toggleSort('jabatan')">
                <div class="flex items-center justify-center gap-1">
                  Jabatan <SortIcon :field="'jabatan'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header cursor-pointer select-none" @click="toggleSort('tempatTugas')">
                <div class="flex items-center justify-center gap-1">
                  Tempat Tugas <SortIcon :field="'tempatTugas'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header cursor-pointer select-none" @click="toggleSort('agama')">
                <div class="flex items-center justify-center gap-1">
                  Agama <SortIcon :field="'agama'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header cursor-pointer select-none" @click="toggleSort('unitKerja')">
                <div class="flex items-center justify-center gap-1">
                  Unit Kerja <SortIcon :field="'unitKerja'" :current="sortField" :dir="sortDir" />
                </div>
              </th>
              <th class="table-header">No. HP</th>
              <th class="table-header">NPWP</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(emp, idx) in employees" :key="emp.id">
              <tr
                class="hover:bg-blue-50 transition-colors"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              >
                <!-- No -->
                <td class="table-cell text-center text-gray-500 text-xs">
                  {{ emp.no ?? (employeeStore.meta.page - 1) * employeeStore.meta.limit + idx + 1 }}
                </td>

                <!-- Aksi — titik 3 dengan Teleport dropdown -->
                <td class="table-cell text-center">
                  <div class="relative inline-block">
                    <button
                      :ref="el => { if (el) btnRefs[emp.id!] = el as HTMLElement }"
                      @click.stop="toggleMenu(emp.id!)"
                      class="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5"  r="1.5"/>
                        <circle cx="12" cy="12" r="1.5"/>
                        <circle cx="12" cy="19" r="1.5"/>
                      </svg>
                    </button>
                  </div>
                </td>

                <td class="table-cell font-mono text-xs text-center">{{ emp.nip }}</td>
                <td class="table-cell text-center">
                  <span class="font-medium text-gray-900 whitespace-nowrap text-sm">{{ emp.nama }}</span>
                </td>
                <td class="table-cell text-center whitespace-nowrap text-xs">{{ emp.tempatLahir }}</td>
                <td class="table-cell text-center text-xs" style="min-width:160px; max-width:220px;">
                  <span class="line-clamp-2 leading-relaxed block" :title="emp.alamat">{{ emp.alamat }}</span>
                </td>
                <td class="table-cell text-center whitespace-nowrap text-xs">{{ formatDate(emp.tanggalLahir) }}</td>
                <td class="table-cell text-center">
                  <span :class="['inline-block px-1.5 py-0.5 rounded-full text-xs font-semibold', emp.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
                    {{ emp.jenisKelamin }}
                  </span>
                </td>
                <td class="table-cell text-center">
                  <span class="inline-block bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-xs font-semibold">
                    {{ emp.golongan }}
                  </span>
                </td>
                <td class="table-cell text-center text-xs">{{ emp.eselon || '-' }}</td>
                <td class="table-cell text-center text-xs" style="min-width:160px; max-width:220px;">
                  <span class="line-clamp-2 leading-relaxed block" :title="emp.jabatan">{{ emp.jabatan }}</span>
                </td>
                <td class="table-cell text-center whitespace-nowrap text-xs">{{ emp.tempatTugas }}</td>
                <td class="table-cell text-center text-xs">{{ emp.agama }}</td>
                <td class="table-cell text-center text-xs">
                  <span class="inline-block bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">{{ emp.unitKerja }}</span>
                </td>
                <td class="table-cell text-center text-xs whitespace-nowrap">{{ emp.noHp || '-' }}</td>
                <td class="table-cell text-center text-xs font-mono">{{ emp.npwp || '-' }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        </div><!-- end desktop table wrapper -->
      </template><!-- end v-else -->

      <!-- Pagination -->
      <div v-if="employeeStore.meta.totalPages >= 1" class="border-t border-gray-100 px-4 py-3">
        <!-- Row 1: tombol navigasi (selalu tampil) -->
        <div class="flex items-center justify-center gap-1 mb-2">
          <button @click="changePage(employeeStore.meta.page - 1)"
            :disabled="employeeStore.meta.page === 1"
            class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium">
            ‹ Prev
          </button>
          <template v-for="p in pageNumbers" :key="p">
            <button v-if="p !== '...'" @click="changePage(Number(p))"
              :class="['px-3 py-1.5 text-xs border rounded-lg font-medium min-w-[32px]',
                employeeStore.meta.page === Number(p)
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700']">
              {{ p }}
            </button>
            <span v-else class="px-1 text-xs text-gray-400">…</span>
          </template>
          <button @click="changePage(employeeStore.meta.page + 1)"
            :disabled="employeeStore.meta.page === employeeStore.meta.totalPages"
            class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium">
            Next ›
          </button>
        </div>

        <!-- Row 2: info + page size -->
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs text-gray-500">
            {{ (employeeStore.meta.page - 1) * employeeStore.meta.limit + 1 }}–{{ Math.min(employeeStore.meta.page * employeeStore.meta.limit, employeeStore.meta.total) }}
            dari {{ employeeStore.meta.total }}
          </p>
          <div class="flex items-center gap-1.5">
            <select v-model="pageSize" @change="changePageSize"
              class="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
            <span class="text-xs text-gray-400">/ hal</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">Hapus Pegawai</h3>
              <p class="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <p class="text-sm text-gray-700 mb-6">
            Apakah Anda yakin ingin menghapus data pegawai <strong>{{ deleteTarget?.nama || '' }}</strong> (NIP: {{ deleteTarget?.nip || '' }})?
          </p>
          <div class="flex gap-3 justify-end">
            <button @click="deleteTarget = null" class="btn-secondary text-sm">Batal</button>
            <button @click="handleDelete" :disabled="employeeStore.saving" class="btn-danger text-sm">
              <svg v-if="employeeStore.saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Overlay tutup dropdown saat klik luar -->
    <div v-if="openMenuId" class="fixed inset-0 z-20" @click="openMenuId = null"/>

    <!-- Dropdown via Teleport — tidak terpotong overflow tabel -->
    <Teleport to="body">
      <template v-if="openMenuId && menuPos">
        <!-- Overlay -->
        <div class="fixed inset-0 z-40" @click="openMenuId = null"/>
        <!-- Menu -->
        <div
          class="fixed z-50 w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1 overflow-hidden"
          :style="{ top: menuPos.top + 'px', left: menuPos.left + 'px' }"
        >
          <NuxtLink
            :to="`/pegawai/${openMenuId}`"
            @click="openMenuId = null"
            class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Lihat Data
          </NuxtLink>

          <NuxtLink
            v-if="authStore.isOperator"
            :to="`/pegawai/${openMenuId}/edit`"
            @click="openMenuId = null"
            class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Edit Data
          </NuxtLink>

          <div v-if="authStore.isAdmin" class="border-t border-gray-100 mt-1 pt-1">
            <button
              @click="confirmDeleteById(openMenuId!); openMenuId = null"
              class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Hapus Data
            </button>
          </div>
        </div>
      </template>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import { employeeService } from '~/services/employeeService'
import { printService } from '~/services/printService'
import type { Employee } from '~/types/employee'

definePageMeta({ middleware: 'auth' })

const authStore      = useAuthStore()
const employeeStore  = useEmployeeStore()

const searchQuery    = ref('')
const filterUnitKerja = ref('')
const filterGolongan  = ref('')
const filterJK        = ref('')
const pageSize        = ref(10)
const deleteTarget    = ref<Employee | null>(null)
const openMenuId      = ref<string | null>(null)
const menuPos         = ref<{ top: number; left: number } | null>(null) as Ref<{ top: number; left: number } | null>
const btnRefs         = ref<Record<string, HTMLElement>>({})
const sortField       = ref('nama')
const sortDir         = ref<'asc' | 'desc'>('asc')

const golonganList = ['I/a','I/b','I/c','I/d','II/a','II/b','II/c','II/d','III/a','III/b','III/c','III/d','IV/a','IV/b','IV/c','IV/d','IV/e']

const hasActiveFilter = computed(() =>
  !!searchQuery.value || !!filterUnitKerja.value || !!filterGolongan.value || !!filterJK.value
)

// Explicitly typed computed for employees to help TypeScript
const employees = computed(() => employeeStore.employees)

function toggleMenu(id: string) {
  if (openMenuId.value === id) {
    openMenuId.value = null
    menuPos.value = null
    return
  }
  const btn = btnRefs.value[id]
  if (btn) {
    const rect = btn.getBoundingClientRect()
    // Posisi dropdown: di bawah tombol, rata kiri
    menuPos.value = {
      top:  rect.bottom + window.scrollY + 4,
      left: rect.left   + window.scrollX,
    }
  }
  openMenuId.value = id
}

let searchTimer: ReturnType<typeof setTimeout>
function debouncedSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => applyFilter(), 400)
}

function toggleSort(field: string) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'asc'
  }
  applyFilter()
}

function applyFilter() {
  employeeStore.setFilter({
    search:       searchQuery.value,
    unitKerja:    filterUnitKerja.value,
    golongan:     filterGolongan.value,
    jenisKelamin: filterJK.value,
    sortBy:       sortField.value,
    sortDir:      sortDir.value,
  })
  employeeStore.fetchEmployees(1)
}

function clearSearch() {
  searchQuery.value = ''
  applyFilter()
}

function resetFilter() {
  searchQuery.value = ''
  filterUnitKerja.value = ''
  filterGolongan.value = ''
  filterJK.value = ''
  employeeStore.resetFilter()
  employeeStore.fetchEmployees(1)
}

function changePage(page: number) {
  if (page < 1 || page > employeeStore.meta.totalPages) return
  employeeStore.fetchEmployees(page)
}

function changePageSize() {
  employeeStore.setPageSize(pageSize.value)
  employeeStore.fetchEmployees(1)
}

const pageNumbers = computed(() => {
  const total   = employeeStore.meta.totalPages
  const current = employeeStore.meta.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function confirmDelete(emp: Employee) {
  deleteTarget.value = emp
}

function confirmDeleteById(id: string) {
  const emp = employees.value.find(e => e.id === id)
  if (emp) deleteTarget.value = emp
}

async function handleDelete() {
  if (!deleteTarget.value?.id) return
  await employeeStore.deleteEmployee(deleteTarget.value.id)
  deleteTarget.value = null
}

async function handlePrint() {
  const employees = await employeeService.getAllEmployees(employeeStore.filter)
  printService.printEmployeeList(employees, filterUnitKerja.value || undefined)
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  const fallback = img.nextElementSibling as HTMLElement
  if (fallback) fallback.style.display = 'flex'
}

onMounted(async () => {
  await employeeStore.fetchUnitKerjaList()
  await employeeStore.fetchEmployees(1)
})
</script>
