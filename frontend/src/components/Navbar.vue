<template>
    <nav
        class="sticky top-0 z-50 border-b bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-secondary-100 dark:border-secondary-800">
        <div class="container px-6 mx-auto max-w-7xl">
            <div class="flex items-center justify-between h-16">

                <!-- Logo -->
                <RouterLink to="/" class="flex items-center gap-2.5 group">
                    <div
                        class="flex items-center justify-center transition-transform shadow-md w-9 h-9 rounded-xl bg-primary-600 group-hover:scale-105 shadow-primary-500/25">
                        <span class="text-sm font-extrabold text-white">AI</span>
                    </div>
                    <span class="text-lg font-extrabold tracking-tight text-secondary-900 dark:text-white">
                        AI <span class="text-primary-600">Resume</span> Builder
                    </span>
                </RouterLink>

                <!-- Right -->
                <div class="flex items-center gap-2">
                    <template v-if="isAuthenticated">
                        <RouterLink to="/dashboard"
                            class="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all">
                            <LayoutDashboard class="w-4 h-4" />
                            Dasbor
                        </RouterLink>

                        <div class="relative" ref="dropdownRef">
                            <button @click="toggleDropdown"
                                class="flex items-center gap-2 px-3 py-2 transition-all rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800">
                                <div
                                    class="flex items-center justify-center w-8 h-8 text-sm font-bold text-white shadow-sm rounded-xl bg-gradient-to-br from-primary-400 to-primary-600">
                                    {{ userInitial }}
                                </div>
                                <span
                                    class="hidden text-sm font-semibold sm:block text-secondary-700 dark:text-secondary-200">
                                    {{ user?.name?.split(' ')[0] }}
                                </span>
                                <ChevronDown class="w-4 h-4 transition-transform duration-200 text-secondary-400"
                                    :class="{ 'rotate-180': dropdownOpen }" />
                            </button>

                            <Transition name="dropdown">
                                <div v-if="dropdownOpen"
                                    class="absolute right-0 z-50 mt-2 overflow-hidden bg-white border shadow-xl w-60 dark:bg-secondary-800 rounded-2xl border-secondary-100 dark:border-secondary-700">

                                    <div
                                        class="px-4 py-3 border-b bg-secondary-50 dark:bg-secondary-900/50 border-secondary-100 dark:border-secondary-700">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="flex items-center justify-center w-10 h-10 font-bold text-white rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shrink-0">
                                                {{ userInitial }}
                                            </div>
                                            <div class="min-w-0">
                                                <p
                                                    class="text-sm font-bold truncate text-secondary-900 dark:text-white">
                                                    {{ user?.name }}</p>
                                                <p class="text-xs truncate text-secondary-500 dark:text-secondary-400">
                                                    {{ user?.email }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="px-4 py-3 border-b border-secondary-100 dark:border-secondary-700">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-2.5">
                                                <div class="flex items-center justify-center rounded-lg w-7 h-7"
                                                    :class="isDark ? 'bg-secondary-700' : 'bg-yellow-100'">
                                                    <Sun v-if="isDark" class="w-3.5 h-3.5 text-secondary-300" />
                                                    <Moon v-else class="w-3.5 h-3.5 text-yellow-600" />
                                                </div>
                                                <span
                                                    class="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                                                    {{ isDark ? 'Mode Terang' : 'Mode Gelap' }}
                                                </span>
                                            </div>
                                            <button @click="toggle"
                                                class="relative h-6 transition-colors duration-300 rounded-full w-11"
                                                :class="isDark ? 'bg-primary-600' : 'bg-secondary-200'">
                                                <span
                                                    class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300"
                                                    :class="isDark ? 'translate-x-5' : 'translate-x-0'"></span>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="py-1.5">
                                        <RouterLink to="/dashboard"
                                            class="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                                            @click="dropdownOpen = false">
                                            <div
                                                class="flex items-center justify-center rounded-lg w-7 h-7 bg-secondary-100 dark:bg-secondary-700">
                                                <LayoutDashboard
                                                    class="w-3.5 h-3.5 text-secondary-500 dark:text-secondary-400" />
                                            </div>
                                            <span class="font-medium">Dasbor</span>
                                        </RouterLink>
                                        <RouterLink to="/profile"
                                            class="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                                            @click="dropdownOpen = false">
                                            <div
                                                class="flex items-center justify-center rounded-lg w-7 h-7 bg-secondary-100 dark:bg-secondary-700">
                                                <UserCircle
                                                    class="w-3.5 h-3.5 text-secondary-500 dark:text-secondary-400" />
                                            </div>
                                            <span class="font-medium">Profil Saya</span>
                                        </RouterLink>
                                    </div>

                                    <div class="p-2 border-t border-secondary-100 dark:border-secondary-700">
                                        <button @click="handleLogout"
                                            class="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                            <div
                                                class="flex items-center justify-center rounded-lg w-7 h-7 bg-red-50 dark:bg-red-900/30">
                                                <LogOut class="w-3.5 h-3.5 text-red-500" />
                                            </div>
                                            <span class="font-semibold">Keluar</span>
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </template>

                    <template v-else>
                        <RouterLink to="/auth/login"
                            class="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-secondary-600 dark:text-secondary-300 hover:text-primary-600 px-3 py-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all">
                            <LogIn class="w-4 h-4" />
                            Masuk
                        </RouterLink>
                        <RouterLink to="/auth/register"
                            class="btn-primary text-sm px-4 py-2 flex items-center gap-1.5 shadow-md shadow-primary-500/20 hover:-translate-y-0.5 transition-all">
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
import { LayoutDashboard, ChevronDown, LogIn, LogOut, Zap, UserCircle, Sun, Moon } from 'lucide-vue-next'
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

const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value }

const handleLogout = async () => {
    dropdownOpen.value = false
    const confirmed = await open({
        title: 'Keluar',
        message: 'Apakah kamu yakin ingin keluar dari akun ini?',
        confirmText: 'Keluar', cancelText: 'Batal', type: 'danger'
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

<style scoped>
.dropdown-enter-active {
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-leave-active {
    transition: all 0.15s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
}
</style>