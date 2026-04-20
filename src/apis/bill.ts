import request from '@/utils/axios'

export const getMyBills = () => {
  return request({
    url: '/bill/my',
    method: 'GET'
  }).then(res => res.data)
}

export const getAllBills = (params?: any) => {
  return request({
    url: '/bill',
    method: 'GET',
    params
  }).then(res => res.data)
}

export const addBill = (data: any) => {
  return request({
    url: '/bill',
    method: 'POST',
    data
  }).then(res => res.data)
}

export const updateBill = (data: any) => {
  return request({
    url: '/bill',
    method: 'PUT',
    data
  }).then(res => res.data)
}

export const deleteBill = (id: number) => {
  return request({
    url: `/bill/${id}`,
    method: 'DELETE'
  }).then(res => res.data)
}

export const payBill = (id: number) => {
  return request({
    url: `/bill/${id}/pay`,
    method: 'POST'
  }).then(res => res.data)
}