<template>
    <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-secondary-900">Dashboard</h1>
                <p class="text-secondary-500 text-sm mt-1">Manage all your resumes in one place</p>
            </div>
            <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
                <Plus class="w-4 h-4" />
                New Resume
            </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="card flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <FileText class="w-5 h-5 text-primary-600" />
                </div>
                <div>
                    <p class="text-2xl font-bold text-secondary-900">{{ totalResumes }}</p>
                    <p class="text-secondary-500 text-sm">Total Resumes</p>
                </div>
            </div>

            <div class="card flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle class="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <p class="text-2xl font-bold text-secondary-900">{{ generatedCount }}</p>
                    <p class="text-secondary-500 text-sm">Generated</p>
                </div>
            </div>

            <div class="card flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Download class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p class="text-2xl font-bold text-secondary-900">{{ exportedCount }}</p>
                    <p class="text-secondary-500 text-sm">Exported</p>
                </div>
            </div>
        </div>

        <!-- Resume List -->
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-secondary-900">Your Resumes</h2>
                <div class="relative">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
                    <input v-model="search" type="text" placeholder="Search resumes..."
                        class="input pl-9 py-2 text-sm w-56" />
                </div>
            </div>

            <LoadingSpinner v-if="loading" text="Loading resumes..." />

            <div v-else-if="filteredResumes.length === 0" class="text-center py-16">
                <FileX class="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <p class="text-secondary-500 font-medium">No resumes found</p>
                <p class="text-secondary-400 text-sm mt-1">Create your first resume to get started</p>
                <button @click="openCreateModal" class="btn-primary mt-4 flex items-center gap-2 mx-auto">
                    <Plus class="w-4 h-4" />
                    New Resume
                </button>
            </div>

            <div v-else class="flex flex-col gap-3">
                <div v-for="resume in filteredResumes" :key="resume.id"
                    class="flex items-center justify-between p-4 rounded-xl border border-secondary-100 hover:border-primary-200 hover:bg-primary-50 transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
                            <FileText class="w-5 h-5 text-secondary-500" />
                        </div>
                        <div>
                            <p class="font-medium text-secondary-900">{{ resume.title }}</p>
                            <div class="flex items-center gap-3 mt-1">
                                <span :class="statusBadge(resume.status)">{{ resume.status }}</span>
                                <span v-if="resume.matchScore"
                                    class="flex items-center gap-1 text-xs text-secondary-500">
                                    <BarChart2 class="w-3 h-3" />
                                    {{ resume.matchScore }}% match
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
                        <button @click="handleExport(resume.id)"
                            class="btn-outline text-sm flex items-center gap-1.5 px-3 py-1.5">
                            <Download class="w-3.5 h-3.5" />
                            Export
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
        <div v-if="createModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            @click.self="createModalOpen = false">
            <div class="bg-white rounded-2xl shadow-modal w-full max-w-md p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-semibold text-secondary-900">Create New Resume</h2>
                    <button @click="createModalOpen = false" class="text-secondary-400 hover:text-secondary-600">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div class="flex flex-col gap-4">
                    <div>
                        <label class="block text-sm font-medium text-secondary-700 mb-1">Resume Title</label>
                        <div class="relative">
                            <FileText class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
                            <input v-model="newResumeTitle" type="text" placeholder="e.g. CV - Gojek - Jun 2026"
                                class="input pl-10" />
                        </div>
                    </div>

                    <div v-if="error"
                        class="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                        <AlertCircle class="w-4 h-4 shrink-0" />
                        {{ error }}
                    </div>

                    <div class="flex gap-3 mt-2">
                        <button @click="createModalOpen = false" class="btn-secondary flex-1">
                            Cancel
                        </button>
                        <button @click="handleCreate" class="btn-primary flex-1 flex items-center justify-center gap-2"
                            :disabled="loading">
                            <LoadingSpinner v-if="loading" size="sm" />
                            <span v-else class="flex items-center gap-2">
                                <Plus class="w-4 h-4" />
                                Create
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
    Plus, FileText, CheckCircle, Download, Search, FileX,
    BarChart2, Clock, Pencil, Trash2, X, AlertCircle
} from 'lucide-vue-next'
import { useResume } from '@/composables/useResume.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { resumes, loading, error, totalResumes, fetchAll, create, remove, exportResume } = useResume()

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

const statusBadge = (status) => {
    return {
        DRAFT: 'badge badge-warning',
        GENERATED: 'badge badge-success',
        EXPORTED: 'badge badge-info'
    }[status] || 'badge'
}

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
    if (!newResumeTitle.value.trim()) return
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
}

const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this resume?')) {
        await remove(id)
    }
}

const handleExport = async (id) => {
    await exportResume(id)
}

onMounted(async () => {
    await fetchAll()
})
</script>