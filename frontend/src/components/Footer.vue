<template>
    <footer class="mt-auto bg-white border-t border-secondary-200">
        <div class="container px-4 py-6 mx-auto max-w-7xl">
            <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div class="flex items-center gap-2">
                    <img src="/logo.svg" alt="AI Resume Builder" class="w-6 h-6" />
                    <span class="text-lg font-bold text-primary-600">AI Resume Builder</span>
                    <span class="text-sm text-secondary-400">v{{ version }}</span>
                </div>

                <p class="text-sm text-secondary-500">
                    &copy; {{ currentYear }} AI Resume Builder. All rights reserved.
                </p>

                <div class="flex items-center gap-6">
                    <a href="#"
                        class="flex items-center gap-1.5 text-secondary-500 hover:text-primary-600 text-sm transition-colors">
                        <ShieldCheck class="w-4 h-4" />
                        Privacy Policy
                    </a>
                    <a href="#"
                        class="flex items-center gap-1.5 text-secondary-500 hover:text-primary-600 text-sm transition-colors">
                        <ScrollText class="w-4 h-4" />
                        Terms of Service
                    </a>
                    <a href="#"
                        class="flex items-center gap-1.5 text-secondary-500 hover:text-primary-600 text-sm transition-colors">
                        <Mail class="w-4 h-4" />
                        Contact
                    </a>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue'
import { FileText, ShieldCheck, ScrollText, Mail } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())
const version = import.meta.env.VITE_APP_VERSION || '1.0.0'
</script>