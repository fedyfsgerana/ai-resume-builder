<template>
    <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-8">
            <RouterLink to="/dashboard"
                class="transition-colors text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                <ArrowLeft class="w-5 h-5" />
            </RouterLink>
            <div>
                <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Profil Saya</h1>
                <p class="mt-1 text-sm text-secondary-500 dark:text-secondary-400">Kelola informasi akun kamu</p>
            </div>
        </div>

        <!-- Avatar & Info -->
        <div class="mb-6 card">
            <div class="flex items-center gap-5">
                <div
                    class="flex items-center justify-center w-16 h-16 text-2xl font-bold rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 shrink-0">
                    {{ userInitial }}
                </div>
                <div>
                    <p class="text-lg font-bold text-secondary-900 dark:text-secondary-100">{{ user?.name }}</p>
                    <p class="text-sm text-secondary-500 dark:text-secondary-400">{{ user?.email }}</p>
                    <span class="mt-1 badge badge-info">{{ tierLabel }}</span>
                </div>
            </div>
        </div>

        <!-- Update Profile -->
        <div class="mb-6 card">
            <div class="flex items-center gap-2 mb-6">
                <UserCircle class="w-5 h-5 text-primary-600" />
                <h2 class="font-semibold text-secondary-900 dark:text-secondary-100">Informasi Profil</h2>
            </div>

            <form @submit.prevent="handleUpdateProfile" class="flex flex-col gap-4">
                <div>
                    <label class="block mb-1 text-sm font-medium text-secondary-700 dark:text-secondary-300">Nama
                        Lengkap</label>
                    <div class="relative">
                        <User class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                        <input v-model="profileForm.name" type="text" placeholder="Masukkan nama lengkap"
                            class="pl-10 input" required />
                    </div>
                </div>

                <div>
                    <label
                        class="block mb-1 text-sm font-medium text-secondary-700 dark:text-secondary-300">Email</label>
                    <div class="relative">
                        <Mail class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                        <input v-model="profileForm.email" type="email" placeholder="Masukkan email" class="pl-10 input"
                            required />
                    </div>
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium text-secondary-700 dark:text-secondary-300">Bergabung
                        Sejak</label>
                    <div class="relative">
                        <Calendar class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                        <input :value="formatDate(user?.createdAt)" type="text"
                            class="pl-10 cursor-not-allowed input bg-secondary-50 dark:bg-secondary-700" disabled />
                    </div>
                </div>

                <div class="flex justify-end">
                    <button type="submit" class="flex items-center gap-2 btn-primary" :disabled="profileLoading">
                        <LoadingSpinner v-if="profileLoading" size="sm" />
                        <span v-else class="flex items-center gap-2">
                            <Save class="w-4 h-4" />
                            Simpan Perubahan
                        </span>
                    </button>
                </div>
            </form>
        </div>

        <!-- Update Password -->
        <div class="card">
            <div class="flex items-center gap-2 mb-6">
                <Lock class="w-5 h-5 text-primary-600" />
                <h2 class="font-semibold text-secondary-900 dark:text-secondary-100">Ganti Kata Sandi</h2>
            </div>

            <form @submit.prevent="handleUpdatePassword" class="flex flex-col gap-4">
                <div>
                    <label class="block mb-1 text-sm font-medium text-secondary-700 dark:text-secondary-300">Kata Sandi
                        Lama</label>
                    <div class="relative">
                        <Lock class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                        <input v-model="passwordForm.currentPassword" :type="showCurrentPassword ? 'text' : 'password'"
                            placeholder="Masukkan kata sandi lama" class="pl-10 pr-10 input" required />
                        <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                            class="absolute -translate-y-1/2 right-3 top-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                            <Eye v-if="!showCurrentPassword" class="w-4 h-4" />
                            <EyeOff v-else class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium text-secondary-700 dark:text-secondary-300">Kata Sandi
                        Baru</label>
                    <div class="relative">
                        <Lock class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                        <input v-model="passwordForm.newPassword" :type="showNewPassword ? 'text' : 'password'"
                            placeholder="Minimal 8 karakter" class="pl-10 pr-10 input" required />
                        <button type="button" @click="showNewPassword = !showNewPassword"
                            class="absolute -translate-y-1/2 right-3 top-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                            <Eye v-if="!showNewPassword" class="w-4 h-4" />
                            <EyeOff v-else class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium text-secondary-700 dark:text-secondary-300">Konfirmasi
                        Kata Sandi Baru</label>
                    <div class="relative">
                        <Lock class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-secondary-400" />
                        <input v-model="passwordForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                            placeholder="Ulangi kata sandi baru" class="pl-10 pr-10 input" required />
                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute -translate-y-1/2 right-3 top-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                            <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                            <EyeOff v-else class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button type="submit" class="flex items-center gap-2 btn-primary" :disabled="passwordLoading">
                        <LoadingSpinner v-if="passwordLoading" size="sm" />
                        <span v-else class="flex items-center gap-2">
                            <ShieldCheck class="w-4 h-4" />
                            Perbarui Kata Sandi
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Save, ShieldCheck, UserCircle, Calendar } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from '@/composables/useToast.js'
import { storeToRefs } from 'pinia'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { success, error, warning } = useToast()

const profileLoading = ref(false)
const passwordLoading = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const profileForm = ref({ name: '', email: '' })
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })

const userInitial = computed(() => user.value?.name?.charAt(0).toUpperCase() || 'U')
const tierLabel = computed(() => ({ FREE: 'Gratis', PRO: 'Pro', BUSINESS: 'Bisnis' }[user.value?.tier] || 'Gratis'))

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const handleUpdateProfile = async () => {
    profileLoading.value = true
    try {
        await authStore.updateProfile(profileForm.value)
        success('Profil berhasil diperbarui')
    } catch {
        error('Gagal memperbarui profil, coba lagi')
    } finally {
        profileLoading.value = false
    }
}

const handleUpdatePassword = async () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        warning('Kata sandi baru tidak cocok')
        return
    }
    if (passwordForm.value.newPassword.length < 8) {
        warning('Kata sandi baru minimal 8 karakter')
        return
    }
    passwordLoading.value = true
    try {
        await authStore.updatePassword({
            currentPassword: passwordForm.value.currentPassword,
            newPassword: passwordForm.value.newPassword
        })
        success('Kata sandi berhasil diperbarui')
        passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    } catch {
        error('Gagal memperbarui kata sandi, coba lagi')
    } finally {
        passwordLoading.value = false
    }
}

onMounted(() => {
    if (user.value) {
        profileForm.value = { name: user.value.name || '', email: user.value.email || '' }
    }
})
</script>