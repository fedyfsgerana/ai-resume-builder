<template>
    <div class="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <RouterLink to="/" class="inline-flex items-center gap-2">
                    <span class="text-2xl font-bold text-primary-600">AI Resume Builder</span>
                </RouterLink>
                <p class="text-secondary-500 mt-2 text-sm">Build smarter resumes with AI</p>
            </div>
            <div class="card">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>