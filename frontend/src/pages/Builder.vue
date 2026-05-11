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
                        <span :class="statusBadge(currentResume?.status)">{{ currentResume?.status || 'DRAFT' }}</span>
                        <span v-if="currentResume?.matchScore"
                            class="flex items-center gap-1 text-xs text-secondary-500">
                            <BarChart2 class="w-3 h-3" />
                            {{ currentResume.matchScore }}% match
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <UploadCV @parsed="handleParsed" />
                <button @click="handleExport" :disabled="!currentResume?.generatedCv || loading"
                    class="flex items-center gap-2 text-sm btn-outline">
                    <Download class="w-4 h-4" />
                    Export PDF
                </button>
                <button @click="handleSave" :disabled="loading" class="flex items-center gap-2 text-sm btn-primary">
                    <Save class="w-4 h-4" />
                    Save
                </button>
            </div>
        </div>

        <LoadingSpinner v-if="loading && !currentResume" text="Loading resume..." fullscreen />

        <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Left: Editor -->
            <div class="flex flex-col gap-6">

                <!-- Personal Info -->
                <div class="card">
                    <div class="flex items-center gap-2 mb-4">
                        <User class="w-5 h-5 text-primary-600" />
                        <h2 class="font-semibold text-secondary-900">Personal Information</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Full Name</label>
                            <input v-model="form.personalInfo.name" type="text" class="text-sm input"
                                placeholder="John Doe" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Email</label>
                            <input v-model="form.personalInfo.email" type="email" class="text-sm input"
                                placeholder="you@example.com" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Phone</label>
                            <input v-model="form.personalInfo.phone" type="text" class="text-sm input"
                                placeholder="+62 812 3456 7890" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Address</label>
                            <input v-model="form.personalInfo.address" type="text" class="text-sm input"
                                placeholder="Jakarta, Indonesia" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">LinkedIn</label>
                            <input v-model="form.personalInfo.linkedin" type="text" class="text-sm input"
                                placeholder="linkedin.com/in/johndoe" />
                        </div>
                        <div>
                            <label class="block mb-1 text-xs font-medium text-secondary-600">Website</label>
                            <input v-model="form.personalInfo.website" type="text" class="text-sm input"
                                placeholder="johndoe.com" />
                        </div>
                    </div>
                </div>

                <!-- Summary -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <AlignLeft class="w-5 h-5 text-primary-600" />
                            <h2 class="font-semibold text-secondary-900">Professional Summary</h2>
                        </div>
                        <button v-if="currentResume?.generatedCv" @click="handleRegenerateSection('summary')"
                            :disabled="generating"
                            class="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700">
                            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': generating }" />
                            Regenerate
                        </button>
                    </div>
                    <textarea v-model="form.summary" rows="4" class="text-sm resize-none input"
                        placeholder="Write a professional summary..."></textarea>
                </div>

                <!-- Experience -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <Briefcase class="w-5 h-5 text-primary-600" />
                            <h2 class="font-semibold text-secondary-900">Work Experience</h2>
                        </div>
                        <button @click="addExperience"
                            class="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700">
                            <PlusCircle class="w-4 h-4" />
                            Add
                        </button>
                    </div>

                    <div v-if="form.experience.length === 0" class="py-8 text-sm text-center text-secondary-400">
                        <Briefcase class="w-8 h-8 mx-auto mb-2 text-secondary-300" />
                        No experience added yet
                    </div>

                    <div v-else class="flex flex-col gap-4">
                        <div v-for="(exp, index) in form.experience" :key="index"
                            class="flex flex-col gap-3 p-4 border rounded-xl border-secondary-100">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-secondary-700">Experience {{ index + 1 }}</span>
                                <div class="flex items-center gap-2">
                                    <button v-if="currentResume?.generatedCv"
                                        @click="handleRegenerateSection('experience', index)" :disabled="generating"
                                        class="flex items-center gap-1 text-xs text-primary-600">
                                        <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': generating }" />
                                        Regenerate
                                    </button>
                                    <button @click="removeExperience(index)" class="text-red-400 hover:text-red-600">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Company</label>
                                    <input v-model="exp.company" type="text" class="text-sm input"
                                        placeholder="Company name" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Position</label>
                                    <input v-model="exp.position" type="text" class="text-sm input"
                                        placeholder="Job title" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Start Date</label>
                                    <input v-model="exp.startDate" type="text" class="text-sm input"
                                        placeholder="Jan 2023" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">End Date</label>
                                    <input v-model="exp.endDate" type="text" class="text-sm input"
                                        placeholder="Dec 2024" :disabled="exp.isCurrent" />
                                </div>
                            </div>
                            <label class="flex items-center gap-2 text-sm cursor-pointer text-secondary-600">
                                <input v-model="exp.isCurrent" type="checkbox" class="rounded" />
                                Currently working here
                            </label>
                            <div>
                                <label class="block mb-1 text-xs font-medium text-secondary-600">Description</label>
                                <textarea v-model="exp.descriptionText" rows="3" class="text-sm resize-none input"
                                    placeholder="One bullet point per line..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Education -->
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <GraduationCap class="w-5 h-5 text-primary-600" />
                            <h2 class="font-semibold text-secondary-900">Education</h2>
                        </div>
                        <button @click="addEducation"
                            class="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700">
                            <PlusCircle class="w-4 h-4" />
                            Add
                        </button>
                    </div>

                    <div v-if="form.education.length === 0" class="py-8 text-sm text-center text-secondary-400">
                        <GraduationCap class="w-8 h-8 mx-auto mb-2 text-secondary-300" />
                        No education added yet
                    </div>

                    <div v-else class="flex flex-col gap-4">
                        <div v-for="(edu, index) in form.education" :key="index"
                            class="flex flex-col gap-3 p-4 border rounded-xl border-secondary-100">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-secondary-700">Education {{ index + 1 }}</span>
                                <button @click="removeEducation(index)" class="text-red-400 hover:text-red-600">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Institution</label>
                                    <input v-model="edu.institution" type="text" class="text-sm input"
                                        placeholder="University name" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Degree</label>
                                    <input v-model="edu.degree" type="text" class="text-sm input"
                                        placeholder="Bachelor's Degree" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Field of
                                        Study</label>
                                    <input v-model="edu.field" type="text" class="text-sm input"
                                        placeholder="Computer Science" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">GPA</label>
                                    <input v-model="edu.gpa" type="text" class="text-sm input" placeholder="3.8" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">Start Date</label>
                                    <input v-model="edu.startDate" type="text" class="text-sm input"
                                        placeholder="2019" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-secondary-600">End Date</label>
                                    <input v-model="edu.endDate" type="text" class="text-sm input" placeholder="2023" />
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
                            <h2 class="font-semibold text-secondary-900">Skills</h2>
                        </div>
                        <button v-if="currentResume?.generatedCv" @click="handleRegenerateSection('skills')"
                            :disabled="generating" class="flex items-center gap-1.5 text-xs text-primary-600">
                            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': generating }" />
                            Regenerate
                        </button>
                    </div>
                    <input v-model="skillInput" type="text" class="mb-3 text-sm input"
                        placeholder="Type a skill and press Enter..." @keydown.enter.prevent="addSkill" />
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
                        <h2 class="font-semibold text-secondary-900">Job Description</h2>
                    </div>
                    <textarea v-model="jobDesc" rows="6" class="mb-4 text-sm resize-none input"
                        placeholder="Paste the job description here..."></textarea>
                    <button @click="handleGenerate" :disabled="generating || !jobDesc.trim()"
                        class="flex items-center justify-center w-full gap-2 btn-primary">
                        <LoadingSpinner v-if="generating" size="sm" />
                        <span v-else class="flex items-center gap-2">
                            <Sparkles class="w-4 h-4" />
                            Generate with AI
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
                        <h2 class="font-semibold text-secondary-900">Match Score</h2>
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
                                <span class="text-secondary-500">Skills</span>
                                <span class="font-medium">{{ matchResult.breakdown?.skills }}%</span>
                            </span>
                            <span class="flex items-center justify-between gap-8">
                                <span class="text-secondary-500">Experience</span>
                                <span class="font-medium">{{ matchResult.breakdown?.experience }}%</span>
                            </span>
                            <span class="flex items-center justify-between gap-8">
                                <span class="text-secondary-500">Education</span>
                                <span class="font-medium">{{ matchResult.breakdown?.education }}%</span>
                            </span>
                        </div>
                    </div>
                    <div v-if="matchResult.missingKeywords?.length" class="mb-3">
                        <p class="mb-2 text-xs font-medium text-secondary-600">Missing Keywords</p>
                        <div class="flex flex-wrap gap-1.5">
                            <span v-for="kw in matchResult.missingKeywords" :key="kw" class="badge badge-danger">{{ kw
                                }}</span>
                        </div>
                    </div>
                    <div v-if="matchResult.suggestions?.length">
                        <p class="mb-2 text-xs font-medium text-secondary-600">Suggestions</p>
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
                        <h2 class="font-semibold text-secondary-900">Preview</h2>
                    </div>

                    <div class="p-6 font-mono text-sm leading-relaxed bg-secondary-50 rounded-xl">
                        <div class="mb-4 text-center">
                            <p class="text-lg font-bold text-secondary-900">
                                {{ previewData.personalInfo?.name || 'Your Name' }}
                            </p>
                            <p class="mt-1 text-xs text-secondary-500">
                                {{ [previewData.personalInfo?.email, previewData.personalInfo?.phone,
                                previewData.personalInfo?.address].filter(Boolean).join(' | ') }}
                            </p>
                        </div>

                        <div v-if="previewData.summary" class="mb-4">
                            <p
                                class="pb-1 mb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary-700 border-secondary-200">
                                Summary
                            </p>
                            <p class="text-xs text-secondary-600">{{ previewData.summary }}</p>
                        </div>

                        <div v-if="previewData.experience?.length" class="mb-4">
                            <p
                                class="pb-1 mb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary-700 border-secondary-200">
                                Experience
                            </p>
                            <div v-for="exp in previewData.experience" :key="exp.company" class="mb-2">
                                <p class="text-xs font-semibold text-secondary-800">{{ exp.position }} — {{ exp.company
                                }}</p>
                                <p class="text-xs text-secondary-500">{{ exp.startDate }} - {{ exp.isCurrent ? 'Present'
                                    : exp.endDate }}</p>
                                <ul v-if="exp.description?.length" class="mt-1">
                                    <li v-for="d in exp.description" :key="d" class="text-xs text-secondary-600">- {{ d
                                    }}</li>
                                </ul>
                            </div>
                        </div>

                        <div v-if="previewData.education?.length" class="mb-4">
                            <p
                                class="pb-1 mb-2 text-xs font-bold tracking-wider uppercase border-b text-secondary-700 border-secondary-200">
                                Education
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
                                Skills
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
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import UploadCV from '@/components/UploadCV.vue'

const route = useRoute()
const { currentResume, matchResult, loading, generating, error, fetchById, update, generate, regenerateSection, exportResume } = useResume()

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

const removeExperience = (index) => {
    form.value.experience.splice(index, 1)
}

const addEducation = () => {
    form.value.education.push({
        institution: '', degree: '', field: '', gpa: '', startDate: '', endDate: ''
    })
}

const removeEducation = (index) => {
    form.value.education.splice(index, 1)
}

const addSkill = () => {
    const skill = skillInput.value.trim()
    if (skill && !form.value.skills.includes(skill)) {
        form.value.skills.push(skill)
    }
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
    await update(route.params.id, { cvBase: buildCvBase() })
}

const handleGenerate = async () => {
    if (!jobDesc.value || jobDesc.value.trim().length < 10) {
        alert('Job description must be at least 10 characters')
        return
    }
    await handleSave()
    await generate(route.params.id, jobDesc.value)
}

const handleRegenerateSection = async (section, index) => {
    await regenerateSection(route.params.id, section, index)
}

const handleExport = async () => {
    await exportResume(route.params.id)
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

watch(currentResume, (val) => populateForm(val))

onMounted(async () => {
    await fetchById(route.params.id)
})

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
}
</script>