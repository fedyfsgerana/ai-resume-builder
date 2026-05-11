<template>
    <footer class="bg-white border-t border-secondary-200 mt-auto">
        <div class="container mx-auto px-4 max-w-7xl py-6">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <FileText class="w-5 h-5 text-primary-600" />
                    <span class="text-lg font-bold text-primary-600">AI Resume Builder</span>
                    <span class="text-secondary-400 text-sm">v{{ version }}</span>
                </div>

                <p class="text-secondary-500 text-sm">
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