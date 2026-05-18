<template>
    <div class="max-w-4xl mx-auto space-y-6">

        <!-- Header -->
        <div class="flex items-center gap-3">
            <button @click="router.back()"
                class="flex items-center justify-center transition-all bg-white border w-9 h-9 rounded-xl dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <ArrowLeft class="w-4 h-4" />
            </button>
            <div>
                <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Analisis Kata Kunci</h1>
                <p class="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Detail kecocokan CV dengan deskripsi
                    pekerjaan</p>
            </div>
        </div>

        <LoadingSpinner v-if="loading" text="Menganalisis kata kunci..." fullscreen />

        <!-- Empty state -->
        <div v-else-if="!analysis" class="py-20 text-center card">
            <div
                class="flex items-center justify-center w-20 h-20 mx-auto mb-5 rounded-3xl bg-slate-100 dark:bg-slate-800">
                <SearchX class="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 class="mb-2 text-xl font-black text-slate-700 dark:text-slate-300">Analisis Tidak Tersedia</h3>
            <p class="max-w-xs mx-auto mb-6 text-sm text-slate-400 dark:text-slate-500">
                Generate CV dengan AI terlebih dahulu untuk melihat analisis kata kunci
            </p>
            <button @click="router.back()" class="mx-auto btn-primary">
                <ArrowLeft class="w-4 h-4" />
                Kembali ke Builder
            </button>
        </div>

        <template v-else>

            <!-- Overall Score -->
            <div class="card">
                <div class="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                    <div class="w-10 h-10 icon-box rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                        <BarChart2 class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h2 class="font-black text-slate-900 dark:text-white">Skor Keseluruhan</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tingkat kecocokan CV dengan
                            lowongan</p>
                    </div>
                </div>

                <div class="flex flex-col items-center gap-8 sm:flex-row">
                    <div class="relative w-32 h-32 shrink-0">
                        <svg class="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" stroke-width="3"
                                class="dark:stroke-slate-700" />
                            <circle cx="18" cy="18" r="15.9" fill="none" :stroke="scoreColor" stroke-width="3"
                                stroke-dasharray="100" :stroke-dashoffset="100 - analysis.overallMatch"
                                stroke-linecap="round" class="transition-all duration-1000" />
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <span class="text-3xl font-black leading-none text-slate-900 dark:text-white">{{
                                analysis.overallMatch }}</span>
                            <span class="text-xs text-slate-400 font-semibold mt-0.5">/100</span>
                        </div>
                    </div>

                    <div class="flex-1 w-full space-y-4">
                        <div v-for="(score, key) in analysis.categoryScores" :key="key">
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-sm font-bold text-slate-600 dark:text-slate-400">{{ categoryLabel(key)
                                    }}</span>
                                <span class="text-sm font-black"
                                    :class="score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'">
                                    {{ score }}%
                                </span>
                            </div>
                            <div class="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div class="h-full transition-all duration-700 rounded-full"
                                    :class="score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-400'"
                                    :style="{ width: `${score}%` }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Recommendations -->
            <div class="card">
                <div class="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                    <div class="w-10 h-10 icon-box rounded-xl bg-amber-100 dark:bg-amber-900/40">
                        <Lightbulb class="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h2 class="font-black text-slate-900 dark:text-white">Rekomendasi Utama</h2>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Lakukan ini untuk meningkatkan skor
                        </p>
                    </div>
                </div>

                <ul class="space-y-3">
                    <li v-for="(rec, i) in analysis.topRecommendations" :key="i"
                        class="flex items-start gap-3 p-4 border bg-amber-50 dark:bg-amber-900/10 rounded-2xl border-amber-100 dark:border-amber-800/30">
                        <div
                            class="w-7 h-7 rounded-xl bg-amber-400 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                            {{ i + 1 }}
                        </div>
                        <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{{ rec }}</p>
                    </li>
                </ul>
            </div>

            <!-- Missing Keywords -->
            <div class="card">
                <div
                    class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-red-100 icon-box rounded-xl dark:bg-red-900/40">
                            <XCircle class="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 class="font-black text-slate-900 dark:text-white">Kata Kunci yang Kurang</h2>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tambahkan ini ke CV untuk
                                meningkatkan skor</p>
                        </div>
                    </div>
                    <span class="badge badge-danger text-sm px-3 py-1.5">
                        {{ analysis.missingKeywords.length }} kata kunci
                    </span>
                </div>

                <div class="space-y-2">
                    <div v-for="kw in sortedMissing" :key="kw.keyword"
                        class="flex items-start justify-between gap-4 p-4 transition-colors border border-red-100 rounded-2xl dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800/50">
                        <div class="flex items-start min-w-0 gap-3">
                            <span class="badge shrink-0 mt-0.5"
                                :class="kw.importance === 'high' ? 'badge-danger' : kw.importance === 'medium' ? 'badge-warning' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'">
                                {{ importanceLabel(kw.importance) }}
                            </span>
                            <div class="min-w-0">
                                <p class="text-sm font-black text-slate-900 dark:text-white">{{ kw.keyword }}</p>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{{
                                    kw.suggestion }}</p>
                            </div>
                        </div>
                        <span class="badge badge-info shrink-0">{{ categoryLabel(kw.category) }}</span>
                    </div>
                </div>
            </div>

            <!-- Present Keywords -->
            <div class="card">
                <div
                    class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 icon-box rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                            <CheckCircle class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 class="font-black text-slate-900 dark:text-white">Kata Kunci yang Ada</h2>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kata kunci yang sudah ada di CV
                                kamu</p>
                        </div>
                    </div>
                    <span class="badge badge-success text-sm px-3 py-1.5">
                        {{ analysis.presentKeywords.length }} kata kunci
                    </span>
                </div>

                <div class="flex flex-wrap gap-2">
                    <div v-for="kw in analysis.presentKeywords" :key="kw.keyword"
                        class="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all"
                        :class="presentKeywordClass(kw.importance)">
                        <CheckCircle class="w-3.5 h-3.5 shrink-0" />
                        {{ kw.keyword }}
                    </div>
                </div>
            </div>

        </template>
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
    const s = analysis.value?.overallMatch || 0
    return s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444'
})

const sortedMissing = computed(() => {
    if (!analysis.value?.missingKeywords) return []
    const order = { high: 0, medium: 1, low: 2 }
    return [...analysis.value.missingKeywords].sort((a, b) => order[a.importance] - order[b.importance])
})

const categoryLabel = (k) => ({ skill: 'Keahlian', skills: 'Keahlian', experience: 'Pengalaman', education: 'Pendidikan', other: 'Lainnya' }[k] || k)
const importanceLabel = (i) => ({ high: 'Tinggi', medium: 'Sedang', low: 'Rendah' }[i] || i)

const presentKeywordClass = (importance) => ({
    high: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-300',
    medium: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300',
    low: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
}[importance] || 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400')

onMounted(async () => {
    loading.value = true
    try {
        const data = await resumeService.analyzeKeywords(route.params.id)
        analysis.value = data.analysis
    } catch {
        error('Gagal memuat analisis. Pastikan CV sudah digenerate dengan AI.')
    } finally {
        loading.value = false
    }
})
</script>