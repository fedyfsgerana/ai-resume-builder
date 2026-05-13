<template>
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-8">
            <button @click="router.back()"
                class="transition-colors text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                <ArrowLeft class="w-5 h-5" />
            </button>
            <div>
                <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Analisis Kata Kunci</h1>
                <p class="mt-1 text-sm text-secondary-500 dark:text-secondary-400">Detail kecocokan CV kamu dengan
                    deskripsi pekerjaan</p>
            </div>
        </div>

        <LoadingSpinner v-if="loading" text="Menganalisis kata kunci..." fullscreen />

        <div v-else-if="!analysis" class="py-20 text-center">
            <SearchX class="w-16 h-16 mx-auto mb-4 text-secondary-300 dark:text-secondary-600" />
            <p class="text-lg font-medium text-secondary-500 dark:text-secondary-400">Analisis tidak tersedia</p>
            <p class="mt-1 mb-6 text-sm text-secondary-400 dark:text-secondary-500">
                Generate CV dengan AI terlebih dahulu untuk melihat analisis kata kunci
            </p>
            <button @click="router.back()" class="flex items-center gap-2 mx-auto btn-primary">
                <ArrowLeft class="w-4 h-4" />
                Kembali ke Builder
            </button>
        </div>

        <div v-else class="flex flex-col gap-6">

            <!-- Overall Score -->
            <div class="card">
                <div class="flex items-center gap-2 mb-6">
                    <BarChart2 class="w-5 h-5 text-primary-600" />
                    <h2 class="font-semibold text-secondary-900 dark:text-secondary-100">Skor Keseluruhan</h2>
                </div>

                <div class="flex items-center gap-8">
                    <div class="relative w-28 h-28 shrink-0">
                        <svg class="-rotate-90 w-28 h-28" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="3" />
                            <circle cx="18" cy="18" r="15.9" fill="none" :stroke="scoreColor" stroke-width="3"
                                stroke-dasharray="100" :stroke-dashoffset="100 - analysis.overallMatch"
                                stroke-linecap="round" />
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{{
                                analysis.overallMatch }}</span>
                            <span class="text-xs text-secondary-400">/ 100</span>
                        </div>
                    </div>

                    <div class="flex flex-col flex-1 gap-3">
                        <div v-for="(score, key) in analysis.categoryScores" :key="key">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm capitalize text-secondary-600 dark:text-secondary-400">{{
                                    categoryLabel(key) }}</span>
                                <span class="text-sm font-semibold text-secondary-900 dark:text-secondary-100">{{ score
                                    }}%</span>
                            </div>
                            <div class="h-2 overflow-hidden rounded-full bg-secondary-100 dark:bg-secondary-700">
                                <div class="h-full transition-all duration-500 rounded-full"
                                    :class="scoreBarColor(score)" :style="{ width: `${score}%` }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Recommendations -->
            <div class="card">
                <div class="flex items-center gap-2 mb-4">
                    <Lightbulb class="w-5 h-5 text-yellow-500" />
                    <h2 class="font-semibold text-secondary-900 dark:text-secondary-100">Rekomendasi Utama</h2>
                </div>
                <ul class="flex flex-col gap-3">
                    <li v-for="(rec, index) in analysis.topRecommendations" :key="index"
                        class="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                        <div
                            class="w-6 h-6 rounded-full bg-yellow-400 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {{ index + 1 }}
                        </div>
                        <p class="text-sm text-secondary-700 dark:text-secondary-300">{{ rec }}</p>
                    </li>
                </ul>
            </div>

            <!-- Missing Keywords -->
            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <XCircle class="w-5 h-5 text-red-500" />
                        <h2 class="font-semibold text-secondary-900 dark:text-secondary-100">Kata Kunci yang Kurang</h2>
                    </div>
                    <span class="badge badge-danger">{{ analysis.missingKeywords.length }} kata kunci</span>
                </div>

                <div class="flex flex-col gap-2">
                    <div v-for="kw in sortedMissing" :key="kw.keyword"
                        class="flex items-start justify-between p-3 border border-red-100 rounded-xl dark:border-red-900 bg-red-50 dark:bg-red-900/20">
                        <div class="flex items-start gap-3">
                            <span :class="importanceBadge(kw.importance)" class="mt-0.5 shrink-0">
                                {{ importanceLabel(kw.importance) }}
                            </span>
                            <div>
                                <p class="text-sm font-semibold text-secondary-900 dark:text-secondary-100">{{
                                    kw.keyword }}</p>
                                <p class="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">{{ kw.suggestion }}
                                </p>
                            </div>
                        </div>
                        <span class="ml-2 badge badge-info shrink-0">{{ categoryLabel(kw.category) }}</span>
                    </div>
                </div>
            </div>

            <!-- Present Keywords -->
            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                        <CheckCircle class="w-5 h-5 text-green-500" />
                        <h2 class="font-semibold text-secondary-900 dark:text-secondary-100">Kata Kunci yang Ada</h2>
                    </div>
                    <span class="badge badge-success">{{ analysis.presentKeywords.length }} kata kunci</span>
                </div>

                <div class="flex flex-wrap gap-2">
                    <div v-for="kw in analysis.presentKeywords" :key="kw.keyword"
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm"
                        :class="presentKeywordClass(kw.importance)">
                        <CheckCircle class="w-3.5 h-3.5" />
                        {{ kw.keyword }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, BarChart2, Lightbulb, XCircle, CheckCircle, SearchX } from 'lucide-vue-next'
import { resumeService } from '@/services/resumeService.js'
import { useToast } from '@/composables/useToast.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const { error } = useToast()

const loading = ref(false)
const analysis = ref(null)

const scoreColor = computed(() => {
    const score = analysis.value?.overallMatch || 0
    if (score >= 75) return '#22c55e'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
})

const sortedMissing = computed(() => {
    if (!analysis.value?.missingKeywords) return []
    const order = { high: 0, medium: 1, low: 2 }
    return [...analysis.value.missingKeywords].sort((a, b) => order[a.importance] - order[b.importance])
})

const categoryLabel = (key) => ({
    skill: 'Keahlian', skills: 'Keahlian', experience: 'Pengalaman',
    education: 'Pendidikan', other: 'Lainnya'
}[key] || key)

const importanceLabel = (importance) => ({
    high: 'Tinggi', medium: 'Sedang', low: 'Rendah'
}[importance] || importance)

const importanceBadge = (importance) => ({
    high: 'badge bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300',
    medium: 'badge bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    low: 'badge bg-secondary-200 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300'
}[importance] || 'badge')

const scoreBarColor = (score) => {
    if (score >= 75) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
}

const presentKeywordClass = (importance) => ({
    high: 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300',
    medium: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    low: 'border-secondary-200 bg-secondary-50 text-secondary-600 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-300'
}[importance] || 'border-secondary-200 bg-secondary-50 text-secondary-600 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-300')

onMounted(async () => {
    loading.value = true
    try {
        const data = await resumeService.analyzeKeywords(route.params.id)
        analysis.value = data.analysis
    } catch {
        error('Gagal memuat analisis, pastikan CV sudah digenerate dengan AI')
    } finally {
        loading.value = false
    }
})
</script>