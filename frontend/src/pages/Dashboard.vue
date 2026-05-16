<template>
    <div class="space-y-6">

        <!-- Header -->
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h1 class="text-2xl font-black tracking-tight sm:text-3xl text-slate-900 dark:text-white">Dasbor</h1>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Selamat datang kembali, <span class="font-bold text-primary-600 dark:text-primary-400">{{ userName
                        }}</span> 👋
                </p>
            </div>
            <button @click="openCreateModal" class="btn-primary px-5 py-2.5 w-full sm:w-auto justify-center">
                <Plus class="w-4 h-4" />
                Buat CV Baru
            </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div v-for="stat in statsData" :key="stat.label"
                class="card flex items-center gap-4 group hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <div class="w-12 h-12 transition-transform icon-box rounded-2xl shrink-0 group-hover:scale-110"
                    :class="stat.bg">
                    <component :is="stat.icon" class="w-6 h-6" :class="stat.color" />
                </div>
                <div>
                    <p class="text-2xl font-black tracking-tight sm:text-3xl text-slate-900 dark:text-white">{{
                        stat.value }}</p>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
                </div>
            </div>
        </div>

        <!-- CV List -->
        <div class="card">
            <div class="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center">
                <h2 class="text-lg font-black text-slate-900 dark:text-white">CV Kamu</h2>
                <div class="relative w-full sm:w-64">
                    <Search class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                    <input v-model="search" type="text" placeholder="Cari CV..." class="py-2 pl-10 text-sm input" />
                </div>
            </div>

            <LoadingSpinner v-if="loading" text="Memuat CV..." />

            <div v-else-if="filteredResumes.length === 0" class="py-20 text-center">
                <div
                    class="flex items-center justify-center w-20 h-20 mx-auto mb-5 rounded-3xl bg-slate-100 dark:bg-slate-800">
                    <FileX class="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 class="mb-2 text-xl font-black text-slate-700 dark:text-slate-300">Belum ada CV</h3>
                <p class="max-w-xs mx-auto mb-6 text-sm text-slate-400 dark:text-slate-500">
                    Buat CV pertama kamu dan mulai melamar kerja dengan lebih cerdas
                </p>
                <button @click="openCreateModal" class="mx-auto btn-primary">
                    <Plus class="w-4 h-4" />
                    Buat CV Baru
                </button>
            </div>

            <div v-else class="space-y-3">
                <div v-for="resume in filteredResumes" :key="resume.id"
                    class="flex flex-col justify-between gap-4 p-4 transition-all duration-200 border group sm:flex-row sm:items-center rounded-2xl border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50/30 dark:hover:bg-primary-900/10">

                    <div class="flex items-center min-w-0 gap-4">
                        <div
                            class="flex items-center justify-center w-12 h-12 transition-transform rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 shrink-0 group-hover:scale-105">
                            <FileText class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div class="min-w-0">
                            <p class="font-bold truncate text-slate-900 dark:text-white">{{ resume.title }}</p>
                            <div class="flex flex-wrap items-center gap-2 mt-1.5">
                                <span :class="statusBadge(resume.status)">
                                    <component :is="statusIcon(resume.status)" class="w-3 h-3" />
                                    {{ statusLabel(resume.status) }}
                                </span>
                                <span v-if="resume.matchScore"
                                    class="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <TrendingUp class="w-3 h-3 text-emerald-500" />
                                    {{ resume.matchScore }}% cocok
                                </span>
                                <span class="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                    <Clock class="w-3 h-3" />
                                    {{ formatDate(resume.createdAt) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex items-center gap-2 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 shrink-0">
                        <RouterLink :to="{ name: 'Builder', params: { id: resume.id } }"
                            class="px-3 py-2 text-xs btn-secondary">
                            <Pencil class="w-3.5 h-3.5" />
                            Edit
                        </RouterLink>
                        <button @click="handleDuplicate(resume.id)" class="px-3 py-2 text-xs btn-secondary">
                            <Copy class="w-3.5 h-3.5" />
                            Duplikat
                        </button>
                        <button @click="handleExport(resume.id)" :disabled="loading"
                            class="px-3 py-2 text-xs btn-outline">
                            <FileDown class="w-3.5 h-3.5" />
                            Ekspor
                        </button>
                        <button @click="handleDelete(resume.id)"
                            class="flex items-center justify-center w-8 h-8 text-red-500 transition-colors rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40">
                            <Trash2 class="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Modal -->
        <Transition name="fade">
            <div v-if="createModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                @click.self="createModalOpen = false">
                <Transition name="scale">
                    <div v-if="createModalOpen"
                        class="w-full max-w-md p-8 bg-white border shadow-2xl dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                <h2 class="text-xl font-black text-slate-900 dark:text-white">Buat CV Baru</h2>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Beri nama yang mudah diingat
                                </p>
                            </div>
                            <button @click="createModalOpen = false"
                                class="flex items-center justify-center w-8 h-8 transition-colors rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                <X class="w-4 h-4" />
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label
                                    class="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">Judul
                                    CV</label>
                                <div class="relative">
                                    <FileText class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                                    <input v-model="newResumeTitle" type="text"
                                        placeholder="Contoh: CV - Software Engineer - Tokopedia" class="pl-10 input"
                                        @keydown.enter="handleCreate" autofocus />
                                </div>
                            </div>
                            <div class="flex gap-3 pt-2">
                                <button @click="createModalOpen = false" class="flex-1 btn-secondary">Batal</button>
                                <button @click="handleCreate" :disabled="loading || !newResumeTitle.trim()"
                                    class="flex-1 btn-primary">
                                    <LoadingSpinner v-if="loading" size="sm" />
                                    <span v-else class="flex items-center justify-center gap-2">
                                        <Plus class="w-4 h-4" />Buat CV
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
    Plus, FileText, Search, FileX, Pencil, Trash2, X, Copy,
    FileDown, Sparkles, TrendingUp, Clock, CheckCircle, Edit3, Users
} from 'lucide-vue-next'
import { useResume } from '@/composables/useResume.js'
import { useToast } from '@/composables/useToast.js'
import { useConfirm } from '@/composables/useConfirm.js'
import { useAuthStore } from '@/stores/authStore.js'
import { storeToRefs } from 'pinia'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { resumes, loading, totalResumes, fetchAll, create, remove, exportResume, duplicate } = useResume()
const { success, error, info } = useToast()
const { open } = useConfirm()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const userName = computed(() => user.value?.name?.split(' ')[0] || 'Pengguna')
const search = ref('')
const createModalOpen = ref(false)
const newResumeTitle = ref('')

const filteredResumes = computed(() =>
    resumes.value.filter(r => r.title.toLowerCase().includes(search.value.toLowerCase()))
)

const generatedCount = computed(() => resumes.value.filter(r => r.status === 'GENERATED').length)
const exportedCount = computed(() => resumes.value.filter(r => r.status === 'EXPORTED').length)

const statsData = computed(() => [
    { label: 'Total CV', value: totalResumes.value, icon: FileText, bg: 'bg-primary-100 dark:bg-primary-900/40', color: 'text-primary-600 dark:text-primary-400' },
    { label: 'Sudah Digenerate', value: generatedCount.value, icon: Sparkles, bg: 'bg-emerald-100 dark:bg-emerald-900/40', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Sudah Diekspor', value: exportedCount.value, icon: FileDown, bg: 'bg-blue-100 dark:bg-blue-900/40', color: 'text-blue-600 dark:text-blue-400' }
])

const statusBadge = (s) => ({ DRAFT: 'badge badge-warning', GENERATED: 'badge badge-success', EXPORTED: 'badge badge-info' }[s] || 'badge')
const statusLabel = (s) => ({ DRAFT: 'Draft', GENERATED: 'Digenerate', EXPORTED: 'Diekspor' }[s] || s)
const statusIcon = (s) => ({ DRAFT: Edit3, GENERATED: Sparkles, EXPORTED: FileDown }[s] || FileText)

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

const openCreateModal = () => { newResumeTitle.value = ''; createModalOpen.value = true }

const handleCreate = async () => {
    if (!newResumeTitle.value.trim()) { error('Judul CV tidak boleh kosong'); return }
    try {
        await create({ title: newResumeTitle.value, cvBase: { personalInfo: { name: '', email: '' }, experience: [], education: [], skills: [] } })
        createModalOpen.value = false
        success('CV berhasil dibuat')
    } catch { error('Gagal membuat CV') }
}

const handleDuplicate = async (id) => {
    const ok = await open({ title: 'Duplikat CV', message: 'CV akan diduplikat sebagai salinan baru.', confirmText: 'Duplikat', cancelText: 'Batal', type: 'info' })
    if (!ok) return
    try { await duplicate(id); success('CV berhasil diduplikat') } catch { error('Gagal menduplikat CV') }
}

const handleDelete = async (id) => {
    const ok = await open({ title: 'Hapus CV', message: 'CV ini akan dihapus permanen dan tidak bisa dikembalikan.', confirmText: 'Hapus', cancelText: 'Batal', type: 'danger' })
    if (!ok) return
    try { await remove(id); success('CV berhasil dihapus') } catch { error('Gagal menghapus CV') }
}

const handleExport = async (id) => {
    const ok = await open({ title: 'Ekspor PDF', message: 'CV akan diekspor ke format PDF.', confirmText: 'Ekspor', cancelText: 'Batal', type: 'info' })
    if (!ok) return
    try { info('Sedang mengekspor...'); await exportResume(id); success('CV berhasil diekspor') } catch { error('Gagal mengekspor CV') }
}

onMounted(fetchAll)
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

.scale-enter-active {
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-leave-active {
    transition: all 0.15s ease;
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.92);
}
</style>