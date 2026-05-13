<template>
    <div>
        <!-- Hero Section -->
        <section class="py-20 text-center">
            <div class="max-w-3xl mx-auto">
                <span class="mb-4 badge badge-info">AI Resume Builder</span>
                <h1 class="mb-6 text-5xl font-bold leading-tight text-secondary-900 dark:text-secondary-100">
                    Buat CV yang
                    <span class="text-primary-600"> Langsung Dilirik HRD</span>
                </h1>
                <p class="mb-10 text-xl leading-relaxed text-secondary-500 dark:text-secondary-400">
                    Biarkan AI menyesuaikan CV kamu dengan setiap lowongan secara otomatis.
                    Dapatkan skor kecocokan lebih tinggi dan lebih banyak panggilan interview.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-4">
                    <RouterLink to="/auth/register" class="flex items-center gap-2 px-8 py-3 text-base btn-primary">
                        <Zap class="w-4 h-4" />
                        Mulai Gratis
                    </RouterLink>
                    <RouterLink to="/auth/login" class="flex items-center gap-2 px-8 py-3 text-base btn-outline">
                        <LogIn class="w-4 h-4" />
                        Masuk
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="py-10">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div v-for="stat in stats" :key="stat.label" class="text-center card">
                    <p class="mb-1 text-4xl font-bold text-primary-600">{{ stat.value }}</p>
                    <p class="text-sm text-secondary-500 dark:text-secondary-400">{{ stat.label }}</p>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-16">
            <div class="mb-12 text-center">
                <h2 class="mb-4 text-3xl font-bold text-secondary-900 dark:text-secondary-100">Kenapa Pakai AI Resume
                    Builder?</h2>
                <p class="max-w-xl mx-auto text-secondary-500 dark:text-secondary-400">
                    Berhenti buang waktu berjam-jam mengedit CV secara manual untuk setiap lamaran.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div v-for="feature in features" :key="feature.title"
                    class="text-center transition-shadow card group hover:shadow-modal">
                    <div
                        class="flex items-center justify-center w-12 h-12 mx-auto mb-4 transition-colors rounded-xl bg-primary-100 dark:bg-primary-900 group-hover:bg-primary-200 dark:group-hover:bg-primary-800">
                        <component :is="feature.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 class="mb-2 text-lg font-semibold text-secondary-900 dark:text-secondary-100">{{ feature.title
                        }}</h3>
                    <p class="text-sm leading-relaxed text-secondary-500 dark:text-secondary-400">{{ feature.description
                        }}</p>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section class="px-8 py-16 bg-white dark:bg-secondary-800 rounded-2xl">
            <div class="mb-12 text-center">
                <h2 class="mb-4 text-3xl font-bold text-secondary-900 dark:text-secondary-100">Cara Kerjanya</h2>
                <p class="text-secondary-500 dark:text-secondary-400">Dapatkan CV yang disesuaikan dalam hitungan menit
                </p>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div v-for="(step, index) in steps" :key="step.title" class="text-center">
                    <div
                        class="flex items-center justify-center w-10 h-10 mx-auto mb-4 text-sm font-bold text-white rounded-full bg-primary-600">
                        {{ index + 1 }}
                    </div>
                    <div class="flex justify-center mb-3">
                        <div
                            class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900">
                            <component :is="step.icon" class="w-5 h-5 text-primary-500 dark:text-primary-400" />
                        </div>
                    </div>
                    <h3 class="mb-2 font-semibold text-secondary-900 dark:text-secondary-100">{{ step.title }}</h3>
                    <p class="text-sm text-secondary-500 dark:text-secondary-400">{{ step.description }}</p>
                </div>
            </div>
        </section>

        <!-- Testimonial Section -->
        <section class="py-16">
            <div class="mb-12 text-center">
                <h2 class="mb-4 text-3xl font-bold text-secondary-900 dark:text-secondary-100">Kata Mereka</h2>
                <p class="text-secondary-500 dark:text-secondary-400">Ribuan pencari kerja sudah merasakan manfaatnya
                </p>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div v-for="testimonial in testimonials" :key="testimonial.name"
                    class="transition-shadow card hover:shadow-modal">
                    <div class="flex items-center gap-3 mb-4">
                        <div
                            class="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                            {{ testimonial.name.charAt(0) }}
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-secondary-900 dark:text-secondary-100">{{
                                testimonial.name }}</p>
                            <p class="text-xs text-secondary-400 dark:text-secondary-500">{{ testimonial.position }}</p>
                        </div>
                    </div>
                    <div class="flex gap-0.5 mb-3">
                        <Star v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <p class="text-sm leading-relaxed text-secondary-600 dark:text-secondary-400">{{ testimonial.message
                        }}</p>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="px-8 py-20 text-center bg-primary-600 rounded-2xl">
            <div class="max-w-2xl mx-auto">
                <h2 class="mb-4 text-3xl font-bold text-white">Siap Dapatkan Pekerjaan Impianmu?</h2>
                <p class="mb-8 text-primary-100">
                    Bergabung dengan ribuan pencari kerja yang sudah menggunakan AI Resume Builder.
                </p>
                <RouterLink to="/auth/register"
                    class="inline-flex items-center gap-2 px-10 py-3 font-semibold transition-colors bg-white text-primary-600 rounded-xl hover:bg-primary-50">
                    <Rocket class="w-4 h-4" />
                    Mulai Gratis Sekarang
                </RouterLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Bot, BarChart2, FileText, Zap, LogIn, Rocket, ClipboardList, Sparkles, Download, FilePen, Star } from 'lucide-vue-next'

const stats = [
    { value: '10.000+', label: 'Pengguna Aktif' },
    { value: '50.000+', label: 'CV Dibuat' },
    { value: '85%', label: 'Tingkat Keberhasilan Interview' }
]

const features = [
    {
        icon: Bot,
        title: 'Penulisan dengan AI',
        description: 'AI kami menulis ulang bullet point dan ringkasan profesionalmu agar sesuai dengan setiap deskripsi pekerjaan secara otomatis.'
    },
    {
        icon: BarChart2,
        title: 'Skor Kecocokan',
        description: 'Lihat seberapa cocok CV kamu dengan lowongan yang dituju lengkap dengan breakdown skor per kategori.'
    },
    {
        icon: FileText,
        title: 'Ekspor Ramah ATS',
        description: 'Ekspor CV sebagai PDF yang bersih dan ramah ATS sehingga lolos dari sistem pelacak pelamar.'
    }
]

const steps = [
    { icon: FilePen, title: 'Buat CV Dasar', description: 'Isi pengalaman kerja, pendidikan, dan keahlian kamu sekali saja.' },
    { icon: ClipboardList, title: 'Tempel Deskripsi Kerja', description: 'Salin dan tempel deskripsi pekerjaan yang ingin kamu lamar.' },
    { icon: Sparkles, title: 'Generate dengan AI', description: 'AI kami menyesuaikan CV kamu agar cocok dengan deskripsi pekerjaan.' },
    { icon: Download, title: 'Ekspor dan Lamar', description: 'Unduh CV yang sudah disesuaikan dalam format PDF dan lamar dengan percaya diri.' }
]

const testimonials = [
    {
        name: 'Budi Santoso',
        position: 'Software Engineer di Tokopedia',
        message: 'Berkat AI Resume Builder, CV saya langsung disesuaikan dengan lowongan di Tokopedia. Seminggu kemudian saya dapat panggilan interview!'
    },
    {
        name: 'Sari Dewi',
        position: 'Product Manager di Gojek',
        message: 'Saya tidak perlu lagi menghabiskan berjam-jam mengedit CV. Cukup paste deskripsi kerja dan AI langsung bekerja. Luar biasa!'
    },
    {
        name: 'Andi Pratama',
        position: 'Data Analyst di Shopee',
        message: 'Fitur skor kecocokan sangat membantu. Saya bisa tahu seberapa relevan CV saya sebelum mengirim lamaran. Highly recommended!'
    }
]
</script>