import request from '@/utils/axios'
import type { AnnouncementItem, ApiResponse } from '@/types/models'

export const getAnnouncements = () => {
  return request({
    url: '/announcement',
    method: 'GET'
  }).then(res => res.data as ApiResponse<AnnouncementItem[]>)
}

export const addAnnouncement = (data: Partial<AnnouncementItem>) => {
  return request({
    url: '/announcement',
    method: 'POST',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const updateAnnouncement = (data: Partial<AnnouncementItem>) => {
  return request({
    url: '/announcement',
    method: 'PUT',
    data
  }).then(res => res.data as ApiResponse<null>)
}

export const deleteAnnouncement = (id: number) => {
  return request({
    url: `/announcement/${id}`,
    method: 'DELETE'
  }).then(res => res.data as ApiResponse<null>)
}
