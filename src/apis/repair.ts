import request from '@/utils/axios'
import type { ApiResponse, RepairItem } from '@/types/models'

export const getMyRepairs = () => {
  return request({
    url: '/repair/my',
    method: 'GET'
  }).then(res => res.data as ApiResponse<RepairItem[]>)
}

export const getAllRepairs = (params?: Record<string, unknown>) => {
  return request({
    url: '/repair',
    method: 'GET',
    params
  }).then(res => res.data as ApiResponse<RepairItem[]>)
}

export const addRepair = (data: { description: string; images?: string[] }) => {
  return request({
    url: '/repair',
    method: 'POST',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const assignRepair = (id: number, assignUserId: number) => {
  return request({
    url: `/repair/${id}/assign`,
    method: 'PUT',
    data: { assignUserId }
  }).then(res => res.data as ApiResponse<null>)
}

export const completeRepair = (id: number) => {
  return request({
    url: `/repair/${id}/complete`,
    method: 'PUT'
  }).then(res => res.data as ApiResponse<null>)
}

export const rateRepair = (id: number, rating: number, comment: string) => {
  return request({
    url: `/repair/${id}/rate`,
    method: 'PUT',
    data: { rating, comment }
  }).then(res => res.data as ApiResponse<null>)
}
