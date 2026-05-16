<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Selamat Datang</h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm mt-1.5">Masuk ke akun kamu untuk melanjutkan</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label
          class="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">Email</label>
        <div class="relative">
          <div
            class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-slate-100 dark:bg-slate-800">
            <Mail class="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <input v-model="form.email" type="email" placeholder="nama@email.com" class="input pl-14" required />
        </div>
      </div>

      <div>
        <label class="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">Kata
          Sandi</label>
        <div class="relative">
          <div
            class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-slate-100 dark:bg-slate-800">
            <Lock class="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Masukkan kata sandi"
            class="pr-12 input pl-14" required />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute flex items-center justify-center w-8 h-8 transition-colors -translate-y-1/2 rounded-lg right-3 top-1/2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <Eye v-if="!showPassword" class="w-4 h-4" />
            <EyeOff v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <button type="submit" :disabled="loading" class="btn-primary w-full py-3.5 text-base justify-center mt-2">
        <LoadingSpinner v-if="loading" size="sm" />
        <span v-else class="flex items-center gap-2">
          <LogIn class="w-5 h-5" />
          Masuk
        </span>
      </button>
    </form>

    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="px-3 text-xs font-medium bg-white dark:bg-slate-900 text-slate-400">atau</span>
      </div>
    </div>

    <p class="text-sm text-center text-slate-500 dark:text-slate-400">
      Belum punya akun?
      <RouterLink to="/auth/register" class="ml-1 font-bold text-primary-600 dark:text-primary-400 hover:underline">
        Daftar Sekarang
      </RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth.js'
import { useToast } from '@/composables/useToast.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { login, loading } = useAuth()
const { success, error } = useToast()
const form = ref({ email: '', password: '' })
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    await login(form.value)
    success('Berhasil masuk!')
  } catch {
    error('Email atau kata sandi salah')
  }
}
</script>