<template>
    <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
                <RouterLink to="/dashboard" class="transition-colors text-secondary-400 hover:text-secondary-600">
                    <ArrowLeft class="w-5 h-5" />
                </RouterLink>
                <div>
                    <h1 class="text-xl font-bold text-secondary-900">{{ currentResume?.title || 'Resume Builder' }}</h1>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span :class="statusBadge(currentResume?.status)">{{ statusLabel(currentResume?.status)
                        }}</span>
                        <span v-if="currentResume?.matchScore"
                            class="flex items-center gap-1 text-xs text-secondary-500">
                            <BarChart2 class="w-3 h-3" />
                            {{ currentResume.matchScore }}% kecocokan
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <UploadCV @parsed="handleParsed" />
                <button @click="handleExport" :disabled="!currentResume?.generatedCv || loading"
                    class="flex items-center gap-2 text-sm btn-outline">
                    <Download class="w-4 h-4" />
                    Ekspor PDF
                </button>
                <button @click="handleSave" :disabled="loading" class="flex items-center gap-2 text-sm btn-primary">
                    <Save class="w-4 h-4" />
                    Simpan
                </button>
            </div>
        </div>

        <LoadingSpinner v-if="loading && !currentResume" text="Memuat resume..." fullscreen />

        <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Left: Editor -->
            <div class="flex flex-col gap-6">

                <!-- Personal Info -->
                <div class="card">
                    <div class="flex items-center gap-2 mb-4">
                        <User class="w-5 h-5 text-primary-600" />
                        <h2 class="font-semibold text-secondary-900">Informasi Pribadi</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Nama Lengkap</label>
                            <input v-model="form.personalInfo.name" type="text" class="text-sm input"
                                placeholder="Masukkan nama lengkap" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Email</label>
                            <input v-model="form.personalInfo.email" type="email" class="text-sm input"
                                placeholder="Masukkan email" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Nomor Telepon</label>
                            <input v-model="form.personalInfo.phone" type="text" class="text-sm input"
                                placeholder="Masukkan nomor telepon" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Alamat</label>
                            <input v-model="form.personalInfo.address" type="text" class="text-sm input"
                                placeholder="Masukkan alamat" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">LinkedIn</label>
                            <input v-model="form.personalInfo.linkedin" type="text" class="text-sm input"
                                placeholder="Masukkan URL LinkedIn" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Website</label>
                            <input v-model="form.personalInfo.website" type="text" class="text-sm input"
                                placeholder="Masukkan URL website" />
                        </div>
                    </div>
                </div>

                <!-- Summary -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <AlignLeft class="w-5 h-5 text-primary-600" />
                            <h2 class="font-semibold text-secondary-900">Ringkasan Profesional</h2>
                        </div>
                        <button v-if="currentResume?.generatedCv" @click="handleRegenerateSection('summary')"
                            :disabled="generating"
                            class="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700">
                            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': generating }" />
                            Buat Ulang
                        </button>
                    </div>
                    <textarea v-model="form.summary" rows="4" class="text-sm resize-none input"
                        placeholder="Tulis ringkasan profesional..."></textarea>
                </div>

                <!-- Experience -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <Briefcase class="w-5 h-5 text-primary-600" />
                            <h2 class="font-semibold text-secondary-900">Pengalaman Kerja</h2>
                        </div>
                        <button @click="addExperience"
                            class="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700">
                            <PlusCircle class="w-4 h-4" />
                            Tambah
                        </button>
                    </div>

                    <div v-if="form.experience.length === 0" class="py-8 text-sm text-center text-secondary-400">
                        <Briefcase class="w-8 h-8 mx-auto mb-2 text-secondary-300" />
                        Belum ada pengalaman ditambahkan
                    </div>

                    <div v-else class="flex flex-col gap-4">
                        <div v-for="(exp, index) in form.experience" :key="index"
                            class="flex flex-col gap-3 p-4 border rounded-xl border-secondary-100">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-secondary-700">Pengalaman {{ index + 1 }}</span>
                                <div class="flex items-center gap-2">
                                    <button v-if="currentResume?.generatedCv"
                                        @click="handleRegenerateSection('experience', index)" :disabled="generating"
                                        class="flex items-center gap-1 text-xs text-primary-600">
                                        <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': generating }" />
                                        Buat Ulang
                                    </button>
                                    <button @click="handleRemoveExperience(index)"
                                        class="text-red-400 hover:text-red-600">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Perusahaan</label>
                                    <input v-model="exp.company" type="text" class="text-sm input"
                                        placeholder="Masukkan nama perusahaan" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Posisi</label>
                                    <input v-model="exp.position" type="text" class="text-sm input"
                                        placeholder="Masukkan posisi jabatan" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Tanggal
                                        Mulai</label>
                                    <input v-model="exp.startDate" type="text" class="text-sm input"
                                        placeholder="Masukkan tanggal mulai" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Tanggal
                                        Selesai</label>
                                    <input v-model="exp.endDate" type="text" class="text-sm input"
                                        placeholder="Masukkan tanggal selesai" :disabled="exp.isCurrent" />
                                </div>
                            </div>
                            <label class="flex items-center gap-2 text-sm cursor-pointer text-secondary-600">
                                <input v-model="exp.isCurrent" type="checkbox" class="rounded" />
                                Masih bekerja di sini
                            </label>
                            <div>
                                <label class="block mb-1 text-xs font-medium text-secondary-600">Deskripsi</label>
                                <textarea v-model="exp.descriptionText" rows="3" class="text-sm resize-none input"
                                    placeholder="Tulis deskripsi pekerjaan per baris..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Education -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <GraduationCap class="w-5 h-5 text-primary-600" />
                            <h2 class="font-semibold text-secondary-900">Pendidikan</h2>
                        </div>
                        <button @click="addEducation"
                            class="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700">
                            <PlusCircle class="w-4 h-4" />
                            Tambah
                        </button>
                    </div>

                    <div v-if="form.education.length === 0" class="py-8 text-sm text-center text-secondary-400">
                        <GraduationCap class="w-8 h-8 mx-auto mb-2 text-secondary-300" />
                        Belum ada pendidikan ditambahkan
                    </div>

                    <div v-else class="flex flex-col gap-4">
                        <div v-for="(edu, index) in form.education" :key="index"
                            class="flex flex-col gap-3 p-4 border rounded-xl border-secondary-100">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-secondary-700">Pendidikan {{ index + 1 }}</span>
                                <button @click="handleRemoveEducation(index)" class="text-red-400 hover:text-red-600">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Institusi</label>
                                    <input v-model="edu.institution" type="text" class="text-sm input"
                                        placeholder="Masukkan nama institusi" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Jenjang</label>
                                    <input v-model="edu.degree" type="text" class="text-sm input"
                                        placeholder="Masukkan jenjang pendidikan" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Jurusan</label>
                                    <input v-model="edu.field" type="text" class="text-sm input"
                                        placeholder="Masukkan jurusan" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">IPK</label>
                                    <input v-model="edu.gpa" type="text" class="text-sm input"
                                        placeholder="Masukkan IPK" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Tahun Mulai</label>
                                    <input v-model="edu.startDate" type="text" class="text-sm input"
                                        placeholder="Masukkan tahun mulai" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Tahun
                                        Selesai</label>
                                    <input v-model="edu.endDate" type="text" class="text-sm input"
                                        placeholder="Masukkan tahun selesai" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Skills -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <Wrench class="w-5 h-5 text-primary-600" />
                            <h2 class="font-semibold text-secondary-900">Keahlian</h2>
                        </div>
                        <button v-if="currentResume?.generatedCv" @click="handleRegenerateSection('skills')"
                            :disabled="generating" class="flex items-center gap-1.5 text-xs text-primary-600">
                            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': generating }" />
                            Buat Ulang
                        </button>
                    </div>
                    <input v-model="skillInput" type="text" class="mb-3 text-sm input"
                        placeholder="Ketik skill lalu tekan Enter..." @keydown.enter.prevent="addSkill" />
                    <div class="flex flex-wrap gap-2">
                        <span v-for="(skill, index) in form.skills" :key="index"
                            class="flex items-center gap-1.5 bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full">
                            {{ skill }}
                            <button @click="removeSkill(index)" class="text-primary-400 hover:text-primary-600">
                                <X class="w-3 h-3" />
                            </button>
                        </span>
                    </div>
                </div>

                <!-- Job Description -->
                <div class="card">
                    <div class="flex items-center gap-2 mb-4">
                        <ClipboardList class="w-5 h-5 text-primary-600" />
                        <h2 class="font-semibold text-secondary-900">Deskripsi Pekerjaan</h2>
                    </div>
                    <textarea v-model="jobDesc" rows="6" class="mb-4 text-sm resize-none input"
                        placeholder="Tempel deskripsi pekerjaan di sini..."></textarea>
                    <button @click="handleGenerate" :disabled="generating || !jobDesc.trim()"
                        class="flex items-center justify-center w-full gap-2 btn-primary">
                        <LoadingSpinner v-if="generating" size="sm" />
                        <span v-else class="flex items-center gap-2">
                            <Sparkles class="w-4 h-4" />
                            Generate dengan AI
                        </span>
                    </button>
                </div>
            </div>

            <!-- Right: Preview -->
            <div class="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">

                <!-- Match Score -->
                <div v-if="matchResult" class="card">
                    <div class="flex items-center gap-2 mb-4">
                        <BarChart2 class="w-5 h-5 text-primary-600" />
                        <h2 class="font-semibold text-secondary-900">Skor Kecocokan</h2>
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                        <div class="relative w-20 h-20">
                            <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="3" />
                                <circle cx="18" cy="18" r="15.9" fill="none" :stroke="scoreColor" stroke-width="3"
                                    stroke-dasharray="100" :stroke-dashoffset="100 - matchResult.score"
                                    stroke-linecap="round" />
                            </svg>
                            <span
                                class="absolute inset-0 flex items-center justify-center text-lg font-bold text-secondary-900">
                                {{ matchResult.score }}
                            </span>
                        </div>
                        <div class="flex flex-col gap-1 text-sm">
                            <span class="flex items-center justify-between gap-8">
                                <span class="text-secondary-500">Keahlian</span>
                                <span class="font-medium">{{ matchResult.breakdown?.skills }}%</span>
                            </span>
                            <span class="flex items-center justify-between gap-8">
                                <span class="text-secondary-500">Pengalaman</span>
                                <span class="font-medium">{{ matchResult.breakdown?.experience }}%</span>
                            </span>
                            <span class="flex items-center justify-between gap-8">
                                <span class="text-secondary-500">Pendidikan</span>
                                <span class="font-medium">{{ matchResult.breakdown?.education }}%</span>
                            </span>
                        </div>
                    </div>
                    <div v-if="matchResult.missingKeywords?.length" class="mb-3">
                        <p class="mb-2 text-xs font-medium text-secondary-600">Kata Kunci yang Kurang</p>
                        <div class="flex flex-wrap gap-1.5">
                            <span v-for="kw in matchResult.missingKeywords" :key="kw" class="badge badge-danger">{{ kw
                            }}</span>
                        </div>
                    </div>
                    <div v-if="matchResult.suggestions?.length">
                        <p class="mb-2 text-xs font-medium text-secondary-600">Saran Perbaikan</p>
                        <ul class="flex flex-col gap-1">
                            <li v-for="s in matchResult.suggestions" :key="s"
                                class="flex items-start gap-2 text-xs text-secondary-600">
                                <Lightbulb class="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                                {{ s }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- CV Preview -->
                <div class="card">
                    <div class="flex items-center gap-2 mb-4">
                        <Eye class="w-5 h-5 text-primary-600" />
                        <h2 class="font-semibold text-secondary-900">Pratinjau</h2>
                    </div>

                    <div class="p-6 font-mono text-sm leading-relaxed bg-secondary-50 rounded-xl">
                        <div class="mb-4 text-center">
                            <p class="text-lg font-bold text-secondary-900">
                                {{ previewData.personalInfo?.name || 'Nama Kamu' }}
                            </p>
                            <p class="mt-1 text-xs text-secondary-500">
                                {{ [previewData.personalInfo?.email, previewData.personalInfo?.phone,
                                previewData.personalInfo?.address].filter(Boolean).join(' | ') }}
                            </p>
                        </div>

                        <div v-if="previewData.summary" class="mb-4">
                            <p
                                class="pb-1 mb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary-700 border-secondary-200">
                                Ringkasan
                            </p>
                            <p class="text-xs text-secondary-600">{{ previewData.summary }}</p>
                        </div>

                        <div v-if="previewData.experience?.length" class="mb-4">
                            <p
                                class="pb-1 mb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary-700 border-secondary-200">
                                Pengalaman
                            </p>
                            <div v-for="exp in previewData.experience" :key="exp.company" class="mb-2">
                                <p class="text-xs font-semibold text-secondary-800">{{ exp.position }} — {{ exp.company
                                }}</p>
                                <p class="text-xs text-secondary-500">{{ exp.startDate }} - {{ exp.isCurrent ?
                                    'Sekarang' : exp.endDate }}</p>
                                <ul v-if="exp.description?.length" class="mt-1">
                                    <li v-for="d in exp.description" :key="d" class="text-xs text-secondary-600">- {{ d
                                    }}</li>
                                </ul>
                            </div>
                        </div>

                        <div v-if="previewData.education?.length" class="mb-4">
                            <p
                                class="pb-1 mb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary-700 border-secondary-200">
                                Pendidikan
                            </p>
                            <div v-for="edu in previewData.education" :key="edu.institution" class="mb-2">
                                <p class="text-xs font-semibold text-secondary-800">{{ edu.institution }}</p>
                                <p class="text-xs text-secondary-500">{{ edu.degree }}{{ edu.field ? ' - ' + edu.field :
                                    '' }}</p>
                            </div>
                        </div>

                        <div v-if="previewData.skills?.length">
                            <p
                                class="pb-1 mb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary-700 border-secondary-200">
                                Keahlian
                            </p>
                            <p class="text-xs text-secondary-600">{{ previewData.skills.join(', ') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
    ArrowLeft, BarChart2, Download, Save, User, AlignLeft,
    Briefcase, GraduationCap, Wrench, ClipboardList, Sparkles,
    PlusCircle, Trash2, RefreshCw, X, Eye, Lightbulb
} from 'lucide-vue-next'
import { useResume } from '@/composables/useResume.js'
import { useToast } from '@/composables/useToast.js'
import { useConfirm } from '@/composables/useConfirm.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import UploadCV from '@/components/UploadCV.vue'

const route = useRoute()
const { currentResume, matchResult, loading, generating, fetchById, update, generate, regenerateSection, exportResume } = useResume()
const { success, error, info, warning } = useToast()
const { open } = useConfirm()

const jobDesc = ref('')
const skillInput = ref('')

const form = ref({
    personalInfo: { name: '', email: '', phone: '', address: '', linkedin: '', website: '' },
    summary: '',
    experience: [],
    education: [],
    skills: []
})

const previewData = computed(() => currentResume.value?.generatedCv || form.value)

const scoreColor = computed(() => {
    const score = matchResult.value?.score || 0
    if (score >= 75) return '#22c55e'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
})

const statusBadge = (status) => ({
    DRAFT: 'badge badge-warning',
    GENERATED: 'badge badge-success',
    EXPORTED: 'badge badge-info'
}[status] || 'badge')

const addExperience = () => {
    form.value.experience.push({
        company: '', position: '', startDate: '', endDate: '',
        isCurrent: false, descriptionText: '', description: []
    })
}

const removeExperience = async (index) => {
    const confirmed = await open({
        title: 'Hapus Pengalaman',
        message: 'Apakah kamu yakin ingin menghapus pengalaman kerja ini?',
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'danger'
    })
    if (!confirmed) return
    form.value.experience.splice(index, 1)
    success('Pengalaman kerja berhasil dihapus')
}

const addEducation = () => {
    form.value.education.push({
        institution: '', degree: '', field: '', gpa: '', startDate: '', endDate: ''
    })
}

const removeEducation = async (index) => {
    const confirmed = await open({
        title: 'Hapus Pendidikan',
        message: 'Apakah kamu yakin ingin menghapus data pendidikan ini?',
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'danger'
    })
    if (!confirmed) return
    form.value.education.splice(index, 1)
    success('Data pendidikan berhasil dihapus')
}

const addSkill = () => {
    const skill = skillInput.value.trim()
    if (!skill) return
    if (form.value.skills.includes(skill)) {
        warning('Skill sudah ditambahkan')
        return
    }
    form.value.skills.push(skill)
    skillInput.value = ''
}

const removeSkill = (index) => {
    form.value.skills.splice(index, 1)
}

const buildCvBase = () => {
    return {
        ...form.value,
        experience: form.value.experience.map((exp) => ({
            ...exp,
            description: exp.descriptionText
                ? exp.descriptionText.split('\n').filter(Boolean)
                : exp.description
        }))
    }
}

const handleSave = async () => {
    try {
        await update(route.params.id, { cvBase: buildCvBase() })
        success('CV berhasil disimpan')
    } catch {
        error('Gagal menyimpan CV, coba lagi')
    }
}

const handleGenerate = async () => {
    if (!jobDesc.value || jobDesc.value.trim().length < 10) {
        warning('Deskripsi pekerjaan minimal 10 karakter')
        return
    }

    const confirmed = await open({
        title: 'Generate dengan AI',
        message: 'AI akan menulis ulang CV kamu berdasarkan deskripsi pekerjaan. Lanjutkan?',
        confirmText: 'Generate',
        cancelText: 'Batal',
        type: 'info'
    })

    if (!confirmed) return

    try {
        await update(route.params.id, { cvBase: buildCvBase() })
        info('Sedang memproses dengan AI...')
        await generate(route.params.id, jobDesc.value)
        success('CV berhasil digenerate dengan AI')
    } catch {
        error('Gagal generate CV, coba lagi')
    }
}

const handleRegenerateSection = async (section, index) => {
    const sectionLabel = {
        summary: 'ringkasan profesional',
        experience: 'pengalaman kerja',
        skills: 'keahlian'
    }[section]

    const confirmed = await open({
        title: 'Buat Ulang Bagian',
        message: `AI akan membuat ulang ${sectionLabel} kamu. Lanjutkan?`,
        confirmText: 'Buat Ulang',
        cancelText: 'Batal',
        type: 'info'
    })

    if (!confirmed) return

    try {
        info('Sedang memproses...')
        await regenerateSection(route.params.id, section, index)
        success(`Bagian ${sectionLabel} berhasil dibuat ulang`)
    } catch {
        error('Gagal membuat ulang bagian, coba lagi')
    }
}

const handleExport = async () => {
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
        await exportResume(route.params.id)
        success('CV berhasil diekspor')
    } catch {
        error('Gagal mengekspor CV, coba lagi')
    }
}

const populateForm = (resume) => {
    if (!resume) return
    const cv = resume.generatedCv || resume.cvBase
    form.value = {
        personalInfo: cv.personalInfo || { name: '', email: '', phone: '', address: '', linkedin: '', website: '' },
        summary: cv.summary || '',
        experience: (cv.experience || []).map((exp) => ({
            ...exp,
            descriptionText: (exp.description || []).join('\n')
        })),
        education: cv.education || [],
        skills: cv.skills || []
    }
    if (resume.jobDesc) jobDesc.value = resume.jobDesc
}

const handleParsed = (data) => {
    form.value = {
        personalInfo: data.personalInfo || { name: '', email: '', phone: '', address: '', linkedin: '', website: '' },
        summary: data.summary || '',
        experience: (data.experience || []).map((exp) => ({
            ...exp,
            descriptionText: (exp.description || []).join('\n')
        })),
        education: data.education || [],
        skills: data.skills || []
    }
    success('CV berhasil diparse, form sudah terisi')
}

watch(currentResume, (val) => populateForm(val))

onMounted(async () => {
    try {
        await fetchById(route.params.id)
    } catch {
        error('Gagal memuat CV, coba lagi')
    }
})
</script>