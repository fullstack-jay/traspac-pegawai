<template>
  <div class="space-y-6">

    <!-- Welcome banner -->
    <div class="bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl px-6 py-5 text-white flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold">Selamat Datang, {{ authStore.currentUser?.name }}</h2>
        <p class="text-blue-200 text-sm mt-0.5">{{ currentDate }} — Sistem Informasi Manajemen Pegawai</p>
      </div>
      <div class="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
        <svg class="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <span class="text-white text-xs font-medium">TRASPAC PEGAWAI</span>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div v-for="stat in stats" :key="stat.label"
        class="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', stat.bg]">
          <svg class="w-5 h-5" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-gray-500 font-medium truncate">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-gray-900 leading-tight">{{ stat.value }}</p>
          <p class="text-xs text-gray-400 truncate">{{ stat.sub }}</p>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Aksi Cepat -->
      <div class="card p-6">
        <h3 class="font-semibold text-gray-900 mb-4 text-sm">Aksi Cepat</h3>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink to="/pegawai"
            class="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
            <div class="w-9 h-9 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
              <svg class="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-gray-700 group-hover:text-blue-800">Daftar Pegawai</span>
          </NuxtLink>

          <NuxtLink to="/pegawai/tambah"
            class="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all">
            <div class="w-9 h-9 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
              <svg class="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-gray-700 group-hover:text-green-800">Tambah Pegawai</span>
          </NuxtLink>

          <NuxtLink to="/pegawai"
            class="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all">
            <div class="w-9 h-9 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
              <svg class="w-4 h-4 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-gray-700 group-hover:text-orange-800">Cetak Daftar</span>
          </NuxtLink>

          <NuxtLink to="/pegawai"
            class="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all">
            <div class="w-9 h-9 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
              <svg class="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-gray-700 group-hover:text-purple-800">Cari Pegawai</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Distribusi Unit Kerja — card grid, no progress bar -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-900 text-sm">Distribusi Unit Kerja</h3>
          <span class="text-xs text-gray-400">{{ totalEmployees }} pegawai</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div
            v-for="(unit, idx) in unitStats"
            :key="unit.name"
            :class="['rounded-xl p-3.5 border transition-all hover:shadow-sm', unitColors[idx % unitColors.length].bg, unitColors[idx % unitColors.length].border]"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p :class="['text-[11px] font-medium leading-tight break-words', unitColors[idx % unitColors.length].text]">
                  {{ unit.name }}
                </p>
                <p :class="['text-xl font-bold mt-1 leading-none', unitColors[idx % unitColors.length].num]">
                  {{ unit.count }}
                </p>
              </div>
              <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', unitColors[idx % unitColors.length].icon]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { employeeService } from '~/services/employeeService'
import type { Employee } from '~/types/employee'

definePageMeta({ middleware: 'auth' })

const authStore    = useAuthStore()
const allEmployees = ref<Employee[]>([])

onMounted(async () => {
  allEmployees.value = await employeeService.getAllEmployees()
})

const currentDate = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
)

const totalEmployees = computed(() => allEmployees.value.length)

const stats = computed(() => [
  {
    label: 'Total Pegawai',
    value: totalEmployees.value,
    sub: 'Seluruh pegawai aktif',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    label: 'Laki-laki',
    value: allEmployees.value.filter(e => e.jenisKelamin === 'L').length,
    sub: 'Jenis kelamin L',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    label: 'Perempuan',
    value: allEmployees.value.filter(e => e.jenisKelamin === 'P').length,
    sub: 'Jenis kelamin P',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    label: 'Unit Kerja',
    value: new Set(allEmployees.value.map(e => e.unitKerja)).size,
    sub: 'Unit kerja aktif',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
])

const unitStats = computed(() => {
  const map = new Map<string, number>()
  allEmployees.value.forEach(e => {
    map.set(e.unitKerja, (map.get(e.unitKerja) || 0) + 1)
  })
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
})

const unitColors = [
  { bg: 'bg-blue-50',   border: 'border-blue-100',   text: 'text-blue-700',   num: 'text-blue-900',   sub: 'text-blue-400',   icon: 'bg-blue-100 text-blue-600'   },
  { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700', num: 'text-violet-900', sub: 'text-violet-400', icon: 'bg-violet-100 text-violet-600' },
  { bg: 'bg-emerald-50',border: 'border-emerald-100',text: 'text-emerald-700',num: 'text-emerald-900',sub: 'text-emerald-400',icon: 'bg-emerald-100 text-emerald-600'},
  { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', num: 'text-orange-900', sub: 'text-orange-400', icon: 'bg-orange-100 text-orange-600' },
  { bg: 'bg-pink-50',   border: 'border-pink-100',   text: 'text-pink-700',   num: 'text-pink-900',   sub: 'text-pink-400',   icon: 'bg-pink-100 text-pink-600'   },
  { bg: 'bg-cyan-50',   border: 'border-cyan-100',   text: 'text-cyan-700',   num: 'text-cyan-900',   sub: 'text-cyan-400',   icon: 'bg-cyan-100 text-cyan-600'   },
]
</script>
