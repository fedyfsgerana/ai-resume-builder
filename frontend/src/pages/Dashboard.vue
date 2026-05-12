<template>
    <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-secondary-900">Dasbor</h1>
                <p class="mt-1 text-sm text-secondary-500">Kelola semua CV kamu dalam satu tempat</p>
            </div>
            <button @click="openCreateModal" class="flex items-center gap-2 btn-primary">
                <Plus class="w-4 h-4" />
                Buat CV Baru
            </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
            <div class="flex items-center gap-4 card">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100">
                    <FileText class="w-5 h-5 text-primary-600" />
                </div>
                <div>
                    <p class="text-2xl font-bold text-secondary-900">{{ totalResumes }}</p>
                    <p class="text-sm text-secondary-500">Total CV</p>
                </div>
            </div>

            <div class="flex items-center gap-4 card">
                <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
                    <CheckCircle class="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <p class="text-2xl font-bold text-secondary-900">{{ generatedCount }}</p>
                    <p class="text-sm text-secondary-500">Sudah Digenerate</p>
                </div>
            </div>

            <div class="flex items-center gap-4 card">
                <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                    <Download class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p class="text-2xl font-bold text-secondary-900">{{ exportedCount }}</p>
                    <p class="text-sm text-secondary-500">Sudah Diekspor</p>
                </div>
            </div>
        </div>

        <!-- Resume List -->
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-secondary-900">CV Kamu</h2>
                <div class="relative">
                    <Search class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                    <input v-model="search" type="text" placeholder="Cari CV..." class="w-56 py-2 text-sm input pl-9" />
                </div>
            </div>

            <LoadingSpinner v-if="loading" text="Memuat CV..." />

            <div v-else-if="filteredResumes.length === 0" class="py-16 text-center">
                <FileX class="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                <p class="font-medium text-secondary-500">Belum ada CV</p>
                <p class="mt-1 text-sm text-secondary-400">Buat CV pertama kamu untuk memulai</p>
                <button @click="openCreateModal" class="flex items-center gap-2 mx-auto mt-4 btn-primary">
                    <Plus class="w-4 h-4" />
                    Buat CV Baru
                </button>
            </div>

            <div v-else class="flex flex-col gap-3">
                <div v-for="resume in filteredResumes" :key="resume.id"
                    class="flex items-center justify-between p-4 transition-all border rounded-xl border-secondary-100 hover:border-primary-200 hover:bg-primary-50">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-100">
                            <FileText class="w-5 h-5 text-secondary-500" />
                        </div>
                        <div>
                            <p class="font-medium text-secondary-900">{{ resume.title }}</p>
                            <div class="flex items-center gap-3 mt-1">
                                <span :class="statusBadge(resume.status)">{{ statusLabel(resume.status) }}</span>
                                <span v-if="resume.matchScore"
                                    class="flex items-center gap-1 text-xs text-secondary-500">
                                    <BarChart2 class="w-3 h-3" />
                                    {{ resume.matchScore }}% kecocokan
                                </span>
                                <span class="flex items-center gap-1 text-xs text-secondary-400">
                                    <Clock class="w-3 h-3" />
                                    {{ formatDate(resume.createdAt) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <RouterLink :to="{ name: 'Builder', params: { id: resume.id } }"
                            class="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5">
                            <Pencil class="w-3.5 h-3.5" />
                            Edit
                        </RouterLink>
                        <button @click="handleDuplicate(resume.id)"
                            class="btn-secondary text-sm flex items-center gap-1.5 px-3 py-1.5">
                            <Copy class="w-3.5 h-3.5" />
                            Duplikat
                        </button>
                        <button @click="handleExport(resume.id)"
                            class="btn-outline text-sm flex items-center gap-1.5 px-3 py-1.5" :disabled="loading">
                            <Download class="w-3.5 h-3.5" />
                            Ekspor
                        </button>
                        <button @click="handleDelete(resume.id)"
                            class="btn-danger text-sm flex items-center gap-1.5 px-3 py-1.5">
                            <Trash2 class="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Modal -->
        <Transition name="fade">
            <div v-if="createModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
                @click.self="createModalOpen = false">
                <Transition name="scale">
                    <div v-if="createModalOpen" class="w-full max-w-md p-6 bg-white rounded-2xl shadow-modal">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-lg font-semibold text-secondary-900">Buat CV Baru</h2>
                            <button @click="createModalOpen = false"
                                class="text-secondary-400 hover:text-secondary-600">
                                <X class="w-5 h-5" />
                            </button>
                        </div>

                        <div class="flex flex-col gap-4">
                            <div>
                                <label class="block mb-1 text-sm font-medium text-secondary-700">Judul CV</label>
                                <div class="relative">
                                    <FileText
                                        class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                                    <input v-model="newResumeTitle" type="text"
                                        placeholder="Contoh: CV - Gojek - Mei 2026" class="pl-10 input"
                                        @keydown.enter="handleCreate" />
                                </div>
                            </div>

                            <div class="flex gap-3 mt-2">
                                <button @click="createModalOpen = false" class="flex-1 btn-secondary">
                                    Batal
                                </button>
                                <button @click="handleCreate"
                                    class="flex items-center justify-center flex-1 gap-2 btn-primary"
                                    :disabled="loading || !newResumeTitle.trim()">
                                    <LoadingSpinner v-if="loading" size="sm" />
                                    <span v-else class="flex items-center gap-2">
                                        <Plus class="w-4 h-4" />
                                        Buat
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
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
    Plus, FileText, CheckCircle, Download, Search, FileX,
    BarChart2, Clock, Pencil, Trash2, X, Copy
} from 'lucide-vue-next'
import { useResume } from '@/composables/useResume.js'
import { useToast } from '@/composables/useToast.js'
import { useConfirm } from '@/composables/useConfirm.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { resumes, loading, totalResumes, fetchAll, create, remove, exportResume, duplicate } = useResume()
const { success, error, info } = useToast()
const { open } = useConfirm()

const search = ref('')
const createModalOpen = ref(false)
const newResumeTitle = ref('')

const filteredResumes = computed(() =>
    resumes.value.filter((r) =>
        r.title.toLowerCase().includes(search.value.toLowerCase())
    )
)

const generatedCount = computed(() =>
    resumes.value.filter((r) => r.status === 'GENERATED').length
)

const exportedCount = computed(() =>
    resumes.value.filter((r) => r.status === 'EXPORTED').length
)

const statusBadge = (status) => ({
    DRAFT: 'badge badge-warning',
    GENERATED: 'badge badge-success',
    EXPORTED: 'badge badge-info'
}[status] || 'badge')

const statusLabel = (status) => ({
    DRAFT: 'Draft',
    GENERATED: 'Digenerate',
    EXPORTED: 'Diekspor'
}[status] || status)

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const openCreateModal = () => {
    newResumeTitle.value = ''
    createModalOpen.value = true
}

const handleCreate = async () => {
    if (!newResumeTitle.value.trim()) {
        error('Judul CV tidak boleh kosong')
        return
    }

    try {
        await create({
            title: newResumeTitle.value,
            cvBase: {
                personalInfo: { name: '', email: '' },
                experience: [],
                education: [],
                skills: []
            }
        })
        createModalOpen.value = false
        success('CV berhasil dibuat')
    } catch {
        error('Gagal membuat CV, coba lagi')
    }
}

const handleDuplicate = async (id) => {
    const confirmed = await open({
        title: 'Duplikat CV',
        message: 'CV akan diduplikat sebagai salinan baru. Lanjutkan?',
        confirmText: 'Duplikat',
        cancelText: 'Batal',
        type: 'info'
    })

    if (!confirmed) return

    try {
        await duplicate(id)
        success('CV berhasil diduplikat')
    } catch {
        error('Gagal menduplikat CV, coba lagi')
    }
}

const handleDelete = async (id) => {
    const confirmed = await open({
        title: 'Hapus CV',
        message: 'Apakah kamu yakin ingin menghapus CV ini? Tindakan ini tidak dapat dibatalkan.',
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'danger'
    })

    if (!confirmed) return

    try {
        await remove(id)
        success('CV berhasil dihapus')
    } catch {
        error('Gagal menghapus CV, coba lagi')
    }
}

const handleExport = async (id) => {
    const confirmed = await open({
        title: 'Ekspor PDF',
        message: 'CV akan diekspor ke format PDF. Lanjutkan?',
        confirmText: 'Ekspor',
        cancelText: 'Batal',
        type: 'info'
    })

    if (!confirmed) return

    try {
        info('Sedang mengekspor CV...')
        await exportResume(id)
        success('CV berhasil diekspor')
    } catch {
        error('Gagal mengekspor CV, coba lagi')
    }
}

onMounted(async () => {
    await fetchAll()
})
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