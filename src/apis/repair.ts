import request from '@/utils/axios'

export const getMyRepairs = () => {
  return request({
    url: '/repair/my',
    method: 'GET'
  }).then(res => res.data)
}

export const addRepair = (data: { description: string }) => {
  return request({
    url: '/repair',
    method: 'POST',
    data
  }).then(res => res.data)
}