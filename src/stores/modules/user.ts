// src/stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: number
  username: string
  phone?: string
  email?: string
  realName?: string
  avatar?: string
  roleId: number
  status: number
}

// 定义 Store
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>()
    const user = ref<User>()

    const setToken = (val: string) => {
      token.value = val
    }

    const setUser = (val: User) => {
      user.value = val
    }

    const clearToken = () => {
      token.value = undefined
    }

    const clearUser = () => {
      user.value = undefined
    }

    const logout = () => {
      clearToken()
      clearUser()
    }

    const isLoggedIn = () => {
      return !!token.value
    }

    const getRoleId = () => {
      return user.value?.roleId
    }

    const isOwner = () => {
      return getRoleId() === 1
    }

    const isPropertyManager = () => {
      return getRoleId() === 2
    }

    const isSystemAdmin = () => {
      return getRoleId() === 3
    }

    return {
      token,
      user,
      setToken,
      setUser,
      clearToken,
      clearUser,
      logout,
      isLoggedIn,
      getRoleId,
      isOwner,
      isPropertyManager,
      isSystemAdmin
    }
  },
  {
    persist: true
  },
)