<template>
    <div class="overflow-x-hidden">

        <!-- Hero -->
        <section class="relative py-20 overflow-hidden text-center sm:py-28">
            <div class="absolute inset-0 pointer-events-none -z-10">
                <div
                    class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-100/60 dark:bg-primary-900/20 rounded-full blur-3xl">
                </div>
            </div>

            <div class="max-w-4xl px-4 mx-auto">
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold tracking-wide uppercase border rounded-full bg-primary-50 dark:bg-primary-900/40 border-primary-200 dark:border-primary-700/50 text-primary-700 dark:text-primary-300">
                    <Sparkles class="w-3.5 h-3.5" />
                    Didukung AI Generatif
                </div>

                <h1
                    class="mb-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl text-slate-900 dark:text-white">
                    Buat CV yang<br />
                    <span class="relative inline-block mt-1">
                        <span class="gradient-text">Langsung Dilirik</span>
                        <svg class="absolute left-0 w-full -bottom-1" viewBox="0 0 300 8" fill="none"
                            preserveAspectRatio="none">
                            <path d="M0 6 Q75 0 150 4 Q225 8 300 2" stroke="url(#grad)" stroke-width="3"
                                stroke-linecap="round" fill="none" />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stop-color="#0284c7" />
                                    <stop offset="100%" stop-color="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                    <span class="block">HRD</span>
                </h1>

                <p
                    class="max-w-2xl mx-auto mb-10 text-lg leading-relaxed sm:text-xl text-slate-500 dark:text-slate-400">
                    Biarkan AI menyesuaikan CV kamu dengan setiap lowongan secara otomatis.
                    Tingkatkan peluang dipanggil interview hingga 3x lebih tinggi.
                </p>

                <div class="flex flex-col items-center justify-center gap-3 mb-12 sm:flex-row">
                    <RouterLink to="/auth/register" class="btn-primary px-8 py-3.5 text-base w-full sm:w-auto">
                        <Zap class="w-5 h-5" />
                        Mulai Gratis — Tanpa Kartu Kredit
                    </RouterLink>
                    <RouterLink to="/auth/login" class="btn-outline px-8 py-3.5 text-base w-full sm:w-auto">
                        <LogIn class="w-5 h-5" />
                        Masuk ke Akun
                    </RouterLink>
                </div>

                <div
                    class="flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:gap-8 text-slate-500 dark:text-slate-400">
                    <div class="flex items-center gap-2">
                        <CheckCircle class="w-4 h-4 text-emerald-500 shrink-0" />
                        Gratis selamanya
                    </div>
                    <div class="flex items-center gap-2">
                        <ShieldCheck class="w-4 h-4 text-primary-500 shrink-0" />
                        Data aman & terenkripsi
                    </div>
                    <div class="flex items-center gap-2">
                        <Zap class="w-4 h-4 text-amber-500 shrink-0" />
                        Hasil dalam hitungan detik
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats -->
        <section class="px-4 py-12">
            <div class="grid max-w-3xl grid-cols-1 gap-4 mx-auto sm:grid-cols-3">
                <div v-for="stat in stats" :key="stat.label" class="py-8 text-center card-hover">
                    <div class="mx-auto mb-4 icon-box" :class="stat.bg">
                        <component :is="stat.icon" class="w-5 h-5" :class="stat.color" />
                    </div>
                    <p class="mb-1 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{{ stat.value }}
                    </p>
                    <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="px-4 py-20">
            <div class="max-w-6xl mx-auto">
                <div class="mb-16 text-center">
                    <p class="mb-3 section-label">Fitur Unggulan</p>
                    <h2 class="mb-4 text-3xl font-black sm:text-4xl text-slate-900 dark:text-white">
                        Kenapa AI Resume Builder?
                    </h2>
                    <p class="max-w-xl mx-auto text-lg text-slate-500 dark:text-slate-400">
                        Berhenti buang waktu berjam-jam mengedit CV secara manual.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div v-for="f in features" :key="f.title" class="relative overflow-hidden card-hover group">
                        <div class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                            :class="f.gradient"></div>
                        <div class="relative z-10">
                            <div class="w-12 h-12 mb-5 icon-box rounded-2xl" :class="f.iconBg">
                                <component :is="f.icon" class="w-6 h-6" :class="f.iconColor" />
                            </div>
                            <h3
                                class="mb-3 text-lg font-black transition-colors text-slate-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300">
                                {{ f.title }}</h3>
                            <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{{ f.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- How it works -->
        <section class="px-4 py-20 bg-white dark:bg-slate-900">
            <div class="max-w-5xl mx-auto">
                <div class="mb-16 text-center">
                    <p class="mb-3 section-label">Cara Kerja</p>
                    <h2 class="mb-4 text-3xl font-black sm:text-4xl text-slate-900 dark:text-white">Hanya 4 Langkah</h2>
                    <p class="text-lg text-slate-500 dark:text-slate-400">CV yang disesuaikan dalam hitungan menit</p>
                </div>

                <div class="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                    <div
                        class="hidden lg:block absolute top-12 left-[18%] right-[18%] h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 dark:from-primary-800 dark:via-primary-600 dark:to-primary-800">
                    </div>

                    <div v-for="(step, i) in steps" :key="step.title"
                        class="relative z-10 flex flex-col items-center text-center">
                        <div class="relative flex items-center justify-center w-16 h-16 mb-3 transition-transform shadow-lg rounded-2xl hover:scale-105"
                            :class="step.bg">
                            <component :is="step.icon" class="text-white w-7 h-7" />
                            <div
                                class="absolute flex items-center justify-center w-6 h-6 bg-white border-2 rounded-full -bottom-2 -right-2 dark:bg-slate-900 border-primary-500">
                                <span class="text-xs font-black text-primary-600">{{ i + 1 }}</span>
                            </div>
                        </div>
                        <h3 class="mt-3 mb-2 font-black text-slate-900 dark:text-white">{{ step.title }}</h3>
                        <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{{ step.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="px-4 py-20">
            <div
                class="relative max-w-4xl p-10 mx-auto overflow-hidden text-center shadow-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 rounded-3xl sm:p-16 shadow-primary-500/20">
                <div class="absolute inset-0 overflow-hidden pointer-events-none">
                    <div class="absolute w-64 h-64 rounded-full -top-20 -right-20 bg-white/5"></div>
                    <div class="absolute w-64 h-64 rounded-full -bottom-20 -left-20 bg-black/10"></div>
                </div>
                <div class="relative z-10">
                    <div
                        class="flex items-center justify-center w-16 h-16 mx-auto mb-6 border rounded-2xl bg-white/20 backdrop-blur border-white/30">
                        <Rocket class="w-8 h-8 text-white" />
                    </div>
                    <h2 class="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Siap Dapat Pekerjaan Impianmu?
                    </h2>
                    <p class="max-w-xl mx-auto mb-8 text-lg text-primary-100">
                        Bergabung dengan ribuan pencari kerja yang sudah berhasil menggunakan AI Resume Builder.
                    </p>
                    <RouterLink to="/auth/register"
                        class="inline-flex items-center gap-2 bg-white text-primary-700 font-black px-10 py-4 rounded-2xl hover:bg-primary-50 transition-all shadow-xl hover:-translate-y-0.5 text-base">
                        <Zap class="w-5 h-5" />
                        Mulai Gratis Sekarang
                    </RouterLink>
                    <p class="mt-4 text-sm text-primary-200/80">Tidak perlu kartu kredit · Gratis selamanya</p>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import {
    Zap, LogIn, Rocket, Sparkles, ShieldCheck, CheckCircle,
    Bot, BarChart2, FileText, ClipboardList, Download, FilePen, Users
} from 'lucide-vue-next'

const stats = [
    { value: '10.000+', label: 'Pengguna Aktif', icon: Users, bg: 'bg-primary-100 dark:bg-primary-900/40', color: 'text-primary-600 dark:text-primary-400' },
    { value: '50.000+', label: 'CV Dibuat', icon: FileText, bg: 'bg-emerald-100 dark:bg-emerald-900/40', color: 'text-emerald-600 dark:text-emerald-400' },
    { value: '85%', label: 'Tingkat Interview', icon: BarChart2, bg: 'bg-amber-100 dark:bg-amber-900/40', color: 'text-amber-600 dark:text-amber-400' }
]

const features = [
    {
        icon: Bot,
        title: 'Penulisan dengan AI',
        description: 'AI kami menulis ulang bullet point dan ringkasan profesional agar sesuai dengan setiap deskripsi pekerjaan secara otomatis.',
        iconBg: 'bg-primary-100 dark:bg-primary-900/40',
        iconColor: 'text-primary-600 dark:text-primary-400',
        gradient: 'bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/10'
    },
    {
        icon: BarChart2,
        title: 'Skor Kecocokan',
        description: 'Lihat seberapa cocok CV kamu dengan lowongan, lengkap dengan breakdown per kategori dan saran perbaikan.',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        gradient: 'bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10'
    },
    {
        icon: FileText,
        title: 'Ekspor Ramah ATS',
        description: 'Ekspor CV sebagai PDF bersih yang lolos dari sistem pelacak pelamar dan langsung bisa dikirim.',
        iconBg: 'bg-violet-100 dark:bg-violet-900/40',
        iconColor: 'text-violet-600 dark:text-violet-400',
        gradient: 'bg-gradient-to-br from-violet-50/50 to-transparent dark:from-violet-900/10'
    }
]

const steps = [
    { icon: FilePen, title: 'Buat CV Dasar', description: 'Isi pengalaman kerja, pendidikan, dan keahlian kamu sekali saja.', bg: 'bg-primary-500' },
    { icon: ClipboardList, title: 'Tempel Deskripsi Kerja', description: 'Salin deskripsi pekerjaan yang ingin kamu lamar.', bg: 'bg-blue-500' },
    { icon: Sparkles, title: 'Generate dengan AI', description: 'AI menyesuaikan CV kamu agar cocok sempurna.', bg: 'bg-violet-500' },
    { icon: Download, title: 'Ekspor dan Lamar', description: 'Unduh PDF dan lamar dengan percaya diri.', bg: 'bg-emerald-500' }
]
</script>