import request from '@/utils/axios'
import type { ApiResponse, SystemConfigItem } from '@/types/models'

export const getSystemConfigs = () => {
  return request({
    url: '/system-config',
    method: 'GET'
  }).then(res => res.data as ApiResponse<SystemConfigItem[]>)
}

export const saveSystemConfig = (data: Partial<SystemConfigItem>) => {
  return request({
    url: '/system-config',
    method: 'POST',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const updateSystemConfig = (data: Partial<SystemConfigItem>) => {
  return request({
    url: '/system-config',
    method: 'PUT',
    data
  }).then(res => res.data as ApiResponse<null>)
}
