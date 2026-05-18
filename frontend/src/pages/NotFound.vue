<template>
    <div class="min-h-[70vh] flex items-center justify-center px-4">
        <div class="max-w-md text-center">
            <div class="relative mb-8">
                <div class="font-black leading-none select-none text-9xl text-slate-100 dark:text-slate-800">404</div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div
                        class="flex items-center justify-center w-20 h-20 shadow-lg rounded-3xl bg-primary-100 dark:bg-primary-900/40">
                        <FileX class="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>
                </div>
            </div>

            <h1 class="mb-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Halaman Tidak Ditemukan
            </h1>
            <p class="mb-8 leading-relaxed text-slate-500 dark:text-slate-400">
                Halaman yang kamu cari tidak ada atau sudah dipindahkan.
                Kembali ke beranda dan coba lagi.
            </p>

            <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <RouterLink to="/" class="btn-primary px-6 py-2.5 w-full sm:w-auto justify-center">
                    <Home class="w-4 h-4" />
                    Kembali ke Beranda
                </RouterLink>
                <RouterLink to="/dashboard" class="btn-secondary px-6 py-2.5 w-full sm:w-auto justify-center">
                    <LayoutDashboard class="w-4 h-4" />
                    Ke Dasbor
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { FileX, Home, LayoutDashboard } from 'lucide-vue-next'
</script>