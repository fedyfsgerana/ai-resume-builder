<template>
    <div>
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-secondary-900">Create an account</h1>
            <p class="text-secondary-500 text-sm mt-1">Start building smarter resumes today</p>
        </div>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
            <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                <div class="relative">
                    <User class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
                    <input v-model="form.name" type="text" placeholder="John Doe" class="input pl-10" required />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Email</label>
                <div class="relative">
                    <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
                    <input v-model="form.email" type="email" placeholder="you@example.com" class="input pl-10"
                        required />
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Password</label>
                <div class="relative">
                    <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                        placeholder="Min. 8 characters" class="input pl-10 pr-10" required />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
                        <Eye v-if="!showPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Confirm Password</label>
                <div class="relative">
                    <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 w-4 h-4" />
                    <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="Repeat your password" class="input pl-10 pr-10" required />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
                        <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div v-if="passwordMismatch"
                class="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                <AlertCircle class="w-4 h-4 shrink-0" />
                <span>Passwords do not match</span>
            </div>

            <div v-if="error" class="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                <AlertCircle class="w-4 h-4 shrink-0" />
                <span>{{ error }}</span>
            </div>

            <div v-if="success" class="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-4 py-3 rounded-xl">
                <CheckCircle class="w-4 h-4 shrink-0" />
                <span>Registration successful! Please login.</span>
            </div>

            <button type="submit" class="btn-primary w-full py-2.5" :disabled="loading">
                <LoadingSpinner v-if="loading" size="sm" />
                <span v-else class="flex items-center justify-center gap-2">
                    <UserPlus class="w-4 h-4" />
                    Create Account
                </span>
            </button>
        </form>

        <p class="text-center text-sm text-secondary-500 mt-6">
            Already have an account?
            <RouterLink to="/auth/login" class="text-primary-600 font-medium hover:underline">
                Login
            </RouterLink>
        </p>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, UserPlus } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { register, loading, error } = useAuth()

const form = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const success = ref(false)

const passwordMismatch = computed(() =>
    form.value.confirmPassword.length > 0 &&
    form.value.password !== form.value.confirmPassword
)

const handleRegister = async () => {
    if (passwordMismatch.value) return

    await register({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password
    })

    success.value = true
}
</script>