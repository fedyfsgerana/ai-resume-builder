<template>
  <RouterView />
  <Toast />
  <ConfirmDialog />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'
import Toast from '@/components/Toast.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useDarkMode } from '@/composables/useDarkMode.js'

const authStore = useAuthStore()
const { init } = useDarkMode()

onMounted(async () => {
  init()
  await authStore.initAuth()
})
</script>