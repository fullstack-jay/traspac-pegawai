<template>
  <div class="min-h-screen bg-gray-50 flex overflow-hidden">

    <!-- ═══ OVERLAY mobile (klik untuk tutup sidebar) ═══ -->
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- ═══ SIDEBAR ═══ -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-blue-900 text-white transition-all duration-300 flex-shrink-0',
        // Desktop: collapsed = w-16, open = w-64
        // Mobile: hidden saat tutup, w-64 saat buka (overlay)
        sidebarOpen ? 'w-64' : (isMobile ? '-translate-x-full w-64' : 'w-16')
      ]"
    >
      <!-- Header sidebar -->
      <div class="flex items-center h-16 border-b border-blue-800 flex-shrink-0 overflow-hidden"
        :class="sidebarOpen ? 'px-3 gap-2' : 'justify-center px-0'">

        <template v-if="sidebarOpen">
          <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-blue-900 font-bold text-sm">T</span>
          </div>
          <span class="font-bold text-xs truncate flex-1">TRASPAC PEGAWAI</span>
          <button @click="sidebarOpen = false"
            class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded hover:bg-blue-800 text-blue-300 hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        </template>

        <template v-else>
          <button @click="sidebarOpen = true"
            class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-800 text-blue-300 hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </template>
      </div>

      <!-- Nav items -->
      <nav class="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :title="!sidebarOpen ? item.label : ''"
          :class="[
            'flex items-center py-3 text-blue-200 hover:bg-blue-800 hover:text-white transition-colors',
            sidebarOpen ? 'px-4 gap-3' : 'px-0 justify-center'
          ]"
          active-class="bg-blue-800 !text-white border-r-2 border-white"
          @click="isMobile && (sidebarOpen = false)"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path :d="item.iconPath"/>
            <path v-if="item.iconPath2" :d="item.iconPath2"/>
          </svg>
          <span v-if="sidebarOpen" class="text-sm font-medium truncate">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- User info -->
      <div class="border-t border-blue-800 flex-shrink-0"
        :class="sidebarOpen ? 'p-4' : 'py-4 flex justify-center'">
        <div :class="sidebarOpen ? 'flex items-center gap-3' : ''">
          <div class="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-bold">{{ userInitial }}</span>
          </div>
          <template v-if="sidebarOpen">
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium truncate">{{ authStore.currentUser?.name }}</p>
              <p class="text-xs text-blue-300 capitalize">{{ authStore.currentUser?.role }}</p>
            </div>
            <button @click="handleLogout" title="Logout"
              class="text-blue-300 hover:text-red-400 transition-colors flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </template>
        </div>
      </div>
    </aside>

    <!-- ═══ MAIN CONTENT ═══ -->
    <div :class="[
      'flex flex-col min-h-screen w-full transition-all duration-300',
      !isMobile && (sidebarOpen ? 'pl-64' : 'pl-16')
    ]">

      <!-- Top bar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-3 sticky top-0 z-40 flex-shrink-0">
        <!-- Hamburger — mobile only -->
        <button
          class="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          @click="sidebarOpen = true"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <div class="min-w-0 flex-1">
          <h1 class="text-sm font-semibold text-gray-900 truncate">{{ pageTitle }}</h1>
          <p class="text-xs text-gray-500 hidden sm:block">Sistem Informasi Manajemen Pegawai</p>
        </div>
        <div class="ml-auto flex items-center gap-3 flex-shrink-0">
          <span class="text-xs text-gray-500 hidden md:block">{{ currentDate }}</span>
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-700 text-xs font-bold">{{ userInitial }}</span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-3 sm:p-6 min-w-0">
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const authStore = useAuthStore()
const router    = useRouter()
const route     = useRoute()

// Deteksi mobile
const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  // Desktop: default open, Mobile: default closed
  sidebarOpen.value = !isMobile.value
})
onUnmounted(() => window.removeEventListener('resize', checkMobile))

const sidebarOpen = ref(true)

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    iconPath2: null,
  },
  {
    to: '/pegawai',
    label: 'Daftar Pegawai',
    iconPath:  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0',
    iconPath2: 'M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    to: '/pegawai/tambah',
    label: 'Tambah Pegawai',
    iconPath:  'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z',
    iconPath2: 'M3 20a6 6 0 0112 0v1H3v-1z',
  },
]

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/': 'Dashboard',
    '/pegawai': 'Daftar Pegawai',
    '/pegawai/tambah': 'Tambah Pegawai',
  }
  if (route.path.includes('/pegawai/') && route.path.includes('/edit')) return 'Edit Pegawai'
  if (route.path.includes('/pegawai/') && !route.path.includes('tambah')) return 'Detail Pegawai'
  return map[route.path] || 'TRASPAC PEGAWAI'
})

const userInitial = computed(() => {
  const name = authStore.currentUser?.name || 'U'
  return name.charAt(0).toUpperCase()
})

const currentDate = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
