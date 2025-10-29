import type { Pagination } from '@/lib/types'
import type { Contribution } from './contributions.dto'

export type ContributionResponse = Pagination & {
  data: Array<Contribution & { id: string }>
}
