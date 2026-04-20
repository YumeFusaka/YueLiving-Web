import request from '@/utils/axios'
import type { ApiResponse, DashboardSummary } from '@/types/models'

export const getOwnerDashboard = () => {
  return request({
    url: '/dashboard/owner',
    method: 'GET'
  }).then(res => res.data as ApiResponse<DashboardSummary>)
}

export const getManagerStatistics = () => {
  return request({
    url: '/dashboard/statistics/manager',
    method: 'GET'
  }).then(res => res.data as ApiResponse<DashboardSummary>)
}

export const getSystemOverview = () => {
  return request({
    url: '/dashboard/statistics/system',
    method: 'GET'
  }).then(res => res.data as ApiResponse<DashboardSummary>)
}
