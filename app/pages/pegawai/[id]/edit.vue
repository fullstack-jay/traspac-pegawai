<template>
  <div class="max-w-5xl mx-auto space-y-4">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500">
      <NuxtLink to="/" class="hover:text-blue-700">Dashboard</NuxtLink>
      <span>›</span>
      <NuxtLink to="/pegawai" class="hover:text-blue-700">Daftar Pegawai</NuxtLink>
      <span>›</span>
      <span class="text-gray-900 font-medium">Edit Pegawai</span>
    </nav>

    <!-- Loading -->
    <div v-if="employeeStore.loading" class="card p-12 flex items-center justify-center">
      <svg class="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>

    <!-- Form -->
    <ClientOnly>
      <div v-if="selectedEmployee">
        <div class="card p-4 flex items-center gap-3 bg-yellow-50 border-yellow-200">
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          <div>
            <p class="text-sm font-medium text-yellow-800">Mode Edit</p>
            <p class="text-xs text-yellow-600">Mengubah data: {{ selectedEmployee.nama }} (NIP: {{ selectedEmployee.nip }})</p>
          </div>
        </div>

        <EmployeeForm
          :employee="selectedEmployee"
          :is-edit="true"
          @submit="handleSubmit"
        />
      </div>
    </ClientOnly>

    <!-- Success toast -->
    <Teleport to="body">
      <div v-if="showSuccess" class="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Data berhasil diperbarui!
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Employee } from '~/types/employee'

definePageMeta({ middleware: 'auth' })

const employeeStore = useEmployeeStore()
const route = useRoute()
const router = useRouter()
const showSuccess = ref(false)

const selectedEmployee = computed<Employee | null>(() => employeeStore.selectedEmployee)

onMounted(async () => {
  await employeeStore.fetchEmployee(route.params.id as string)
})

async function handleSubmit(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await employeeStore.updateEmployee(route.params.id as string, data)
    showSuccess.value = true
    setTimeout(() => {
      router.push('/pegawai')
    }, 1500)
  } catch {}
}
</script>
