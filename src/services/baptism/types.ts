import type { Pagination } from '@/lib/types'
import type { Baptism } from '@/services/baptism/baptism.dto'

export type BaptismResponse = Pagination & {
  data: Array<Baptism & { id: string }>
}
