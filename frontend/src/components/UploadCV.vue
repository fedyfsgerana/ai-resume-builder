<template>
    <div>
        <button @click="openModal" class="flex items-center gap-2 text-sm btn-outline">
            <Upload class="w-4 h-4" />
            Upload CV
        </button>

        <!-- Modal -->
        <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
            @click.self="closeModal">
            <div class="w-full max-w-md p-6 bg-white rounded-2xl shadow-modal">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-semibold text-secondary-900">Upload CV</h2>
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
                                Drop your CV here or click to browse
                            </p>
                            <p class="mt-1 text-xs text-secondary-400">Supports PDF and DOCX, max 5MB</p>
                        </div>

                        <div v-else class="flex items-center justify-center gap-3">
                            <FileText class="w-8 h-8 text-primary-500" />
                            <div class="text-left">
                                <p class="text-sm font-medium text-secondary-900">{{ selectedFile.name }}</p>
                                <p class="text-xs text-secondary-400">{{ formatFileSize(selectedFile.size) }}</p>
                            </div>
                            <button @click.stop="clearFile" class="ml-2 text-secondary-400 hover:text-red-500">
                                <X class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <!-- Mode Selection -->
                    <div class="flex flex-col gap-2">
                        <p class="text-sm font-medium text-secondary-700">What do you want to do?</p>
                        <div class="flex flex-col gap-2">
                            <label
                                class="flex items-center gap-3 p-3 transition-colors border cursor-pointer rounded-xl"
                                :class="mode === 'parse' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'">
                                <input v-model="mode" type="radio" value="parse" class="text-primary-600" />
                                <div>
                                    <p class="text-sm font-medium text-secondary-900">Parse only</p>
                                    <p class="text-xs text-secondary-500">Extract data and fill the current form</p>
                                </div>
                            </label>
                            <label
                                class="flex items-center gap-3 p-3 transition-colors border cursor-pointer rounded-xl"
                                :class="mode === 'create' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'">
                                <input v-model="mode" type="radio" value="create" class="text-primary-600" />
                                <div>
                                    <p class="text-sm font-medium text-secondary-900">Create new resume</p>
                                    <p class="text-xs text-secondary-500">Upload and create a new resume from this CV
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Title input for create mode -->
                    <div v-if="mode === 'create'">
                        <label class="block mb-1 text-sm font-medium text-secondary-700">Resume Title</label>
                        <div class="relative">
                            <FileText class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                            <input v-model="title" type="text" placeholder="e.g. CV - Gojek - May 2026"
                                class="pl-10 input" />
                        </div>
                    </div>

                    <!-- Error -->
                    <div v-if="error"
                        class="flex items-center gap-2 px-4 py-3 text-sm text-red-600 bg-red-50 rounded-xl">
                        <AlertCircle class="w-4 h-4 shrink-0" />
                        {{ error }}
                    </div>

                    <!-- Success -->
                    <div v-if="success"
                        class="flex items-center gap-2 px-4 py-3 text-sm text-green-600 bg-green-50 rounded-xl">
                        <CheckCircle class="w-4 h-4 shrink-0" />
                        {{ success }}
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-3 mt-2">
                        <button @click="closeModal" class="flex-1 btn-secondary">
                            Cancel
                        </button>
                        <button @click="handleUpload" class="flex items-center justify-center flex-1 gap-2 btn-primary"
                            :disabled="!selectedFile || loading">
                            <LoadingSpinner v-if="loading" size="sm" />
                            <span v-else class="flex items-center gap-2">
                                <Upload class="w-4 h-4" />
                                Upload
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload, X, FileUp, FileText, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import api from '@/services/api.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const emit = defineEmits(['parsed'])

const router = useRouter()

const modalOpen = ref(false)
const isDragging = ref(false)
const selectedFile = ref(null)
const fileInputRef = ref(null)
const mode = ref('parse')
const title = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const openModal = () => {
    modalOpen.value = true
    error.value = ''
    success.value = ''
}

const closeModal = () => {
    modalOpen.value = false
    clearFile()
    error.value = ''
    success.value = ''
}

const triggerFileInput = () => {
    fileInputRef.value?.click()
}

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) selectedFile.value = file
}

const handleDrop = (e) => {
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file) selectedFile.value = file
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
    if (!selectedFile.value) return

    error.value = ''
    success.value = ''
    loading.value = true

    try {
        const formData = new FormData()
        formData.append('cv', selectedFile.value)

        if (mode.value === 'parse') {
            const response = await api.post('/upload/parse', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            emit('parsed', response.data.data)
            success.value = 'CV parsed successfully! Form has been filled.'
            setTimeout(() => closeModal(), 1500)
        } else {
            if (!title.value.trim()) {
                error.value = 'Please enter a resume title'
                loading.value = false
                return
            }
            formData.append('title', title.value)
            const response = await api.post('/upload/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            success.value = 'Resume created successfully! Redirecting...'
            setTimeout(() => {
                closeModal()
                router.push({ name: 'Builder', params: { id: response.data.resume.id } })
            }, 1500)
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'Upload failed'
    } finally {
        loading.value = false
    }
}
</script>