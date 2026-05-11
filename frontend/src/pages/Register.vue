<template>
    <div>
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-secondary-900">Buat Akun</h1>
            <p class="mt-1 text-sm text-secondary-500">Mulai buat CV lebih cerdas hari ini</p>
        </div>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
            <div>
                <label class="block mb-1 text-sm font-medium text-secondary-700">Nama Lengkap</label>
                <div class="relative">
                    <User class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                    <input v-model="form.name" type="text" placeholder="Masukkan nama lengkap" class="pl-10 input"
                        required />
                </div>
            </div>

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
                        placeholder="Minimal 8 karakter" class="pl-10 pr-10 input" required />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute -translate-y-1/2 right-3 top-1/2 text-secondary-400 hover:text-secondary-600">
                        <Eye v-if="!showPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div>
                <label class="block mb-1 text-sm font-medium text-secondary-700">Konfirmasi Kata Sandi</label>
                <div class="relative">
                    <Lock class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                    <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="Ulangi kata sandi" class="pl-10 pr-10 input" required />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute -translate-y-1/2 right-3 top-1/2 text-secondary-400 hover:text-secondary-600">
                        <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <button type="submit" class="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
                :disabled="loading">
                <LoadingSpinner v-if="loading" size="sm" />
                <span v-else class="flex items-center gap-2">
                    <UserPlus class="w-4 h-4" />
                    Daftar Sekarang
                </span>
            </button>
        </form>

        <p class="mt-6 text-sm text-center text-secondary-500">
            Sudah punya akun?
            <RouterLink to="/auth/login" class="font-medium text-primary-600 hover:underline">
                Masuk
            </RouterLink>
        </p>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth.js'
import { useToast } from '@/composables/useToast.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { register, loading } = useAuth()
const { success, error, warning } = useToast()

const form = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

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