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
  id: number
  messageTemplateId: number | null
  messageTemplate: string | null
  messageContent: string
  sentToMemberId: string | null
  sentToSocietyIds: Array<number>
  sentAt: string
  isSentToIndividual: boolean
  count: number
  churchId: number
  createdDate: string
  createdBy: string
  modifiedDate: string
  modifiedBy: string
  isActive: boolean
}

export type AlertMessagesResponse = Pagination & {
  data: Array<AlertMessage>
}
