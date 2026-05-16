<template>
    <nav
        class="sticky top-0 z-50 transition-all border-b bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-100 dark:border-slate-800">
        <div class="container px-4 mx-auto sm:px-6 max-w-7xl">
            <div class="flex items-center justify-between h-16">

                <!-- Logo -->
                <RouterLink to="/" class="flex items-center gap-2.5 group shrink-0">
                    <div
                        class="flex items-center justify-center transition-all shadow-md w-9 h-9 rounded-xl bg-primary-600 shadow-primary-500/30 group-hover:scale-105 group-hover:shadow-primary-500/40">
                        <span class="text-sm font-black tracking-tight text-white">AI</span>
                    </div>
                    <span class="text-base font-black tracking-tight text-slate-900 dark:text-white">
                        AI<span class="text-primary-600">Resume</span>Builder
                    </span>
                </RouterLink>

                <!-- Right -->
                <div class="flex items-center gap-2">
                    <template v-if="isAuthenticated">
                        <RouterLink to="/dashboard"
                            class="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                            <LayoutDashboard class="w-4 h-4" />
                            Dasbor
                        </RouterLink>

                        <div class="relative" ref="dropdownRef">
                            <button @click="toggleDropdown"
                                class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                                <div
                                    class="flex items-center justify-center w-8 h-8 text-sm font-black text-white shadow-sm rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
                                    {{ userInitial }}
                                </div>
                                <div class="hidden text-left sm:block">
                                    <p class="text-sm font-bold leading-none text-slate-800 dark:text-slate-100">{{
                                        firstName }}</p>
                                </div>
                                <ChevronDown class="w-4 h-4 transition-transform duration-300 text-slate-400"
                                    :class="{ 'rotate-180': dropdownOpen }" />
                            </button>

                            <Transition name="dropdown">
                                <div v-if="dropdownOpen"
                                    class="absolute right-0 z-50 w-64 mt-2 overflow-hidden bg-white border shadow-2xl dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">

                                    <!-- User info -->
                                    <div
                                        class="p-4 border-b bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-slate-100 dark:border-slate-800">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="flex items-center justify-center text-lg font-black text-white shadow-md w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
                                                {{ userInitial }}
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-bold truncate text-slate-900 dark:text-white">{{
                                                    user?.name }}</p>
                                                <p class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{{
                                                    user?.email }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Dark mode -->
                                    <div class="p-3 border-b border-slate-100 dark:border-slate-800">
                                        <div class="flex items-center justify-between px-1">
                                            <div class="flex items-center gap-2.5">
                                                <div class="w-8 h-8 rounded-lg icon-box"
                                                    :class="isDark ? 'bg-slate-700' : 'bg-amber-100'">
                                                    <Moon v-if="!isDark" class="w-4 h-4 text-amber-600" />
                                                    <Sun v-else class="w-4 h-4 text-slate-300" />
                                                </div>
                                                <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                    {{ isDark ? 'Mode Terang' : 'Mode Gelap' }}
                                                </span>
                                            </div>
                                            <button @click="toggle"
                                                class="relative w-12 h-6 transition-colors duration-300 rounded-full focus:outline-none ring-2 ring-offset-2 ring-transparent focus:ring-primary-500"
                                                :class="isDark ? 'bg-primary-600' : 'bg-slate-200'">
                                                <span
                                                    class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center"
                                                    :class="isDark ? 'translate-x-6' : 'translate-x-0'">
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Menu -->
                                    <div class="p-2">
                                        <RouterLink to="/dashboard" @click="dropdownOpen = false"
                                            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <div class="w-8 h-8 rounded-lg icon-box bg-slate-100 dark:bg-slate-800">
                                                <LayoutDashboard class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                            </div>
                                            Dasbor
                                        </RouterLink>
                                        <RouterLink to="/profile" @click="dropdownOpen = false"
                                            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <div class="w-8 h-8 rounded-lg icon-box bg-slate-100 dark:bg-slate-800">
                                                <UserCircle class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                            </div>
                                            Profil Saya
                                        </RouterLink>
                                    </div>

                                    <!-- Logout -->
                                    <div class="p-2 pt-0">
                                        <button @click="handleLogout"
                                            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <div class="w-8 h-8 rounded-lg icon-box bg-red-50 dark:bg-red-900/30">
                                                <LogOut class="w-4 h-4 text-red-500" />
                                            </div>
                                            Keluar dari Akun
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </template>

                    <template v-else>
                        <RouterLink to="/auth/login" class="hidden text-sm sm:flex btn-ghost">
                            <LogIn class="w-4 h-4" />
                            Masuk
                        </RouterLink>
                        <RouterLink to="/auth/register" class="text-sm btn-primary">
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
const firstName = computed(() => user.value?.name?.split(' ')[0] || '')

const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value }

const handleLogout = async () => {
    dropdownOpen.value = false
    const confirmed = await open({
        title: 'Keluar dari Akun',
        message: 'Apakah kamu yakin ingin keluar? Kamu perlu login kembali untuk mengakses dasbor.',
        confirmText: 'Ya, Keluar', cancelText: 'Batal', type: 'danger'
    })
    if (!confirmed) return
    try {
        await logout()
        success('Berhasil keluar dari akun')
    } catch {
        error('Gagal keluar, coba lagi')
    }
}

const handleClickOutside = (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) dropdownOpen.value = false
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
    transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-5px) scale(0.97);
}
</style>