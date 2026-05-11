import { ref } from 'vue'

const toasts = ref([])

let counter = 0

export const useToast = () => {
  const add = (message, type = 'info', duration = 3000) => {
    const id = ++counter
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  const remove = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const success = (message) => add(message, 'success')
  const error = (message) => add(message, 'error')
  const warning = (message) => add(message, 'warning')
  const info = (message) => add(message, 'info')

  return { toasts, add, remove, success, error, warning, info }
}
