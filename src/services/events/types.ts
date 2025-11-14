import type { Event } from './events.dto'

export type EventData = Event & {
  id: number
  society: {
    id: number
    name: string
  } | null
  createdDate?: string
  createdBy?: string | null
  modifiedDate?: string
  modifiedBy?: string | null
  churchId?: number
}

export type EventResponse = {
  data: Array<EventData>
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}
