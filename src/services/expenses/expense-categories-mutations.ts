import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ExpenseCategoryService } from './expense-categories.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const expenseCategoriesMutations = () => {
  const createExpenseCategory = useMutation({
    mutationFn: ExpenseCategoryService.createExpenseCategory,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['expenseCategories'],
      })
      toast.success('Expense category created successfully')
    },
    onError: () => {
      toast.error('Failed to create expense category')
    },
  })

  const updateExpenseCategory = useMutation({
    mutationFn: ExpenseCategoryService.updateExpenseCategory,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['expenseCategories'],
      })
      toast.success('Expense category updated successfully')
    },
    onError: () => {
      toast.error('Failed to update expense category')
    },
  })

  return {
    createExpenseCategory,
    updateExpenseCategory,
  }
}
