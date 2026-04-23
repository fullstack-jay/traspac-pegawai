<template>
  <div class="max-w-4xl mx-auto space-y-4">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700">Dashboard</NuxtLink>
      <span>›</span>
      <NuxtLink to="/pegawai" class="hover:text-blue-700">Daftar Pegawai</NuxtLink>
      <span>›</span>
      <span class="text-gray-900 font-medium">Detail Pegawai</span>
    </nav>

    <!-- Loading -->
    <div v-if="employeeStore.loading" class="card p-12 flex items-center justify-center">
      <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>

    <!-- Content -->
    <ClientOnly>
      <div v-if="emp">
        <!-- Profile card -->
        <div class="card p-6">
          <div class="flex flex-col sm:flex-row items-start gap-6">
            <!-- Foto -->
            <div class="flex-shrink-0">
              <div class="w-28 h-32 rounded-xl overflow-hidden bg-blue-100 border-2 border-blue-200">
                <img v-if="emp.foto" :src="emp.foto" :alt="emp.nama" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-blue-700 font-black text-4xl">{{ emp.nama.charAt(0) }}</span>
                </div>
              </div>
            </div>

            <!-- Info utama -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ emp.nama }}</h2>
                  <p class="text-sm text-gray-500 font-mono mt-0.5">NIP: {{ emp.nip }}</p>
                  <p class="text-sm text-blue-700 font-medium mt-1">{{ emp.jabatan }}</p>
                </div>
                <div class="flex gap-2 flex-shrink-0">
                  <NuxtLink
                    v-if="authStore.isOperator"
                    :to="`/pegawai/${emp.id}/edit`"
                    class="btn-secondary text-sm"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Edit
                  </NuxtLink>
                </div>
              </div>

              <!-- Badges -->
              <div class="flex flex-wrap gap-2 mt-3">
                <span class="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                  Gol. {{ emp.golongan }}
                </span>
                <span v-if="emp.eselon" class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                  Eselon {{ emp.eselon }}
                </span>
                <span :class="['inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium', emp.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">
                  {{ emp.jenisKelamin === 'L' ? '♂ Laki-laki' : '♀ Perempuan' }}
                </span>
                <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                  🏢 {{ emp.unitKerja }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detail grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Data Pribadi -->
          <div class="card p-6">
            <h3 class="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Data Pribadi</h3>
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Tempat Lahir</dt>
                <dd class="text-sm font-medium text-gray-900">{{ emp.tempatLahir }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Tanggal Lahir</dt>
                <dd class="text-sm font-medium text-gray-900">{{ formatDate(emp.tanggalLahir) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Agama</dt>
                <dd class="text-sm font-medium text-gray-900">{{ emp.agama }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">No. HP</dt>
                <dd class="text-sm font-medium text-gray-900">{{ emp.noHp || '-' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">NPWP</dt>
                <dd class="text-sm font-mono text-gray-900">{{ emp.npwp || '-' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500 mb-1">Alamat</dt>
                <dd class="text-sm font-medium text-gray-900">{{ emp.alamat }}</dd>
              </div>
            </dl>
          </div>

          <!-- Data Kepegawaian -->
          <div class="card p-6">
            <h3 class="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Data Kepegawaian</h3>
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Golongan</dt>
                <dd class="text-sm font-medium text-gray-900">{{ emp.golongan }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Eselon</dt>
                <dd class="text-sm font-medium text-gray-900">{{ emp.eselon || '-' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Jabatan</dt>
                <dd class="text-sm font-medium text-gray-900 text-right max-w-[200px]">{{ emp.jabatan }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Tempat Tugas</dt>
                <dd class="text-sm font-medium text-gray-900">{{ emp.tempatTugas }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Unit Kerja</dt>
                <dd class="text-sm font-medium text-gray-900 text-right max-w-[200px]">{{ emp.unitKerja }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Back -->
        <div class="flex justify-start">
          <NuxtLink to="/pegawai" class="btn-secondary text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali ke Daftar
          </NuxtLink>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Employee } from '~/types/employee'

definePageMeta({ middleware: 'auth' })

const employeeStore = useEmployeeStore()
const authStore = useAuthStore()
const route = useRoute()

const emp = computed<Employee | null>(() => employeeStore.selectedEmployee)

onMounted(async () => {
  await employeeStore.fetchEmployee(route.params.id as string)
})

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>
