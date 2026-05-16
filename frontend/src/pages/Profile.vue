<template>
    <div class="max-w-2xl mx-auto space-y-6">

        <!-- Header -->
        <div class="flex items-center gap-3">
            <RouterLink to="/dashboard"
                class="flex items-center justify-center transition-all w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                <ArrowLeft class="w-4 h-4" />
            </RouterLink>
            <div>
                <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Profil Saya</h1>
                <p class="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Kelola informasi akun kamu</p>
            </div>
        </div>

        <!-- Avatar card -->
        <div class="card">
            <div class="flex items-center gap-5">
                <div
                    class="flex items-center justify-center w-16 h-16 text-2xl font-black text-white shadow-lg rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/20 shrink-0">
                    {{ userInitial }}
                </div>
                <div>
                    <p class="text-xl font-black text-slate-900 dark:text-white">{{ user?.name }}</p>
                    <p class="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{{ user?.email }}</p>
                    <p class="flex items-center gap-1 mt-1 text-xs text-slate-400 dark:text-slate-500">
                        <Calendar class="w-3 h-3" />
                        Bergabung {{ formatDate(user?.createdAt) }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Update Profile -->
        <div class="space-y-6 card">
            <div class="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div class="w-10 h-10 icon-box rounded-xl bg-primary-100 dark:bg-primary-900/40">
                    <UserCircle class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                    <h2 class="font-black text-slate-900 dark:text-white">Informasi Profil</h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Perbarui nama dan email akun kamu</p>
                </div>
            </div>

            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                <div>
                    <label
                        class="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">Nama
                        Lengkap</label>
                    <div class="relative">
                        <div
                            class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-slate-100 dark:bg-slate-800">
                            <User class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <input v-model="profileForm.name" type="text" placeholder="Nama lengkap" class="input pl-14"
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
                        <input v-model="profileForm.email" type="email" placeholder="Email" class="input pl-14"
                            required />
                    </div>
                </div>

                <div class="flex justify-end pt-2">
                    <button type="submit" :disabled="profileLoading" class="px-6 btn-primary">
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
        <div class="space-y-6 card">
            <div class="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div class="w-10 h-10 icon-box rounded-xl bg-amber-100 dark:bg-amber-900/40">
                    <KeyRound class="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <h2 class="font-black text-slate-900 dark:text-white">Ganti Kata Sandi</h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400">Pastikan kata sandi kamu kuat dan aman</p>
                </div>
            </div>

            <form @submit.prevent="handleUpdatePassword" class="space-y-4">
                <div v-for="field in passwordFields" :key="field.key">
                    <label
                        class="block mb-2 text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-slate-400">
                        {{ field.label }}
                    </label>
                    <div class="relative">
                        <div
                            class="absolute flex items-center justify-center w-8 h-8 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-slate-100 dark:bg-slate-800">
                            <Lock class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <input v-model="passwordForm[field.key]" :type="field.show ? 'text' : 'password'"
                            :placeholder="field.placeholder" class="pr-12 input pl-14" required />
                        <button type="button" @click="field.show = !field.show"
                            class="absolute flex items-center justify-center w-8 h-8 transition-colors -translate-y-1/2 rounded-lg right-3 top-1/2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600">
                            <Eye v-if="!field.show" class="w-4 h-4" />
                            <EyeOff v-else class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div class="flex justify-end pt-2">
                    <button type="submit" :disabled="passwordLoading" class="px-6 btn-primary">
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
import { ref, computed, onMounted, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Save, ShieldCheck, UserCircle, Calendar, KeyRound } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from '@/composables/useToast.js'
import { storeToRefs } from 'pinia'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { success, error, warning } = useToast()

const profileLoading = ref(false)
const passwordLoading = ref(false)

const profileForm = ref({ name: '', email: '' })
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })

const passwordFields = reactive([
    { key: 'currentPassword', label: 'Kata Sandi Lama', placeholder: 'Masukkan kata sandi lama', show: false },
    { key: 'newPassword', label: 'Kata Sandi Baru', placeholder: 'Minimal 8 karakter', show: false },
    { key: 'confirmPassword', label: 'Konfirmasi Kata Sandi Baru', placeholder: 'Ulangi kata sandi baru', show: false }
])

const userInitial = computed(() => user.value?.name?.charAt(0).toUpperCase() || 'U')
const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'

const handleUpdateProfile = async () => {
    profileLoading.value = true
    try {
        await authStore.updateProfile(profileForm.value)
        success('Profil berhasil diperbarui')
    } catch {
        error('Gagal memperbarui profil')
    } finally {
        profileLoading.value = false
    }
}

const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        warning('Kata sandi baru tidak cocok')
        return
    }
    if (passwordForm.newPassword.length < 8) {
        warning('Kata sandi minimal 8 karakter')
        return
    }
    passwordLoading.value = true
    try {
        await authStore.updatePassword({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
        })
        success('Kata sandi berhasil diperbarui')
        passwordForm.currentPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
    } catch {
        error('Gagal memperbarui kata sandi')
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