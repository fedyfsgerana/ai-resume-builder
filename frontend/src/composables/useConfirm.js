import { ref } from 'vue'

const isOpen = ref(false)
const options = ref(null)
let resolvePromise = null

export const useConfirm = () => {
  const open = (opts = {}) => {
    options.value = {
      title: opts.title || 'Konfirmasi',
      message: opts.message || 'Apakah kamu yakin?',
      confirmText: opts.confirmText || 'Ya',
      cancelText: opts.cancelText || 'Batal',
      type: opts.type || 'danger'
    }
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  const confirm = () => {
    isOpen.value = false
    resolvePromise?.(true)
  }

  const cancel = () => {
    isOpen.value = false
    resolvePromise?.(false)
  }

  return { isOpen, options, open, confirm, cancel }
}
