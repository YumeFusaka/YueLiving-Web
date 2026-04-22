import request from '@/utils/axios'
import type { ApiResponse } from '@/types/models'

export interface AiChatResult {
  category: string
  answer: string
}

export const chatWithAi = (message: string) => {
  return request({
    url: '/ai/chat',
    method: 'POST',
    data: { message }
  }).then(res => res.data as ApiResponse<AiChatResult>)
}
