import request from '@/utils/axios'
import type { ApiResponse, OperationLogItem, UserItem } from '@/types/models'

export const login = (data: { username: string; password: string }) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  }).then(res => res.data as ApiResponse<{ token: string; user: UserItem }>)
}

export const register = (data: { username: string; password: string; phone: string; email: string; realName: string; roleId: number }) => {
  return request({
    url: '/user/register',
    method: 'POST',
    data
  }).then(res => res.data as ApiResponse<null>)
}
export const getUserProfile = () => {
  return request({
    url: '/user/profile',
    method: 'GET'
  }).then(res => res.data as ApiResponse<UserItem>)
}

export const updateUserProfile = (data: Partial<UserItem>) => {
  return request({
    url: '/user/profile',
    method: 'PUT',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request({
    url: '/user/profile/password',
    method: 'PUT',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const getUsers = () => {
  return request({
    url: '/user',
    method: 'GET'
  }).then(res => res.data as ApiResponse<UserItem[]>)
}

export const addUser = (data: Partial<UserItem> & { password?: string }) => {
  return request({
    url: '/user',
    method: 'POST',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const updateUser = (data: Partial<UserItem>) => {
  return request({
    url: '/user',
    method: 'PUT',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const updateUserStatus = (data: { userId: number; status: number }) => {
  return request({
    url: '/user/status',
    method: 'PUT',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const deleteUser = (id: number) => {
  return request({
    url: `/user/${id}`,
    method: 'DELETE'
  }).then(res => res.data as ApiResponse<null>)
}

export const getMaintenanceUsers = () => {
  return request({
    url: '/user/maintenance',
    method: 'GET'
  }).then(res => res.data as ApiResponse<UserItem[]>)
}

export const getMyLogs = () => {
  return request({
    url: '/user/profile/logs',
    method: 'GET'
  }).then(res => res.data as ApiResponse<OperationLogItem[]>)
}
