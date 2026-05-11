import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value)
  const isProUser = computed(() => user.value?.tier === 'PRO' || user.value?.tier === 'BUSINESS')

  const setTokens = (tokens) => {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  }

  const clearAuth = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const initAuth = async () => {
    if (!accessToken.value) return

    try {
      const data = await authService.getProfile()
      user.value = data.user
    } catch {
      clearAuth()
    }
  }

  const register = async (payload) => {
    loading.value = true
    error.value = null
    try {
      await authService.register(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Register failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const data = await authService.login(payload)
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      })
      user.value = data.user
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await authService.logout()
    } finally {
      clearAuth()
      loading.value = false
    }
  }

  const updateProfile = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const data = await authService.updateProfile(payload)
      user.value = data.user
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal memperbarui profil'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (payload) => {
    loading.value = true
    error.value = null
    try {
      await authService.updatePassword(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal memperbarui kata sandi'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    isProUser,
    initAuth,
    register,
    login,
    logout,
    clearAuth,
    updateProfile,
    updatePassword
  }
})
