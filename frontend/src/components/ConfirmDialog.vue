<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] px-4"
                @click.self="handleCancel">
                <Transition name="scale">
                    <div v-if="isOpen"
                        class="w-full max-w-sm p-6 bg-white dark:bg-secondary-800 rounded-2xl shadow-modal">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                                :class="iconBg">
                                <component :is="dialogIcon" class="w-5 h-5" :class="iconColor" />
                            </div>
                            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">{{ title }}
                            </h3>
                        </div>
                        <p class="mb-6 text-sm text-secondary-500 dark:text-secondary-400">{{ message }}</p>
                        <div class="flex gap-3">
                            <button @click="handleCancel" class="flex-1 btn-secondary">{{ cancelText }}</button>
                            <button @click="handleConfirm" class="flex items-center justify-center flex-1 gap-2"
                                :class="confirmClass">
                                <component :is="confirmIcon" class="w-4 h-4" />
                                {{ confirmText }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { Trash2, AlertTriangle, Info, CheckCircle } from 'lucide-vue-next'
import { useConfirm } from '@/composables/useConfirm.js'

const { isOpen, options, confirm, cancel } = useConfirm()

const title = computed(() => options.value?.title || 'Konfirmasi')
const message = computed(() => options.value?.message || 'Apakah kamu yakin?')
const confirmText = computed(() => options.value?.confirmText || 'Ya')
const cancelText = computed(() => options.value?.cancelText || 'Batal')
const type = computed(() => options.value?.type || 'danger')

const dialogIcon = computed(() => ({ danger: AlertTriangle, info: Info, success: CheckCircle }[type.value]))
const iconBg = computed(() => ({
    danger: 'bg-red-100 dark:bg-red-900',
    info: 'bg-blue-100 dark:bg-blue-900',
    success: 'bg-green-100 dark:bg-green-900'
}[type.value]))
const iconColor = computed(() => ({
    danger: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400'
}[type.value]))
const confirmClass = computed(() => ({ danger: 'btn-danger', info: 'btn-primary', success: 'btn-primary' }[type.value]))
const confirmIcon = computed(() => ({ danger: Trash2, info: Info, success: CheckCircle }[type.value]))

const handleConfirm = () => confirm()
const handleCancel = () => cancel()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>