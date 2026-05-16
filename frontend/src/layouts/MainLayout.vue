<template>
  <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
    <Navbar />
    <main class="container flex-1 w-full px-4 py-8 mx-auto sm:px-6 max-w-7xl">
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