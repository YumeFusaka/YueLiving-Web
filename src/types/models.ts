export interface ApiResponse<T> {
  code: number
  data: T
  message?: string
  msg?: string
}

export interface PropertyItem {
  id: number
  buildingNo: string
  unitNo: string
  roomNo: string
  area?: number
  ownerId?: number | null
  status?: number
}

export interface AnnouncementItem {
  id: number
  title: string
  summary?: string
  content: string
  categoryCode?: string
  isTop: number
  status?: string
  publishUserId?: number | null
  publishTime?: string
}

export interface BillItem {
  id: number
  propertyId: number
  billType: string
  amount: number
  period?: string
  dueDate?: string | null
  status: number
  payTime?: string | null
}

export interface RepairItem {
  id: number
  propertyId?: number
  userId?: number
  description: string
  images?: string | string[]
  status: number
  assignUserId?: number | null
  assignTime?: string | null
  completeTime?: string | null
  createTime?: string
  rating?: number | null
}

export interface UserItem {
  id: number
  username: string
  realName?: string
  phone?: string
  email?: string
  avatar?: string
  roleId: number
  status: number
}

export interface OperationLogItem {
  id: number
  operatorId: number
  operatorRoleId: number
  moduleName: string
  actionName: string
  targetType?: string
  targetId?: number | null
  content: string
  createTime?: string
}

export interface DashboardSummary {
  totalProperties?: number
  unpaidBills?: number
  pendingRepairs?: number
  totalUsers?: number
  [key: string]: number | string | undefined
}

export interface SystemConfigItem {
  id: number
  configKey: string
  configName: string
  configValue: string
  configType?: string
  remark?: string
}

export interface AiChatItem {
  category: string
  answer: string
}
