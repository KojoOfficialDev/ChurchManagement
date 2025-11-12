import type { Pagination } from '@/lib/types'
import type { Expense } from './expenses.dto'

export type ExpenseResponse = Pagination & {
  data: Array<Expense & { id: string }>
}



