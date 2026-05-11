<template>
    <div class="flex items-center justify-center" :class="fullscreen ? 'min-h-screen' : ''">
        <div class="flex flex-col items-center gap-3">
            <div class="rounded-full border-4 border-secondary-200 animate-spin" :class="sizeClass"
                :style="{ borderTopColor: '#0ea5e9' }"></div>
            <p v-if="text" class="text-secondary-500 text-sm">{{ text }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: String,
        default: 'md',
        validator: (val) => ['sm', 'md', 'lg'].includes(val)
    },
    text: {
        type: String,
        default: ''
    },
    fullscreen: {
        type: Boolean,
        default: false
    }
})

const sizeClass = computed(() => {
    return {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }[props.size]
})
</script>