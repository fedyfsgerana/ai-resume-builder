<template>
    <div class="flex min-h-screen bg-slate-50 dark:bg-slate-950">

        <!-- Left branding panel -->
        <div
            class="hidden lg:flex flex-col justify-between w-[45%] xl:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-blue-700 p-10 xl:p-14 relative overflow-hidden">
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute rounded-full -top-24 -left-24 w-96 h-96 bg-white/5 blur-xl"></div>
                <div class="absolute rounded-full top-1/2 -right-24 w-80 h-80 bg-white/5 blur-xl"></div>
                <div class="absolute rounded-full -bottom-24 left-1/3 w-96 h-96 bg-black/10 blur-xl"></div>
                <div class="absolute w-px rotate-45 top-1/4 left-1/2 h-96 bg-white/10"></div>
            </div>

            <!-- Logo -->
            <RouterLink to="/" class="relative z-10 flex items-center gap-3 w-fit">
                <div
                    class="flex items-center justify-center w-10 h-10 border rounded-xl bg-white/25 backdrop-blur border-white/30">
                    <span class="text-sm font-black text-white">AI</span>
                </div>
                <span class="text-xl font-black tracking-tight text-white">AIResumeBuilder</span>
            </RouterLink>

            <!-- Center -->
            <div class="relative z-10 space-y-8">
                <div>
                    <div
                        class="flex items-center justify-center mb-6 border w-14 h-14 rounded-2xl bg-white/20 backdrop-blur border-white/30">
                        <Sparkles class="text-white w-7 h-7" />
                    </div>
                    <h2 class="mb-3 text-3xl font-black leading-tight tracking-tight text-white xl:text-4xl">
                        CV Sempurna<br />dalam Hitungan Menit
                    </h2>
                    <p class="text-base leading-relaxed text-primary-200">
                        Biarkan AI menyesuaikan CV kamu dengan setiap lowongan secara otomatis dan akurat.
                    </p>
                </div>

                <div class="space-y-3">
                    <div v-for="f in features" :key="f.text"
                        class="flex items-center gap-3 px-4 py-3 border bg-white/10 backdrop-blur rounded-xl border-white/20">
                        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 shrink-0">
                            <component :is="f.icon" class="w-4 h-4 text-white" />
                        </div>
                        <span class="text-sm font-medium text-white">{{ f.text }}</span>
                    </div>
                </div>
            </div>

            <!-- Bottom stats -->
            <div class="relative z-10 grid grid-cols-3 gap-3">
                <div v-for="stat in stats" :key="stat.label"
                    class="p-3 text-center border bg-white/10 backdrop-blur rounded-xl border-white/20">
                    <p class="text-lg font-black leading-none text-white">{{ stat.value }}</p>
                    <p class="mt-1 text-xs text-primary-200">{{ stat.label }}</p>
                </div>
            </div>
        </div>

        <!-- Right form panel -->
        <div class="flex flex-col items-center justify-center flex-1 px-4 py-12 overflow-y-auto sm:px-8">
            <RouterLink to="/" class="flex items-center gap-2.5 mb-8 lg:hidden">
                <div class="flex items-center justify-center shadow-md w-9 h-9 rounded-xl bg-primary-600">
                    <span class="text-sm font-black text-white">AI</span>
                </div>
                <span class="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    AI<span class="text-primary-600">Resume</span>Builder
                </span>
            </RouterLink>

            <div class="w-full max-w-[420px]">
                <div
                    class="p-8 bg-white border shadow-xl dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800 sm:p-10">
                    <RouterView />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { Sparkles, Zap, BarChart2, FileText, ShieldCheck } from 'lucide-vue-next'

const features = [
    { icon: Zap, text: 'Generate CV dengan AI dalam hitungan detik' },
    { icon: BarChart2, text: 'Skor kecocokan real-time dengan lowongan' },
    { icon: FileText, text: 'Ekspor PDF ramah ATS, siap dikirim' },
    { icon: ShieldCheck, text: 'Data kamu aman dan terenkripsi penuh' }
]

const stats = [
    { value: '10K+', label: 'Pengguna' },
    { value: '50K+', label: 'CV Dibuat' },
    { value: '85%', label: 'Interview' }
]
</script>