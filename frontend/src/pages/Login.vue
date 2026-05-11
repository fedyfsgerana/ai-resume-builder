<template>
    <div>
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-secondary-900">Selamat Datang</h1>
            <p class="mt-1 text-sm text-secondary-500">Masuk ke akun kamu untuk melanjutkan</p>
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
            <div>
                <label class="block mb-1 text-sm font-medium text-secondary-700">Email</label>
                <div class="relative">
                    <Mail class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                    <input v-model="form.email" type="email" placeholder="Masukkan email" class="pl-10 input"
                        required />
                </div>
            </div>

            <div>
                <label class="block mb-1 text-sm font-medium text-secondary-700">Kata Sandi</label>
                <div class="relative">
                    <Lock class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                        placeholder="Masukkan kata sandi" class="pl-10 pr-10 input" required />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute -translate-y-1/2 right-3 top-1/2 text-secondary-400 hover:text-secondary-600">
                        <Eye v-if="!showPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <button type="submit" class="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
                :disabled="loading">
                <LoadingSpinner v-if="loading" size="sm" />
                <span v-else class="flex items-center gap-2">
                    <LogIn class="w-4 h-4" />
                    Masuk
                </span>
            </button>
        </form>

        <p class="mt-6 text-sm text-center text-secondary-500">
            Belum punya akun?
            <RouterLink to="/auth/register" class="font-medium text-primary-600 hover:underline">
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

const form = ref({
    email: '',
    password: ''
})

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