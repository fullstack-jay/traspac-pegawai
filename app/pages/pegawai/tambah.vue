<template>
  <div class="max-w-5xl mx-auto space-y-4">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700">Dashboard</NuxtLink>
      <span>›</span>
      <NuxtLink to="/pegawai" class="hover:text-blue-700">Daftar Pegawai</NuxtLink>
      <span>›</span>
      <span class="text-gray-900 font-medium">Tambah Pegawai</span>
    </nav>

    <!-- Success toast -->
    <Teleport to="body">
      <div v-if="showSuccess" class="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Data pegawai berhasil disimpan!
      </div>
    </Teleport>

    <EmployeeForm @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Employee } from '~/types/employee'

definePageMeta({ middleware: 'auth' })

const employeeStore = useEmployeeStore()
const router = useRouter()
const showSuccess = ref(false)

async function handleSubmit(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await employeeStore.createEmployee(data)
    showSuccess.value = true
    setTimeout(() => {
      router.push('/pegawai')
    }, 1500)
  } catch {}
}
</script>
