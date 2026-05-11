<template>
    <div>
        <button @click="openModal" class="flex items-center gap-2 text-sm btn-outline">
            <Upload class="w-4 h-4" />
            Unggah CV
        </button>

        <!-- Modal -->
        <Transition name="fade">
            <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
                @click.self="closeModal">
                <Transition name="scale">
                    <div v-if="modalOpen" class="w-full max-w-md p-6 bg-white rounded-2xl shadow-modal">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-lg font-semibold text-secondary-900">Unggah CV</h2>
                            <button @click="closeModal" class="text-secondary-400 hover:text-secondary-600">
                                <X class="w-5 h-5" />
                            </button>
                        </div>

                        <div class="flex flex-col gap-4">
                            <!-- Upload Area -->
                            <div class="p-8 text-center transition-colors border-2 border-dashed cursor-pointer rounded-xl"
                                :class="isDragging ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'"
                                @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                                @drop.prevent="handleDrop" @click="triggerFileInput">
                                <input ref="fileInputRef" type="file" accept=".pdf,.docx" class="hidden"
                                    @change="handleFileChange" />

                                <div v-if="!selectedFile">
                                    <FileUp class="w-10 h-10 mx-auto mb-3 text-secondary-300" />
                                    <p class="text-sm font-medium text-secondary-600">
                                        Seret file ke sini atau klik untuk memilih
                                    </p>
                                    <p class="mt-1 text-xs text-secondary-400">Mendukung PDF dan DOCX, maksimal 5MB</p>
                                </div>

                                <div v-else class="flex items-center justify-center gap-3">
                                    <FileText class="w-8 h-8 text-primary-500" />
                                    <div class="text-left">
                                        <p class="text-sm font-medium text-secondary-900">{{ selectedFile.name }}</p>
                                        <p class="text-xs text-secondary-400">{{ formatFileSize(selectedFile.size) }}
                                        </p>
                                    </div>
                                    <button @click.stop="clearFile" class="ml-2 text-secondary-400 hover:text-red-500">
                                        <X class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <!-- Mode Selection -->
                            <div class="flex flex-col gap-2">
                                <p class="text-sm font-medium text-secondary-700">Apa yang ingin kamu lakukan?</p>
                                <div class="flex flex-col gap-2">
                                    <label
                                        class="flex items-center gap-3 p-3 transition-colors border cursor-pointer rounded-xl"
                                        :class="mode === 'parse' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'">
                                        <input v-model="mode" type="radio" value="parse" class="text-primary-600" />
                                        <div>
                                            <p class="text-sm font-medium text-secondary-900">Isi form otomatis</p>
                                            <p class="text-xs text-secondary-500">Ekstrak data dan isi form yang sedang
                                                dibuka</p>
                                        </div>
                                    </label>
                                    <label
                                        class="flex items-center gap-3 p-3 transition-colors border cursor-pointer rounded-xl"
                                        :class="mode === 'create' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'">
                                        <input v-model="mode" type="radio" value="create" class="text-primary-600" />
                                        <div>
                                            <p class="text-sm font-medium text-secondary-900">Buat CV baru</p>
                                            <p class="text-xs text-secondary-500">Unggah dan buat CV baru dari file ini
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Title input for create mode -->
                            <div v-if="mode === 'create'">
                                <label class="block mb-1 text-sm font-medium text-secondary-700">Judul CV</label>
                                <div class="relative">
                                    <FileText
                                        class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                                    <input v-model="title" type="text" placeholder="Contoh: CV - Gojek - Mei 2026"
                                        class="pl-10 input" />
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3 mt-2">
                                <button @click="closeModal" class="flex-1 btn-secondary">
                                    Batal
                                </button>
                                <button @click="handleUpload"
                                    class="flex items-center justify-center flex-1 gap-2 btn-primary"
                                    :disabled="!selectedFile || loading">
                                    <LoadingSpinner v-if="loading" size="sm" />
                                    <span v-else class="flex items-center gap-2">
                                        <Upload class="w-4 h-4" />
                                        Unggah
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload, X, FileUp, FileText } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'
import { useToast } from '@/composables/useToast.js'
import { useConfirm } from '@/composables/useConfirm.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const emit = defineEmits(['parsed'])

const router = useRouter()
const { success, error, info, warning } = useToast()
const { open } = useConfirm()

const modalOpen = ref(false)
const isDragging = ref(false)
const selectedFile = ref(null)
const fileInputRef = ref(null)
const mode = ref('parse')
const title = ref('')
const loading = ref(false)

const openModal = () => {
    modalOpen.value = true
}

const closeModal = () => {
    modalOpen.value = false
    clearFile()
    title.value = ''
    mode.value = 'parse'
}

const triggerFileInput = () => {
    fileInputRef.value?.click()
}

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) validateAndSetFile(file)
}

const handleDrop = (e) => {
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file) validateAndSetFile(file)
}

const validateAndSetFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
        warning('Hanya file PDF dan DOCX yang diizinkan')
        return
    }
    if (file.size > 5 * 1024 * 1024) {
        warning('Ukuran file maksimal 5MB')
        return
    }
    selectedFile.value = file
}

const clearFile = () => {
    selectedFile.value = null
    if (fileInputRef.value) fileInputRef.value.value = ''
}

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const handleUpload = async () => {
    if (!selectedFile.value) {
        warning('Pilih file terlebih dahulu')
        return
    }

    if (mode.value === 'create' && !title.value.trim()) {
        warning('Judul CV tidak boleh kosong')
        return
    }

    const confirmed = await open({
        title: 'Unggah CV',
        message: mode.value === 'parse'
            ? 'Data dari CV akan digunakan untuk mengisi form. Lanjutkan?'
            : 'CV akan diunggah dan dibuat sebagai resume baru. Lanjutkan?',
        confirmText: 'Unggah',
        cancelText: 'Batal',
        type: 'info'
    })

    if (!confirmed) return

    loading.value = true

    try {
        const formData = new FormData()
        formData.append('cv', selectedFile.value)

        if (mode.value === 'parse') {
            info('Sedang membaca file CV...')
            const response = await api.post('/upload/parse', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            emit('parsed', response.data.data)
            success('CV berhasil dibaca, form sudah terisi otomatis')
            closeModal()
        } else {
            formData.append('title', title.value)
            info('Sedang mengunggah dan membuat CV baru...')
            const response = await api.post('/upload/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            success('CV baru berhasil dibuat dari file unggahan')
            closeModal()
            router.push({ name: 'Builder', params: { id: response.data.resume.id } })
        }
    } catch {
        error('Gagal mengunggah file, coba lagi')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>