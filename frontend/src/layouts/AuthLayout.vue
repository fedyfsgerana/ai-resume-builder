<template>
    <div class="flex items-center justify-center min-h-screen px-4 bg-secondary-50">
        <div class="w-full max-w-md">
            <div class="mb-8 text-center">
                <RouterLink to="/" class="inline-flex items-center justify-center">
                    <img src="/logo-full.svg" alt="AI Resume Builder" class="w-auto h-16" />
                </RouterLink>
                <p class="mt-2 text-sm text-secondary-500">Build smarter resumes with AI</p>
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