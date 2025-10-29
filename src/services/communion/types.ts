import type { Pagination } from '@/lib/types'
import type { Communion } from './communion.dto'

export type CommunionResponse = Pagination & {
  data: Array<Communion & { id: string }>
}
