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

export const getProfile = () => {
  return request({
    url: '/user/profile',
    method: 'GET'
  }).then(res => res.data)
}

export const updateProfile = (data: any) => {
  return request({
    url: '/user/profile',
    method: 'PUT',
    data
  }).then(res => res.data)
}
