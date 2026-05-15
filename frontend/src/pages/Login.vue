<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-extrabold tracking-tight text-secondary-900 dark:text-white">Selamat Datang</h1>
      <p class="mt-1 text-sm text-secondary-500 dark:text-secondary-400">Masuk ke akun kamu untuk melanjutkan</p>
    </div>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
      <div>
        <label class="block mb-2 text-xs font-bold tracking-widest uppercase text-secondary-600 dark:text-secondary-400">Email</label>
        <div class="relative">
          <div class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-secondary-100 dark:bg-secondary-700">
            <Mail class="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
          </div>
          <input
            v-model="form.email"
            type="email"
            placeholder="Masukkan email"
            class="input pl-14"
            required
          />
        </div>
      </div>

      <div>
        <label class="block mb-2 text-xs font-bold tracking-widest uppercase text-secondary-600 dark:text-secondary-400">Kata Sandi</label>
        <div class="relative">
          <div class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-secondary-100 dark:bg-secondary-700">
            <Lock class="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
          </div>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Masukkan kata sandi"
            class="pr-12 input pl-14"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute flex items-center justify-center w-8 h-8 transition-colors -translate-y-1/2 rounded-lg right-3 top-1/2 bg-secondary-100 dark:bg-secondary-700 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200"
          >
            <Eye v-if="!showPassword" class="w-4 h-4" />
            <EyeOff v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all mt-2"
        :disabled="loading"
      >
        <LoadingSpinner v-if="loading" size="sm" />
        <span v-else class="flex items-center gap-2 font-bold">
          <LogIn class="w-4 h-4" />
          Masuk
        </span>
      </button>
    </form>

    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-secondary-200 dark:border-secondary-700"></div>
      </div>
      <div class="relative flex justify-center text-xs">
        <span class="px-3 font-medium bg-white dark:bg-secondary-800 text-secondary-400 dark:text-secondary-500">atau</span>
      </div>
    </div>

    <p class="text-sm text-center text-secondary-500 dark:text-secondary-400">
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
    success('Berhasil masuk, selamat datang kembali')
  } catch {
    error('Email atau kata sandi salah')
  }
}
</script>