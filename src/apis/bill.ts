import request from '@/utils/axios'
import type { ApiResponse, BillItem } from '@/types/models'

export const getMyBills = () => {
  return request({
    url: '/bill/my',
    method: 'GET'
  }).then(res => res.data as ApiResponse<BillItem[]>)
}

export const getAllBills = (params?: Record<string, unknown>) => {
  return request({
    url: '/bill',
    method: 'GET',
    params
  }).then(res => res.data as ApiResponse<BillItem[]>)
}

export const addBill = (data: Partial<BillItem>) => {
  return request({
    url: '/bill',
    method: 'POST',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const updateBill = (data: Partial<BillItem>) => {
  return request({
    url: '/bill',
    method: 'PUT',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const deleteBill = (id: number) => {
  return request({
    url: `/bill/${id}`,
    method: 'DELETE'
  }).then(res => res.data as ApiResponse<null>)
}

export const payBill = (id: number) => {
  return request({
    url: `/bill/${id}/pay`,
    method: 'POST'
  }).then(res => res.data as ApiResponse<null>)
}

export const generateBills = (period: string) => {
  return request({
    url: '/bill/generate',
    method: 'POST',
    data: { period }
  }).then(res => res.data as ApiResponse<null>)
}
