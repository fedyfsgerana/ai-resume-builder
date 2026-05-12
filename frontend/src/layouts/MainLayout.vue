<template>
    <div class="flex flex-col min-h-screen bg-secondary-50 dark:bg-secondary-900">
        <Navbar />
        <main class="container flex-1 px-4 py-8 mx-auto max-w-7xl">
            <RouterView />
        </main>
        <Footer />
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>