import { ref } from 'vue'

const isDark = ref(false)

export const useDarkMode = () => {
  const applyDarkMode = (dark) => {
    console.log('applying dark mode:', dark)
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', dark ? 'dark' : 'light')
    isDark.value = dark
    console.log('html classes:', document.documentElement.classList.toString())
  }

  const toggle = () => {
    console.log('toggle called, current:', isDark.value)
    applyDarkMode(!isDark.value)
  }

  const init = () => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved ? saved === 'dark' : prefersDark
    console.log('init dark mode:', dark, 'saved:', saved)
    applyDarkMode(dark)
  }

  return { isDark, toggle, init }
}
