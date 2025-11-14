import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { ExpenseService } from './expenses.service'

export const expensesQueryOptions = ({
  page,
  pageSize,
  search,
}: {
  page: number
  pageSize: number
  search?: string
}) =>
  queryOptions({
    queryKey: ['expenses', page, pageSize, search],
    queryFn: () => ExpenseService.getExpenses({ page, pageSize, search }),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
