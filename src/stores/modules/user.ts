// src/stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref()
    const setToken = (val:string)=>{
      token.value = val
    }
    const clearToken = ()=>{
      token.value = undefined
    }
    return {
      token,
      setToken,
      clearToken
    }
  },
  {
    persist: true
  },
)