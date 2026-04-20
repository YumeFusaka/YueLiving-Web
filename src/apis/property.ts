import request from '@/utils/axios'
import type { ApiResponse, PropertyItem } from '@/types/models'

export const getMyProperties = () => {
  return request({
    url: '/property/my',
    method: 'GET'
  }).then(res => res.data as ApiResponse<PropertyItem[]>)
}

export const getAllProperties = () => {
  return request({
    url: '/property',
    method: 'GET'
  }).then(res => res.data as ApiResponse<PropertyItem[]>)
}

export const addProperty = (data: Partial<PropertyItem>) => {
  return request({
    url: '/property',
    method: 'POST',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const updateProperty = (data: Partial<PropertyItem>) => {
  return request({
    url: '/property',
    method: 'PUT',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const deleteProperty = (id: number) => {
  return request({
    url: `/property/${id}`,
    method: 'DELETE'
  }).then(res => res.data as ApiResponse<null>)
}

export const bindPropertyOwner = (data: { propertyId: number; ownerId: number }) => {
  return request({
    url: '/property/bind-owner',
    method: 'PUT',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const unbindPropertyOwner = (id: number) => {
  return request({
    url: `/property/${id}/unbind-owner`,
    method: 'PUT'
  }).then(res => res.data as ApiResponse<null>)
}
