import request from '@/utils/axios'

export const getMyBills = () => {
  return request({
    url: '/bill/my',
    method: 'GET'
  }).then(res => res.data)
}