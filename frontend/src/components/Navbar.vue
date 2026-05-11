<template>
    <nav class="bg-white border-b border-secondary-200 sticky top-0 z-50">
        <div class="container mx-auto px-4 max-w-7xl">
            <div class="flex items-center justify-between h-16">
                <RouterLink to="/" class="flex items-center gap-2">
                    <FileText class="w-6 h-6 text-primary-600" />
                    <span class="text-xl font-bold text-primary-600">AI Resume Builder</span>
                </RouterLink>

                <div class="flex items-center gap-4">
                    <template v-if="isAuthenticated">
                        <RouterLink to="/dashboard"
                            class="flex items-center gap-1.5 text-secondary-600 hover:text-primary-600 font-medium transition-colors">
                            <LayoutDashboard class="w-4 h-4" />
                            Dashboard
                        </RouterLink>

                        <div class="relative" ref="dropdownRef">
                            <button @click="toggleDropdown"
                                class="flex items-center gap-2 text-secondary-700 hover:text-primary-600 transition-colors">
                                <div
                                    class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                                    {{ userInitial }}
                                </div>
                                <span class="font-medium text-sm">{{ user?.name }}</span>
                                <ChevronDown class="w-4 h-4 text-secondary-400" />
                            </button>

                            <div v-if="dropdownOpen"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-modal border border-secondary-100 py-1 z-50">
                                <div class="px-4 py-2 border-b border-secondary-100">
                                    <p class="text-sm font-medium text-secondary-900">{{ user?.name }}</p>
                                    <p class="text-xs text-secondary-500">{{ user?.email }}</p>
                                </div>
                                <RouterLink to="/dashboard"
                                    class="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                                    @click="dropdownOpen = false">
                                    <LayoutDashboard class="w-4 h-4" />
                                    Dashboard
                                </RouterLink>
                                <button @click="handleLogout"
                                    class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    <LogOut class="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <RouterLink to="/auth/login" class="btn-outline text-sm px-4 py-2 flex items-center gap-2">
                            <LogIn class="w-4 h-4" />
                            Login
                        </RouterLink>
                        <RouterLink to="/auth/register" class="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                            <Zap class="w-4 h-4" />
                            Get Started
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
import { FileText, LayoutDashboard, ChevronDown, LogIn, LogOut, Zap } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth.js'

const { user, isAuthenticated, logout } = useAuth()

const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const userInitial = computed(() => user.value?.name?.charAt(0).toUpperCase() || 'U')

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
}

const handleLogout = async () => {
    dropdownOpen.value = false
    await logout()
}

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>