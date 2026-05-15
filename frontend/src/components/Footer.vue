<template>
    <footer class="mt-auto bg-white border-t dark:bg-secondary-900 border-secondary-100 dark:border-secondary-800">
        <div class="container px-4 py-8 mx-auto max-w-7xl">
            <div class="flex flex-col items-center justify-between gap-6 md:flex-row">

                <div class="flex flex-col items-center md:items-start gap-1.5">
                    <RouterLink to="/" class="flex items-center gap-2.5 group">
                        <div
                            class="flex items-center justify-center transition-transform shadow-md w-9 h-9 rounded-xl bg-primary-600 group-hover:scale-105 shadow-primary-500/25">
                            <span class="text-sm font-extrabold text-white">AI</span>
                        </div>
                        <span class="text-lg font-extrabold tracking-tight text-secondary-900 dark:text-white">
                            AI <span class="text-primary-600">Resume</span> Builder
                        </span>
                    </RouterLink>
                    <p class="text-xs text-secondary-400 dark:text-secondary-500">
                        Buat CV lebih cerdas dengan kekuatan AI
                    </p>
                </div>

                <p class="order-last text-sm text-secondary-400 dark:text-secondary-500 md:order-none">
                    &copy; {{ currentYear }} AI Resume Builder. All rights reserved.
                </p>

                <div class="flex items-center gap-1">
                    <a href="#"
                        class="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium px-3 py-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all">
                        <ShieldCheck class="w-3.5 h-3.5" />
                        Privasi
                    </a>
                    <a href="#"
                        class="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium px-3 py-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all">
                        <ScrollText class="w-3.5 h-3.5" />
                        Syarat
                    </a>
                    <a href="#"
                        class="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium px-3 py-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all">
                        <Mail class="w-3.5 h-3.5" />
                        Kontak
                    </a>
                    <span class="ml-2 text-xs text-secondary-200 dark:text-secondary-700">v{{ version }}</span>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ShieldCheck, ScrollText, Mail } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())
const version = import.meta.env.VITE_APP_VERSION || '1.0.0'
</script>