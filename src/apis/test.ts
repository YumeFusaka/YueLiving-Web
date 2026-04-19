import request from '@/utils/axios'
import type { Data } from '@/utils/axios'

export const testAPI = () => {
  return request({
    url: '/test/test',
    method: 'GET',
  }).then(res => res.data)
}
