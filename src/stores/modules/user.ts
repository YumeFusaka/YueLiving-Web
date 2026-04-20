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
    const OWNER_ROLE_ID = 1
    const PROPERTY_MANAGER_ROLE_ID = 2
    const SYSTEM_ADMIN_ROLE_ID = 3

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

    const hasRole = (roleId: number) => {
      return getRoleId() === roleId
    }

    const hasAnyRole = (roleIds: number[]) => {
      const currentRoleId = getRoleId()
      return currentRoleId != null && roleIds.includes(currentRoleId)
    }

    const isOwner = () => {
      return hasRole(OWNER_ROLE_ID)
    }

    const isPropertyManager = () => {
      return hasRole(PROPERTY_MANAGER_ROLE_ID)
    }

    const isSystemAdmin = () => {
      return hasRole(SYSTEM_ADMIN_ROLE_ID)
    }

    const isManagerSide = () => {
      return hasAnyRole([PROPERTY_MANAGER_ROLE_ID, SYSTEM_ADMIN_ROLE_ID])
    }

    return {
      OWNER_ROLE_ID,
      PROPERTY_MANAGER_ROLE_ID,
      SYSTEM_ADMIN_ROLE_ID,
      token,
      user,
      setToken,
      setUser,
      clearToken,
      clearUser,
      logout,
      isLoggedIn,
      getRoleId,
      hasRole,
      hasAnyRole,
      isOwner,
      isPropertyManager,
      isSystemAdmin,
      isManagerSide
    }
  },
  {
    persist: true
  },
)
