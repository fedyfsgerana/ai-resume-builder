<template>
    <footer class="bg-white border-t dark:bg-slate-950 border-slate-100 dark:border-slate-800">
        <div class="container px-4 py-8 mx-auto sm:px-6 max-w-7xl">
            <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <RouterLink to="/" class="flex items-center gap-2.5 group">
                    <div
                        class="flex items-center justify-center w-8 h-8 transition-transform shadow-sm rounded-xl bg-primary-600 group-hover:scale-105">
                        <span class="text-xs font-black text-white">AI</span>
                    </div>
                    <span class="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                        AI<span class="text-primary-600">Resume</span>Builder
                    </span>
                </RouterLink>

                <p class="text-xs text-slate-400 dark:text-slate-500">
                    &copy; {{ currentYear }} AIResumeBuilder. All rights reserved.
                </p>

                <div class="flex items-center gap-1">
                    <a v-for="link in links" :key="link.label" href="#"
                        class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs font-medium px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                        <component :is="link.icon" class="w-3.5 h-3.5" />
                        {{ link.label }}
                    </a>
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
const links = [
    { label: 'Privasi', icon: ShieldCheck },
    { label: 'Syarat', icon: ScrollText },
    { label: 'Kontak', icon: Mail }
]
</script>