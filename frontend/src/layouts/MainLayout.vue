<template>
    <div class="min-h-screen flex flex-col bg-secondary-50">
        <Navbar />
        <main class="flex-1 container mx-auto px-4 py-8 max-w-7xl">
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