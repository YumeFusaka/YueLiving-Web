import request from '@/utils/axios'
import type { Data } from '@/utils/axios'

export const login = (data: { username: string; password: string }) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  }).then(res => res.data)
}

export const register = (data: { username: string; password: string; phone: string; email: string; realName: string; roleId: number }) => {
  return request({
    url: '/user/register',
    method: 'POST',
    data
  }).then(res => res.data)
}
export const getUserProfile = () => {
  return request({
    url: '/user/profile',
    method: 'GET'
  }).then(res => res.data)
}

export const updateUserProfile = (data: any) => {
  return request({
    url: '/user/profile',
    method: 'PUT',
    data
  }).then(res => res.data)
}

export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request({
    url: '/user/profile/password',
    method: 'PUT',
    data
  }).then(res => res.data)
}

export const getUsers = () => {
  return request({
    url: '/user',
    method: 'GET'
  }).then(res => res.data)
}

export const addUser = (data: any) => {
  return request({
    url: '/user',
    method: 'POST',
    data
  }).then(res => res.data)
}

export const updateUser = (data: any) => {
  return request({
    url: '/user',
    method: 'PUT',
    data
  }).then(res => res.data)
}

export const deleteUser = (id: number) => {
  return request({
    url: `/user/${id}`,
    method: 'DELETE'
  }).then(res => res.data)
}

export const getMaintenanceUsers = () => {
  return request({
    url: '/user/maintenance',
    method: 'GET'
  }).then(res => res.data)
}