import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ExpenseService } from './expenses.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const expensesMutations = () => {
  const createExpense = useMutation({
    mutationFn: ExpenseService.createExpense,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['expenses'],
      })
      toast.success('Expense created successfully')
    },
    onError: () => {
      toast.error('Failed to create expense')
    },
  })

  const updateExpense = useMutation({
    mutationFn: ExpenseService.updateExpense,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['expenses'],
      })
      toast.success('Expense updated successfully')
    },
    onError: () => {
      toast.error('Failed to update expense')
    },
  })

  return {
    createExpense,
    updateExpense,
  }
}
