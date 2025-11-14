import { queryOptions } from '@tanstack/react-query'
import { ExpenseCategoryService } from './expense-categories.service'

export const expenseCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: ['expenseCategories'],
    queryFn: () => ExpenseCategoryService.getExpenseCategories(),
    staleTime: 5 * 60 * 1000,
  })
