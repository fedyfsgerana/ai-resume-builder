<template>
    <div class="flex items-center justify-center min-h-screen px-4">
        <div class="text-center">
            <div class="flex justify-center mb-6">
                <div class="flex items-center justify-center w-24 h-24 rounded-full bg-primary-100">
                    <FileX class="w-12 h-12 text-primary-500" />
                </div>
            </div>

            <h1 class="mb-4 text-6xl font-bold text-primary-600">404</h1>
            <h2 class="mb-2 text-2xl font-semibold text-secondary-900">Halaman Tidak Ditemukan</h2>
            <p class="max-w-md mx-auto mb-8 text-secondary-500">
                Halaman yang kamu cari tidak ada atau sudah dipindahkan.
            </p>

            <div class="flex flex-wrap items-center justify-center gap-4">
                <RouterLink to="/" class="flex items-center gap-2 btn-primary">
                    <Home class="w-4 h-4" />
                    Kembali ke Beranda
                </RouterLink>
                <RouterLink to="/dashboard" class="flex items-center gap-2 btn-outline">
                    <LayoutDashboard class="w-4 h-4" />
                    Dasbor
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { FileX, Home, LayoutDashboard } from 'lucide-vue-next'
</script>