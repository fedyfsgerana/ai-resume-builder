<template>
    <div>
        <div class="mb-8">
            <h1 class="text-2xl font-extrabold tracking-tight text-secondary-900 dark:text-white">Buat Akun</h1>
            <p class="mt-1 text-sm text-secondary-500 dark:text-secondary-400">Mulai buat CV lebih cerdas hari ini</p>
        </div>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
            <div>
                <label
                    class="block mb-2 text-xs font-bold tracking-widest uppercase text-secondary-600 dark:text-secondary-400">Nama
                    Lengkap</label>
                <div class="relative">
                    <div
                        class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-secondary-100 dark:bg-secondary-700">
                        <User class="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
                    </div>
                    <input v-model="form.name" type="text" placeholder="Masukkan nama lengkap" class="input pl-14"
                        required />
                </div>
            </div>

            <div>
                <label
                    class="block mb-2 text-xs font-bold tracking-widest uppercase text-secondary-600 dark:text-secondary-400">Email</label>
                <div class="relative">
                    <div
                        class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-secondary-100 dark:bg-secondary-700">
                        <Mail class="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
                    </div>
                    <input v-model="form.email" type="email" placeholder="Masukkan email" class="input pl-14"
                        required />
                </div>
            </div>

            <div>
                <label
                    class="block mb-2 text-xs font-bold tracking-widest uppercase text-secondary-600 dark:text-secondary-400">Kata
                    Sandi</label>
                <div class="relative">
                    <div
                        class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-secondary-100 dark:bg-secondary-700">
                        <Lock class="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
                    </div>
                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                        placeholder="Minimal 8 karakter" class="pr-12 input pl-14" required />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute flex items-center justify-center w-8 h-8 transition-colors -translate-y-1/2 rounded-lg right-3 top-1/2 bg-secondary-100 dark:bg-secondary-700 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                        <Eye v-if="!showPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div>
                <label
                    class="block mb-2 text-xs font-bold tracking-widest uppercase text-secondary-600 dark:text-secondary-400">Konfirmasi
                    Kata Sandi</label>
                <div class="relative">
                    <div class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-secondary-100 dark:bg-secondary-700"
                        :class="passwordMismatch ? 'bg-red-50 dark:bg-red-900/30' : ''">
                        <ShieldCheck class="w-4 h-4"
                            :class="passwordMismatch ? 'text-red-400' : 'text-secondary-500 dark:text-secondary-400'" />
                    </div>
                    <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="Ulangi kata sandi" class="pr-12 input pl-14"
                        :class="passwordMismatch ? 'border-red-300 dark:border-red-700 focus:ring-red-400' : ''"
                        required />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute flex items-center justify-center w-8 h-8 transition-colors -translate-y-1/2 rounded-lg right-3 top-1/2 bg-secondary-100 dark:bg-secondary-700 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                        <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
                <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle class="w-3 h-3" />
                    Kata sandi tidak cocok
                </p>
            </div>

            <button type="submit"
                class="btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all mt-2"
                :disabled="loading || passwordMismatch">
                <LoadingSpinner v-if="loading" size="sm" />
                <span v-else class="flex items-center gap-2 font-bold">
                    <UserPlus class="w-4 h-4" />
                    Daftar Sekarang
                </span>
            </button>
        </form>

        <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-secondary-200 dark:border-secondary-700"></div>
            </div>
            <div class="relative flex justify-center text-xs">
                <span
                    class="px-3 font-medium bg-white dark:bg-secondary-800 text-secondary-400 dark:text-secondary-500">atau</span>
            </div>
        </div>

        <p class="text-sm text-center text-secondary-500 dark:text-secondary-400">
            Sudah punya akun?
            <RouterLink to="/auth/login" class="ml-1 font-bold text-primary-600 dark:text-primary-400 hover:underline">
                Masuk
            </RouterLink>
        </p>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ShieldCheck, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth.js'
import { useToast } from '@/composables/useToast.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { register, loading } = useAuth()
const { success, error, warning } = useToast()

const form = ref({ name: '', email: '', password: '', confirmPassword: '' })
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordMismatch = computed(() =>
    form.value.confirmPassword.length > 0 &&
    form.value.password !== form.value.confirmPassword
)

const handleRegister = async () => {
    if (passwordMismatch.value) {
        warning('Kata sandi tidak cocok')
        return
    }
    if (form.value.password.length < 8) {
        warning('Kata sandi minimal 8 karakter')
        return
    }
    try {
        await register({
            name: form.value.name,
            email: form.value.email,
            password: form.value.password
        })
        success('Akun berhasil dibuat, silakan masuk')
    } catch {
        error('Gagal membuat akun, email mungkin sudah terdaftar')
    }
}
</script>