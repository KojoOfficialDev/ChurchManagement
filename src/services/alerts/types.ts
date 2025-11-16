import type { Pagination } from '@/lib/types'
import type { CreateAlertTemplate } from './alerts.dto'

export type AlertTemplate = CreateAlertTemplate & {
  id: number
  createdDate: string
  createdBy: string
  modifiedDate: string
  modifiedBy: string
}

export type AlertMessage = {
  societyIds: number[]
  memberId: number | null
  message: string
  createdDate: string
  createdBy: string
  modifiedDate: string
  modifiedBy: string
}

export type AlertMessagesResponse = Pagination & {
  data: Array<AlertMessage>
}
