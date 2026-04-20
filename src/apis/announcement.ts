import request from '@/utils/axios'

export const getAnnouncements = () => {
  return request({
    url: '/announcement',
    method: 'GET'
  }).then(res => res.data)
}