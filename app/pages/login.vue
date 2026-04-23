<template>
  <div class="w-full max-w-[360px]">

    <!-- Card — semua konten di dalam -->
    <div class="rounded-2xl px-6 py-7"
      style="background:#111115; border:1px solid #222228; box-shadow:0 20px 60px rgba(0,0,0,0.5);">

      <!-- Logo & heading -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-4"
          style="background:#1c1c22; border:1px solid #2e2e36;">
          <svg width="18" height="18" fill="none" stroke="#e4e4e7" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <h1 class="text-white font-semibold text-[17px] tracking-tight">Masuk ke TRASPAC PEGAWAI</h1>
        <p class="text-[13px] mt-1" style="color:#71717a">Selamat datang! Silakan masuk untuk melanjutkan.</p>
      </div>

      <!-- Error -->
      <div v-if="authStore.error"
        class="mb-4 flex items-center gap-2 text-red-400 text-xs px-3.5 py-2.5 rounded-lg"
        style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.18)">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        {{ authStore.error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-3.5">
        <div>
          <label class="block text-[13px] font-medium mb-1.5" style="color:#a1a1aa">Username</label>
          <input
            v-model="form.username"
            type="text"
            placeholder="Masukkan username"
            required
            autocomplete="username"
            class="w-full text-sm text-white placeholder-zinc-600 rounded-lg px-3.5 py-2.5 outline-none transition-all duration-150"
            style="background:#0c0c10; border:1px solid #2a2a30;"
            @focus="e => (e.target as HTMLInputElement).style.borderColor='#7c3aed'"
            @blur="e => (e.target as HTMLInputElement).style.borderColor='#2a2a30'"
          />
        </div>

        <div>
          <label class="block text-[13px] font-medium mb-1.5" style="color:#a1a1aa">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan password"
              required
              autocomplete="current-password"
              class="w-full text-sm text-white placeholder-zinc-600 rounded-lg px-3.5 py-2.5 pr-10 outline-none transition-all duration-150"
              style="background:#0c0c10; border:1px solid #2a2a30;"
              @focus="e => (e.target as HTMLInputElement).style.borderColor='#7c3aed'"
              @blur="e => (e.target as HTMLInputElement).style.borderColor='#2a2a30'"
            />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center" style="color:#52525b">
              <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" :disabled="authStore.loading"
          class="w-full flex items-center justify-center gap-2 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style="background:#7c3aed"
          @mouseenter="e => { if (!authStore.loading)(e.currentTarget as HTMLElement).style.background='#6d28d9' }"
          @mouseleave="e => (e.currentTarget as HTMLElement).style.background='#7c3aed'">
          <svg v-if="authStore.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ authStore.loading ? 'Memproses...' : 'Masuk →' }}
        </button>
      </form>

      <!-- Footer -->
      <p class="text-center text-[11px] mt-5" style="color:#3f3f46">
        © {{ currentYear }} Rizqi Reza Ardiansyah
      </p>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({ layout: 'auth' })

const authStore    = useAuthStore()
const router       = useRouter()
const form         = reactive({ username: '', password: '' })
const showPassword = ref(false)
const currentYear  = new Date().getFullYear()

async function handleLogin() {
  try {
    await authStore.login(form)
    router.push('/')
  } catch {}
}
</script>
