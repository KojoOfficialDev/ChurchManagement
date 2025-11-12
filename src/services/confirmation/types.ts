import type { Pagination } from '@/lib/types'
import type { Confirmation } from './confirmation.dto'

export type ConfirmationResponse = Pagination & {
  data: Array<Confirmation & { id: string }>
}
