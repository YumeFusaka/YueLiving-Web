import request from '@/utils/axios'

export const getAnnouncements = () => {
  return request({
    url: '/announcement',
    method: 'GET'
  }).then(res => res.data)
}

export const addAnnouncement = (data: any) => {
  return request({
    url: '/announcement',
    method: 'POST',
    data
  }).then(res => res.data)
}

export const updateAnnouncement = (data: any) => {
  return request({
    url: '/announcement',
    method: 'PUT',
    data
  }).then(res => res.data)
}

export const deleteAnnouncement = (id: number) => {
  return request({
    url: `/announcement/${id}`,
    method: 'DELETE'
  }).then(res => res.data)
}