<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Foto Upload -->
    <div class="card p-6">
      <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span class="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
        Foto Pegawai
      </h3>
      <div class="flex items-start gap-6">
        <!-- Preview -->
        <div class="flex-shrink-0">
          <div class="w-28 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
            <img v-if="fotoPreview" :src="fotoPreview" alt="Preview Foto" class="w-full h-full object-cover" />
            <div v-else class="text-center p-2">
              <svg class="w-8 h-8 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <p class="text-xs text-gray-400 mt-1">Foto</p>
            </div>
            <!-- Upload spinner overlay -->
            <div v-if="uploading" class="absolute inset-0 bg-black/40 flex items-center justify-center">
              <svg class="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          </div>
          <!-- Status upload -->
          <div v-if="fotoPreview && !uploading && fotoUrl" class="flex items-center gap-1 mt-1.5">
            <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-xs text-green-600">Terupload</span>
          </div>
          <div v-if="fotoPreview && uploading" class="flex items-center gap-1 mt-1.5">
            <span class="text-xs text-blue-500">Mengupload...</span>
          </div>
        </div>
        <!-- Upload -->
        <div class="flex-1">
          <label class="label-field">Upload Foto</label>
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer"
            @click="fotoInput?.click()"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="text-sm text-gray-600">Klik atau drag & drop foto</p>
            <p class="text-xs text-gray-400 mt-1">JPG, PNG, max 2MB</p>
          </div>
          <input ref="fotoInput" type="file" accept="image/*" class="hidden" @change="handleFotoChange" />
          <p v-if="uploadError" class="text-red-500 text-xs mt-1">{{ uploadError }}</p>
          <button v-if="fotoPreview" type="button" @click="clearFoto"
            class="text-xs text-red-500 hover:text-red-700 mt-2 block">
            Hapus foto
          </button>
        </div>
      </div>
    </div>

    <!-- Data Pribadi -->
    <div class="card p-6">
      <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span class="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
        Data Pribadi
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- NIP -->
        <div class="lg:col-span-1">
          <label class="label-field">NIP <span class="text-red-500">*</span></label>
          <input v-model="form.nip" type="text" class="input-field font-mono" placeholder="Contoh: 19680315199003001" required maxlength="20" />
        </div>

        <!-- Nama -->
        <div class="lg:col-span-2">
          <label class="label-field">Nama Lengkap <span class="text-red-500">*</span></label>
          <input v-model="form.nama" type="text" class="input-field" placeholder="Nama lengkap pegawai" required />
        </div>

        <!-- Tempat Lahir -->
        <div>
          <label class="label-field">Tempat Lahir <span class="text-red-500">*</span></label>
          <input v-model="form.tempatLahir" type="text" class="input-field" placeholder="Kota tempat lahir" required />
        </div>

        <!-- Tanggal Lahir -->
        <div>
          <label class="label-field">Tanggal Lahir <span class="text-red-500">*</span></label>
          <input v-model="form.tanggalLahir" type="date" class="input-field" required />
        </div>

        <!-- Jenis Kelamin -->
        <div>
          <label class="label-field">Jenis Kelamin <span class="text-red-500">*</span></label>
          <select v-model="form.jenisKelamin" class="input-field" required>
            <option value="">Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <!-- Agama -->
        <div>
          <label class="label-field">Agama <span class="text-red-500">*</span></label>
          <select
            :value="formIds.agamaId"
            @change="e => { const id = Number((e.target as HTMLSelectElement).value); formIds.agamaId = id; form.agama = agamaList.find(x => x.id === id)?.nama ?? '' }"
            class="input-field" required>
            <option value="">Pilih agama</option>
            <option v-for="a in agamaList" :key="a.id" :value="a.id">{{ a.nama }}</option>
          </select>
        </div>

        <!-- No HP -->
        <div>
          <label class="label-field">No. HP</label>
          <input v-model="form.noHp" type="tel" class="input-field" placeholder="08xxxxxxxxxx" />
        </div>

        <!-- NPWP -->
        <div>
          <label class="label-field">NPWP</label>
          <input
            :value="form.npwp"
            @input="handleNpwpInput"
            @keydown="handleNpwpKeydown"
            type="text"
            inputmode="numeric"
            class="input-field font-mono tracking-wider"
            placeholder="XX.XXX.XXX.X-XXX.XXX"
            maxlength="20"
          />
        </div>

        <!-- Alamat -->
        <div class="lg:col-span-3">
          <label class="label-field">Alamat Lengkap <span class="text-red-500">*</span></label>
          <textarea v-model="form.alamat" class="input-field resize-none" rows="2" placeholder="Alamat lengkap" required />
        </div>
      </div>
    </div>

    <!-- Data Kepegawaian -->
    <div class="card p-6">
      <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span class="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
        Data Kepegawaian
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Golongan -->
        <div>
          <label class="label-field">Golongan <span class="text-red-500">*</span></label>
          <select
            :value="formIds.golonganId"
            @change="e => { const id = Number((e.target as HTMLSelectElement).value); formIds.golonganId = id; form.golongan = golonganList.find(x => x.id === id)?.nama ?? '' }"
            class="input-field" required>
            <option value="">Pilih golongan</option>
            <option v-for="g in golonganList" :key="g.id" :value="g.id">{{ g.nama }}</option>
          </select>
        </div>

        <!-- Eselon -->
        <div>
          <label class="label-field">Eselon</label>
          <select
            :value="formIds.eselonId"
            @change="e => { const id = Number((e.target as HTMLSelectElement).value); formIds.eselonId = id || null; form.eselon = eselonList.find(x => x.id === id)?.nama ?? '' }"
            class="input-field">
            <option value="">Tidak ada</option>
            <option v-for="e in eselonList" :key="e.id" :value="e.id">{{ e.nama }}</option>
          </select>
        </div>

        <!-- Jabatan -->
        <div class="lg:col-span-1">
          <label class="label-field">Jabatan <span class="text-red-500">*</span></label>
          <input v-model="form.jabatan" type="text" class="input-field" placeholder="Nama jabatan" required />
        </div>

        <!-- Tempat Tugas -->
        <div>
          <label class="label-field">Tempat Tugas <span class="text-red-500">*</span></label>
          <input v-model="form.tempatTugas" type="text" class="input-field" placeholder="Kota tempat tugas" required />
        </div>

        <!-- Unit Kerja -->
        <div class="lg:col-span-2">
          <label class="label-field">Unit Kerja <span class="text-red-500">*</span></label>
          <select
            :value="formIds.unitKerjaId"
            @change="e => { const id = Number((e.target as HTMLSelectElement).value); formIds.unitKerjaId = id; form.unitKerja = unitKerjaList.find(x => x.id === id)?.nama ?? '' }"
            class="input-field" required>
            <option value="">Pilih unit kerja</option>
            <option v-for="u in unitKerjaList" :key="u.id" :value="u.id">{{ u.nama }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="employeeStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
      <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
      </svg>
      <p class="text-red-700 text-sm">{{ employeeStore.error }}</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3">
      <NuxtLink to="/pegawai" class="btn-secondary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Batal
      </NuxtLink>
      <button type="submit" :disabled="employeeStore.saving" class="btn-primary">
        <svg v-if="employeeStore.saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ employeeStore.saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Simpan Data') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { uploadService } from '~/services/uploadService'
import { masterService } from '~/services/masterService'
import type { Employee } from '~/types/employee'

const props = defineProps<{
  employee?: Employee | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  submit: [data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>]
}>()

const employeeStore = useEmployeeStore()

const fotoPreview = ref<string>('')   // untuk tampilan (bisa base64 atau URL)
const fotoUrl = ref<string>('')       // URL final yang disimpan ke DB
const uploadError = ref('')
const uploading = ref(false)
const fotoInput = ref<HTMLInputElement>()

const agamaList    = ref<{ id: number; nama: string }[]>([])
const golonganList = ref<{ id: number; nama: string }[]>([])
const eselonList   = ref<{ id: number; nama: string }[]>([])
const unitKerjaList = ref<{ id: number; nama: string }[]>([])

// Form pakai nama untuk display, tapi kirim ID ke backend
const formIds = reactive({
  golonganId:  null as number | null,
  eselonId:    null as number | null,
  agamaId:     null as number | null,
  unitKerjaId: null as number | null,
})

const form = reactive<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>({
  nip: '',
  nama: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: 'L',
  alamat: '',
  golongan: '',
  eselon: '',
  jabatan: '',
  tempatTugas: '',
  agama: '',
  unitKerja: '',
  noHp: '',
  npwp: '',
  foto: '',
})

watch(() => props.employee, (emp) => {
  if (emp) {
    Object.assign(form, {
      nip:          emp.nip,
      nama:         emp.nama,
      tempatLahir:  emp.tempatLahir,
      tanggalLahir: emp.tanggalLahir,
      jenisKelamin: emp.jenisKelamin,
      alamat:       emp.alamat,
      golongan:     emp.golongan,
      eselon:       emp.eselon,
      jabatan:      emp.jabatan,
      tempatTugas:  emp.tempatTugas,
      agama:        emp.agama,
      unitKerja:    emp.unitKerja,
      noHp:         emp.noHp,
      npwp:         formatNpwp(emp.npwp || ''),
      foto:         emp.foto || '',
    })
    fotoPreview.value = emp.foto || ''
    fotoUrl.value     = emp.foto || ''

    // Set ID setelah master data loaded
    nextTick(() => {
      const g = golonganList.value.find(x => x.nama === emp.golongan)
      const e = eselonList.value.find(x => x.nama === emp.eselon)
      const a = agamaList.value.find(x => x.nama === emp.agama)
      const u = unitKerjaList.value.find(x => x.nama === emp.unitKerja)
      if (g) formIds.golonganId  = g.id
      if (e) formIds.eselonId    = e.id
      if (a) formIds.agamaId     = a.id
      if (u) formIds.unitKerjaId = u.id
    })
  }
}, { immediate: true })

onMounted(async () => {
  const [agama, golongan, eselon, unitKerja] = await Promise.all([
    masterService.getAgama(),
    masterService.getGolongan(),
    masterService.getEselon(),
    masterService.getUnitKerja(),
  ])
  agamaList.value    = agama
  golonganList.value = golongan
  eselonList.value   = eselon
  unitKerjaList.value = unitKerja
})

async function handleFotoChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploadError.value = ''

  // Validasi awal
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'File harus berupa gambar (JPG/PNG)'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'Ukuran file maksimal 2MB'
    return
  }

  // 1. Tampilkan preview lokal dulu (base64) — langsung muncul
  const reader = new FileReader()
  reader.onload = (ev) => {
    fotoPreview.value = ev.target?.result as string
  }
  reader.readAsDataURL(file)

  // 2. Upload ke server di background
  uploading.value = true
  try {
    const serverUrl = await uploadService.uploadPhoto(file, props.employee?.id || 'new')
    fotoUrl.value = serverUrl   // simpan URL server
    form.foto     = serverUrl   // yang dikirim ke backend
  } catch (err: any) {
    uploadError.value = err.message
    // Preview lokal tetap tampil meski upload gagal
    // form.foto tetap kosong / tidak berubah
  } finally {
    uploading.value = false
  }
}

function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  const input = fotoInput.value
  if (input) {
    const dt = new DataTransfer()
    dt.items.add(file)
    input.files = dt.files
    input.dispatchEvent(new Event('change'))
  }
}

function clearFoto() {
  fotoPreview.value = ''
  fotoUrl.value     = ''
  form.foto         = ''
  if (fotoInput.value) fotoInput.value.value = ''
}

function handleSubmit() {
  emit('submit', {
    ...form,
    golonganId:  formIds.golonganId,
    eselonId:    formIds.eselonId,
    agamaId:     formIds.agamaId,
    unitKerjaId: formIds.unitKerjaId,
  } as any)
}

/**
 * Format NPWP: XX.XXX.XXX.X-XXX.XXX
 * Hanya angka yang diproses, titik dan strip otomatis
 */
function formatNpwp(digits: string): string {
  // Ambil hanya angka, max 15 digit
  const d = digits.replace(/\D/g, '').slice(0, 15)
  if (!d) return ''

  let result = ''
  // Pola: 2 . 3 . 3 . 1 - 3 . 3
  // index: 0-1 | 2-4 | 5-7 | 8 | 9-11 | 12-14
  for (let i = 0; i < d.length; i++) {
    if (i === 2 || i === 5 || i === 8)      result += '.'
    else if (i === 9)                        result += '-'
    else if (i === 12)                       result += '.'
    result += d[i]
  }
  return result
}

function handleNpwpInput(e: Event) {
  const input = e.target as HTMLInputElement
  const cursorPos = input.selectionStart ?? 0
  const raw = input.value

  // Hitung berapa digit sebelum cursor
  const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length

  const formatted = formatNpwp(raw)
  form.npwp = formatted
  input.value = formatted

  // Kembalikan posisi cursor setelah format
  // Hitung posisi baru berdasarkan jumlah digit yang sama
  let newPos = 0
  let digitCount = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      digitCount++
      if (digitCount === digitsBeforeCursor) {
        newPos = i + 1
        break
      }
    }
  }
  // Jika cursor di akhir
  if (digitsBeforeCursor === 0) newPos = 0
  if (digitCount < digitsBeforeCursor) newPos = formatted.length

  requestAnimationFrame(() => {
    input.setSelectionRange(newPos, newPos)
  })
}

function handleNpwpKeydown(e: KeyboardEvent) {
  const input = e.target as HTMLInputElement
  // Izinkan: angka, backspace, delete, arrow, tab, ctrl+a/c/v/x
  const allowed = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
    'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End',
  ]
  if (allowed.includes(e.key)) return
  if (e.ctrlKey || e.metaKey) return
  if (!/^\d$/.test(e.key)) {
    e.preventDefault()
  }
}
</script>
