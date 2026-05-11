<template>
    <Teleport to="body">
        <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            <TransitionGroup name="toast">
                <div v-for="toast in toasts" :key="toast.id"
                    class="flex items-center max-w-sm gap-3 px-4 py-3 rounded-xl shadow-modal min-w-72"
                    :class="toastClass(toast.type)">
                    <component :is="toastIcon(toast.type)" class="w-4 h-4 shrink-0" />
                    <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
                    <button @click="remove(toast.id)" class="opacity-60 hover:opacity-100">
                        <X class="w-4 h-4" />
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup>
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast.js'

const { toasts, remove } = useToast()

const toastClass = (type) => ({
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-primary-600 text-white'
}[type] || 'bg-secondary-800 text-white')

const toastIcon = (type) => ({
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
}[type] || Info)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>