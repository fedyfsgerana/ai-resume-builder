<template>
    <div>
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-secondary-900">Welcome back</h1>
            <p class="text-secondary-500 text-sm mt-1">Login to your account to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
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
                        placeholder="Enter your password" class="input pl-10 pr-10" required />
                    <button type="button" @click="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
                        <Eye v-if="!showPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div v-if="error" class="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                <AlertCircle class="w-4 h-4 shrink-0" />
                <span>{{ error }}</span>
            </div>

            <button type="submit" class="btn-primary w-full py-2.5" :disabled="loading">
                <LoadingSpinner v-if="loading" size="sm" />
                <span v-else>Login</span>
            </button>
        </form>

        <p class="text-center text-sm text-secondary-500 mt-6">
            Don't have an account?
            <RouterLink to="/auth/register" class="text-primary-600 font-medium hover:underline">
                Register
            </RouterLink>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { login, loading, error } = useAuth()

const form = ref({
    email: '',
    password: ''
})

const showPassword = ref(false)

const handleLogin = async () => {
    await login(form.value)
}
</script>