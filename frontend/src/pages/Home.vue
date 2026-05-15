<template>
    <div class="overflow-x-hidden">

        <!-- Hero Section -->
        <section class="relative py-24 overflow-hidden text-center">
            <!-- Background gradient -->
            <div class="absolute inset-0 -z-10">
                <div
                    class="absolute top-0 rounded-full left-1/4 w-96 h-96 bg-primary-200/40 dark:bg-primary-900/30 blur-3xl">
                </div>
                <div
                    class="absolute bottom-0 rounded-full right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 blur-3xl">
                </div>
            </div>

            <div class="max-w-4xl px-4 mx-auto">
                <div
                    class="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
                    <Sparkles class="w-4 h-4" />
                    Didukung oleh AI Generatif
                </div>
                <h1
                    class="mb-6 text-6xl font-extrabold leading-tight tracking-tight text-secondary-900 dark:text-white">
                    Buat CV yang
                    <span class="relative inline-block">
                        <span class="text-primary-600"> Langsung Dilirik</span>
                        <svg class="absolute left-0 w-full -bottom-2" viewBox="0 0 300 12" fill="none">
                            <path d="M2 10 Q150 2 298 10" stroke="#0284c7" stroke-width="3" stroke-linecap="round" />
                        </svg>
                    </span>
                    <br />HRD
                </h1>
                <p class="max-w-2xl mx-auto mb-10 text-xl leading-relaxed text-secondary-500 dark:text-secondary-400">
                    Biarkan AI menyesuaikan CV kamu dengan setiap lowongan secara otomatis.
                    Dapatkan skor kecocokan lebih tinggi dan lebih banyak panggilan interview.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-4">
                    <RouterLink to="/auth/register"
                        class="group btn-primary px-8 py-3.5 text-base flex items-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all hover:-translate-y-0.5">
                        <Zap class="w-5 h-5 transition-transform group-hover:rotate-12" />
                        Mulai Gratis
                    </RouterLink>
                    <RouterLink to="/auth/login"
                        class="btn-outline px-8 py-3.5 text-base flex items-center gap-2 hover:-translate-y-0.5 transition-all">
                        <LogIn class="w-5 h-5" />
                        Masuk
                    </RouterLink>
                </div>

                <!-- Trust badges -->
                <div
                    class="flex items-center justify-center gap-6 mt-12 text-sm text-secondary-400 dark:text-secondary-500">
                    <div class="flex items-center gap-1.5">
                        <ShieldCheck class="w-4 h-4 text-green-500" />
                        Gratis untuk dicoba
                    </div>
                    <div class="flex items-center gap-1.5">
                        <Lock class="w-4 h-4 text-primary-500" />
                        Data aman & terenkripsi
                    </div>
                    <div class="flex items-center gap-1.5">
                        <Zap class="w-4 h-4 text-yellow-500" />
                        Hasil dalam hitungan detik
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="px-4 py-12">
            <div class="grid max-w-4xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
                <div v-for="stat in stats" :key="stat.label"
                    class="text-center transition-all card group hover:-translate-y-1 hover:shadow-lg">
                    <div class="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-2xl"
                        :class="stat.iconBg">
                        <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
                    </div>
                    <p class="mb-1 text-4xl font-extrabold tracking-tight text-primary-600">{{ stat.value }}</p>
                    <p class="text-sm font-medium text-secondary-500 dark:text-secondary-400">{{ stat.label }}</p>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="px-4 py-20">
            <div class="text-center mb-14">
                <span class="text-sm font-semibold tracking-widest uppercase text-primary-600">Fitur Unggulan</span>
                <h2 class="mt-2 mb-4 text-4xl font-extrabold text-secondary-900 dark:text-white">
                    Kenapa Pakai AI Resume Builder?
                </h2>
                <p class="max-w-xl mx-auto text-lg text-secondary-500 dark:text-secondary-400">
                    Berhenti buang waktu berjam-jam mengedit CV secara manual untuk setiap lamaran.
                </p>
            </div>

            <div class="grid max-w-5xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
                <div v-for="feature in features" :key="feature.title"
                    class="relative overflow-hidden transition-all cursor-default card group hover:-translate-y-1 hover:shadow-xl">
                    <div class="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 rounded-full opacity-5"
                        :class="feature.bgAccent"></div>
                    <div class="flex items-center justify-center mb-5 transition-transform w-14 h-14 rounded-2xl group-hover:scale-110"
                        :class="feature.iconBg">
                        <component :is="feature.icon" class="w-7 h-7" :class="feature.iconColor" />
                    </div>
                    <h3 class="mb-2 text-lg font-bold text-secondary-900 dark:text-white">{{ feature.title }}</h3>
                    <p class="text-sm leading-relaxed text-secondary-500 dark:text-secondary-400">{{ feature.description
                        }}</p>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section class="px-4 py-20">
            <div class="max-w-5xl mx-auto">
                <div class="text-center mb-14">
                    <span class="text-sm font-semibold tracking-widest uppercase text-primary-600">Cara Kerja</span>
                    <h2 class="mt-2 mb-4 text-4xl font-extrabold text-secondary-900 dark:text-white">Hanya 4 Langkah
                    </h2>
                    <p class="text-lg text-secondary-500 dark:text-secondary-400">Dapatkan CV yang disesuaikan dalam
                        hitungan menit</p>
                </div>

                <div class="relative grid grid-cols-1 gap-6 md:grid-cols-4">
                    <!-- Connector line -->
                    <div
                        class="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 dark:from-primary-800 dark:via-primary-600 dark:to-primary-800 -z-0">
                    </div>

                    <div v-for="(step, index) in steps" :key="step.title" class="relative z-10 text-center">
                        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 transition-transform shadow-lg rounded-2xl hover:scale-105"
                            :class="step.bg">
                            <component :is="step.icon" class="text-white w-7 h-7" />
                        </div>
                        <div
                            class="flex items-center justify-center w-6 h-6 mx-auto mb-3 -mt-2 text-xs font-bold text-white rounded-full bg-primary-600 ring-2 ring-white dark:ring-secondary-900">
                            {{ index + 1 }}
                        </div>
                        <h3 class="mb-2 text-sm font-bold text-secondary-900 dark:text-white">{{ step.title }}</h3>
                        <p class="text-xs leading-relaxed text-secondary-500 dark:text-secondary-400">{{
                            step.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonial Section -->
        <section class="px-4 py-20">
            <div class="text-center mb-14">
                <span class="text-sm font-semibold tracking-widest uppercase text-primary-600">Testimoni</span>
                <h2 class="mt-2 mb-4 text-4xl font-extrabold text-secondary-900 dark:text-white">Kata Mereka</h2>
                <p class="text-lg text-secondary-500 dark:text-secondary-400">Ribuan pencari kerja sudah merasakan
                    manfaatnya</p>
            </div>

            <div class="grid max-w-5xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
                <div v-for="testimonial in testimonials" :key="testimonial.name"
                    class="relative overflow-hidden transition-all card hover:-translate-y-1 hover:shadow-xl">
                    <div class="absolute top-4 right-4 text-primary-100 dark:text-primary-900">
                        <Quote class="w-10 h-10" />
                    </div>
                    <div class="flex gap-0.5 mb-4">
                        <Star v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <p class="relative z-10 mb-5 text-sm leading-relaxed text-secondary-600 dark:text-secondary-300">
                        "{{ testimonial.message }}"
                    </p>
                    <div class="flex items-center gap-3 pt-4 border-t border-secondary-100 dark:border-secondary-700">
                        <div class="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full shrink-0"
                            :class="testimonial.avatarBg">
                            {{ testimonial.name.charAt(0) }}
                        </div>
                        <div>
                            <p class="text-sm font-bold text-secondary-900 dark:text-white">{{ testimonial.name }}</p>
                            <p class="text-xs text-secondary-400 dark:text-secondary-500">{{ testimonial.position }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="relative px-4 py-24 overflow-hidden">
            <div class="absolute inset-0 mx-4 bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl"></div>
            <div class="absolute inset-0 -z-0">
                <div class="absolute top-0 left-0 -translate-x-20 -translate-y-20 rounded-full w-72 h-72 bg-white/5">
                </div>
                <div class="absolute bottom-0 right-0 translate-x-20 translate-y-20 rounded-full w-72 h-72 bg-white/5">
                </div>
            </div>
            <div class="relative z-10 max-w-2xl mx-auto text-center">
                <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/20">
                    <Rocket class="w-8 h-8 text-white" />
                </div>
                <h2 class="mb-4 text-4xl font-extrabold text-white">
                    Siap Dapatkan Pekerjaan Impianmu?
                </h2>
                <p class="mb-8 text-lg text-primary-100">
                    Bergabung dengan ribuan pencari kerja yang sudah menggunakan AI Resume Builder.
                </p>
                <RouterLink to="/auth/register"
                    class="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-10 py-4 rounded-2xl hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5 text-base">
                    <Zap class="w-5 h-5" />
                    Mulai Gratis Sekarang
                </RouterLink>
                <p class="mt-4 text-sm text-primary-200">Tidak perlu kartu kredit</p>
            </div>
        </section>

    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import {
    Zap, LogIn, Rocket, Star, Sparkles, ShieldCheck, Lock,
    Bot, BarChart2, FileText, ClipboardList, Download, FilePen, Quote
} from 'lucide-vue-next'

const stats = [
    {
        value: '10.000+',
        label: 'Pengguna Aktif',
        icon: Bot,
        iconBg: 'bg-primary-100 dark:bg-primary-900',
        iconColor: 'text-primary-600 dark:text-primary-400'
    },
    {
        value: '50.000+',
        label: 'CV Dibuat',
        icon: FileText,
        iconBg: 'bg-green-100 dark:bg-green-900',
        iconColor: 'text-green-600 dark:text-green-400'
    },
    {
        value: '85%',
        label: 'Tingkat Keberhasilan Interview',
        icon: BarChart2,
        iconBg: 'bg-yellow-100 dark:bg-yellow-900',
        iconColor: 'text-yellow-600 dark:text-yellow-400'
    }
]

const features = [
    {
        icon: Bot,
        title: 'Penulisan dengan AI',
        description: 'AI kami menulis ulang bullet point dan ringkasan profesionalmu agar sesuai dengan setiap deskripsi pekerjaan secara otomatis.',
        iconBg: 'bg-primary-100 dark:bg-primary-900',
        iconColor: 'text-primary-600 dark:text-primary-400',
        bgAccent: 'bg-primary-500'
    },
    {
        icon: BarChart2,
        title: 'Skor Kecocokan',
        description: 'Lihat seberapa cocok CV kamu dengan lowongan yang dituju lengkap dengan breakdown skor per kategori.',
        iconBg: 'bg-green-100 dark:bg-green-900',
        iconColor: 'text-green-600 dark:text-green-400',
        bgAccent: 'bg-green-500'
    },
    {
        icon: FileText,
        title: 'Ekspor Ramah ATS',
        description: 'Ekspor CV sebagai PDF yang bersih dan ramah ATS sehingga lolos dari sistem pelacak pelamar.',
        iconBg: 'bg-purple-100 dark:bg-purple-900',
        iconColor: 'text-purple-600 dark:text-purple-400',
        bgAccent: 'bg-purple-500'
    }
]

const steps = [
    {
        icon: FilePen,
        title: 'Buat CV Dasar',
        description: 'Isi pengalaman kerja, pendidikan, dan keahlian kamu sekali saja.',
        bg: 'bg-primary-500'
    },
    {
        icon: ClipboardList,
        title: 'Tempel Deskripsi Kerja',
        description: 'Salin dan tempel deskripsi pekerjaan yang ingin kamu lamar.',
        bg: 'bg-blue-500'
    },
    {
        icon: Sparkles,
        title: 'Generate dengan AI',
        description: 'AI kami menyesuaikan CV kamu agar cocok dengan deskripsi pekerjaan.',
        bg: 'bg-violet-500'
    },
    {
        icon: Download,
        title: 'Ekspor dan Lamar',
        description: 'Unduh CV yang sudah disesuaikan dalam format PDF dan lamar dengan percaya diri.',
        bg: 'bg-green-500'
    }
]

const testimonials = [
    {
        name: 'Budi Santoso',
        position: 'Software Engineer di Tokopedia',
        message: 'Berkat AI Resume Builder, CV saya langsung disesuaikan dengan lowongan di Tokopedia. Seminggu kemudian saya dapat panggilan interview!',
        avatarBg: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
    },
    {
        name: 'Sari Dewi',
        position: 'Product Manager di Gojek',
        message: 'Saya tidak perlu lagi menghabiskan berjam-jam mengedit CV. Cukup paste deskripsi kerja dan AI langsung bekerja. Luar biasa!',
        avatarBg: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
    },
    {
        name: 'Andi Pratama',
        position: 'Data Analyst di Shopee',
        message: 'Fitur skor kecocokan sangat membantu. Saya bisa tahu seberapa relevan CV saya sebelum mengirim lamaran. Highly recommended!',
        avatarBg: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
    }
]
</script>