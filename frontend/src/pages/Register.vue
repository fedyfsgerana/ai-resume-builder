<template>
    <div>
        <div class="mb-8">
            <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Buat Akun</h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1.5">Mulai buat CV lebih cerdas hari ini</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
            <div>
                <label
                    class="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">Nama
                    Lengkap</label>
                <div class="relative">
                    <div
                        class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-slate-100 dark:bg-slate-800">
                        <User class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <input v-model="form.name" type="text" placeholder="Nama lengkap kamu" class="input pl-14"
                        required />
                </div>
            </div>

            <div>
                <label
                    class="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">Email</label>
                <div class="relative">
                    <div
                        class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-slate-100 dark:bg-slate-800">
                        <Mail class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <input v-model="form.email" type="email" placeholder="nama@email.com" class="input pl-14"
                        required />
                </div>
            </div>

            <div>
                <label
                    class="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">Kata
                    Sandi</label>
                <div class="relative">
                    <div
                        class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-slate-100 dark:bg-slate-800">
                        <Lock class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                        placeholder="Minimal 8 karakter" class="pr-12 input pl-14" required />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute flex items-center justify-center w-8 h-8 transition-colors -translate-y-1/2 rounded-lg right-3 top-1/2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600">
                        <Eye v-if="!showPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div>
                <label
                    class="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">Konfirmasi
                    Kata Sandi</label>
                <div class="relative">
                    <div class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2"
                        :class="passwordMismatch ? 'bg-red-50 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-800'">
                        <ShieldCheck class="w-4 h-4"
                            :class="passwordMismatch ? 'text-red-400' : 'text-slate-500 dark:text-slate-400'" />
                    </div>
                    <input v-model="form.confirmPassword" :type="showConfirm ? 'text' : 'password'"
                        placeholder="Ulangi kata sandi" class="pr-12 input pl-14"
                        :class="passwordMismatch ? 'border-red-300 dark:border-red-700 focus:ring-red-400' : ''"
                        required />
                    <button type="button" @click="showConfirm = !showConfirm"
                        class="absolute flex items-center justify-center w-8 h-8 transition-colors -translate-y-1/2 rounded-lg right-3 top-1/2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600">
                        <Eye v-if="!showConfirm" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
                <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1.5 flex items-center gap-1.5">
                    <AlertCircle class="w-3.5 h-3.5" />
                    Kata sandi tidak cocok
                </p>
            </div>

            <button type="submit" :disabled="loading || passwordMismatch"
                class="btn-primary w-full py-3.5 text-base justify-center mt-2">
                <LoadingSpinner v-if="loading" size="sm" />
                <span v-else class="flex items-center gap-2">
                    <UserPlus class="w-5 h-5" />
                    Daftar Sekarang
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
const showConfirm = ref(false)

const passwordMismatch = computed(() =>
    form.value.confirmPassword.length > 0 && form.value.password !== form.value.confirmPassword
)

const handleRegister = async () => {
    if (passwordMismatch.value) { warning('Kata sandi tidak cocok'); return }
    if (form.value.password.length < 8) { warning('Kata sandi minimal 8 karakter'); return }
    try {
        await register({ name: form.value.name, email: form.value.email, password: form.value.password })
        success('Akun berhasil dibuat, silakan masuk')
    } catch {
        error('Gagal membuat akun, email mungkin sudah terdaftar')
    }
}
</script>