<template>
    <nav
        class="sticky top-0 z-50 bg-white border-b border-secondary-200 dark:bg-secondary-900 dark:border-secondary-700">
        <div class="container px-4 mx-auto max-w-7xl">
            <div class="flex items-center justify-between h-16">
                <RouterLink to="/" class="flex items-center gap-2">
                    <img src="/logo.svg" alt="AI Resume Builder" class="h-9 w-9 rounded-xl" />
                    <span class="text-xl font-bold text-primary-600">AI Resume Builder</span>
                </RouterLink>

                <div class="flex items-center gap-4">
                    <template v-if="isAuthenticated">
                        <RouterLink to="/dashboard"
                            class="flex items-center gap-1.5 text-secondary-600 hover:text-primary-600 font-medium transition-colors dark:text-secondary-300 dark:hover:text-primary-400">
                            <LayoutDashboard class="w-4 h-4" />
                            Dasbor
                        </RouterLink>

                        <div class="relative" ref="dropdownRef">
                            <button @click="toggleDropdown"
                                class="flex items-center gap-2 transition-colors text-secondary-700 hover:text-primary-600 dark:text-secondary-300">
                                <div
                                    class="flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                                    {{ userInitial }}
                                </div>
                                <span class="text-sm font-medium">{{ user?.name }}</span>
                                <ChevronDown class="w-4 h-4 text-secondary-400" />
                            </button>

                            <div v-if="dropdownOpen"
                                class="absolute right-0 z-50 py-1 mt-2 bg-white border w-52 rounded-xl shadow-modal border-secondary-100 dark:bg-secondary-800 dark:border-secondary-700">
                                <!-- User Info -->
                                <div class="px-4 py-2 border-b border-secondary-100 dark:border-secondary-700">
                                    <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100">{{
                                        user?.name }}</p>
                                    <p class="text-xs text-secondary-500 dark:text-secondary-400">{{ user?.email }}</p>
                                </div>

                                <!-- Dark Mode Toggle -->
                                <div class="px-4 py-2 border-b border-secondary-100 dark:border-secondary-700">
                                    <div class="flex items-center justify-between">
                                        <div
                                            class="flex items-center gap-2 text-sm text-secondary-700 dark:text-secondary-300">
                                            <Sun v-if="isDark" class="w-4 h-4" />
                                            <Moon v-else class="w-4 h-4" />
                                            <span>{{ isDark ? 'Mode Terang' : 'Mode Gelap' }}</span>
                                        </div>
                                        <button @click="toggle"
                                            class="relative w-10 h-5 transition-colors duration-200 rounded-full"
                                            :class="isDark ? 'bg-primary-600' : 'bg-secondary-200'">
                                            <span
                                                class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                                                :class="isDark ? 'translate-x-5' : 'translate-x-0'"></span>
                                        </button>
                                    </div>
                                </div>

                                <RouterLink to="/dashboard"
                                    class="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-700"
                                    @click="dropdownOpen = false">
                                    <LayoutDashboard class="w-4 h-4" />
                                    Dasbor
                                </RouterLink>
                                <RouterLink to="/profile"
                                    class="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 dark:text-secondary-300 dark:hover:bg-secondary-700"
                                    @click="dropdownOpen = false">
                                    <UserCircle class="w-4 h-4" />
                                    Profil Saya
                                </RouterLink>
                                <button @click="handleLogout"
                                    class="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                    <LogOut class="w-4 h-4" />
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <RouterLink to="/auth/login" class="flex items-center gap-2 px-4 py-2 text-sm btn-outline">
                            <LogIn class="w-4 h-4" />
                            Masuk
                        </RouterLink>
                        <RouterLink to="/auth/register" class="flex items-center gap-2 px-4 py-2 text-sm btn-primary">
                            <Zap class="w-4 h-4" />
                            Mulai Gratis
                        </RouterLink>
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
    LayoutDashboard, ChevronDown, LogIn, LogOut,
    Zap, UserCircle, Sun, Moon
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth.js'
import { useToast } from '@/composables/useToast.js'
import { useConfirm } from '@/composables/useConfirm.js'
import { useDarkMode } from '@/composables/useDarkMode.js'

const { user, isAuthenticated, logout } = useAuth()
const { success, error } = useToast()
const { open } = useConfirm()
const { isDark, toggle } = useDarkMode()

const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const userInitial = computed(() => user.value?.name?.charAt(0).toUpperCase() || 'U')

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
}

const handleLogout = async () => {
    dropdownOpen.value = false

    const confirmed = await open({
        title: 'Keluar',
        message: 'Apakah kamu yakin ingin keluar dari akun ini?',
        confirmText: 'Keluar',
        cancelText: 'Batal',
        type: 'danger'
    })

    if (!confirmed) return

    try {
        await logout()
        success('Berhasil keluar dari akun')
    } catch {
        error('Gagal keluar, coba lagi')
    }
}

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>