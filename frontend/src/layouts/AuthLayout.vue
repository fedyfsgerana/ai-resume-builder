<template>
    <div class="flex min-h-screen dark:bg-secondary-900">
        <div
            class="relative flex-col justify-between hidden w-1/2 p-12 overflow-hidden lg:flex bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900">
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute rounded-full -top-20 -left-20 w-80 h-80 bg-white/5"></div>
                <div class="absolute w-64 h-64 rounded-full top-1/3 -right-20 bg-white/5"></div>
                <div class="absolute rounded-full -bottom-20 left-1/4 w-96 h-96 bg-white/5"></div>
            </div>

            <RouterLink to="/" class="relative z-10 flex items-center gap-3">
                <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm">
                    <span class="text-sm font-extrabold text-white">AI</span>
                </div>
                <span class="text-xl font-extrabold tracking-tight text-white">AI Resume Builder</span>
            </RouterLink>

            <div class="relative z-10">
                <div class="flex items-center justify-center w-16 h-16 mb-8 rounded-3xl bg-white/20 backdrop-blur-sm">
                    <Sparkles class="w-8 h-8 text-white" />
                </div>
                <h2 class="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white">
                    CV yang Sempurna<br />dalam Hitungan Menit
                </h2>
                <p class="mb-10 text-lg leading-relaxed text-primary-200">
                    Biarkan AI menyesuaikan CV kamu dengan setiap lowongan secara otomatis.
                </p>
                <div class="flex flex-col gap-4">
                    <div v-for="feature in features" :key="feature.text" class="flex items-center gap-3">
                        <div
                            class="flex items-center justify-center w-8 h-8 rounded-xl bg-white/20 shrink-0 backdrop-blur-sm">
                            <component :is="feature.icon" class="w-4 h-4 text-white" />
                        </div>
                        <span class="text-sm font-medium text-primary-100">{{ feature.text }}</span>
                    </div>
                </div>
            </div>

            <div class="relative z-10 p-5 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
                <div class="flex gap-0.5 mb-3">
                    <Star v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-300 fill-yellow-300" />
                </div>
                <p class="mb-4 text-sm leading-relaxed text-primary-100">
                    "CV saya langsung disesuaikan dengan lowongan yang dituju. Seminggu kemudian saya dapat panggilan
                    interview!"
                </p>
                <div class="flex items-center gap-3">
                    <div
                        class="flex items-center justify-center text-sm font-bold text-white rounded-full w-9 h-9 bg-white/20">
                        B</div>
                    <div>
                        <p class="text-sm font-semibold text-white">Budi Santoso</p>
                        <p class="text-xs text-primary-300">Software Engineer di Tokopedia</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col items-center justify-center flex-1 px-6 py-12 bg-secondary-50 dark:bg-secondary-900">
            <RouterLink to="/" class="flex items-center gap-2 mb-8 lg:hidden">
                <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600">
                    <span class="text-sm font-extrabold text-white">AI</span>
                </div>
                <span class="text-xl font-extrabold tracking-tight text-secondary-900 dark:text-white">
                    AI <span class="text-primary-600">Resume</span> Builder
                </span>
            </RouterLink>

            <div class="w-full max-w-md">
                <div
                    class="p-8 bg-white border shadow-xl dark:bg-secondary-800 rounded-3xl border-secondary-100 dark:border-secondary-700">
                    <RouterView />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { Sparkles, Star, Zap, BarChart2, FileText, ShieldCheck } from 'lucide-vue-next'

const features = [
    { icon: Zap, text: 'Generate CV otomatis dengan AI dalam detik' },
    { icon: BarChart2, text: 'Skor kecocokan real-time dengan lowongan' },
    { icon: FileText, text: 'Ekspor PDF ramah ATS siap kirim' },
    { icon: ShieldCheck, text: 'Data aman dan terenkripsi penuh' }
]
</script>