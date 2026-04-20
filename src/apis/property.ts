import request from '@/utils/axios'

export const getMyProperties = () => {
  return request({
    url: '/property/my',
    method: 'GET'
  }).then(res => res.data)
}

export const addProperty = (data: any) => {
  return request({
    url: '/property',
    method: 'POST',
    data
  }).then(res => res.data)
}

export const updateProperty = (data: any) => {
  return request({
    url: '/property',
    method: 'PUT',
    data
  }).then(res => res.data)
}

export const deleteProperty = (id: number) => {
  return request({
    url: `/property/${id}`,
    method: 'DELETE'
  }).then(res => res.data)
}