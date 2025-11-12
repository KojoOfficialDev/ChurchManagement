import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { EditExpenseForm } from './edit-expense-form'
import type { UpdateExpense } from '@/services/expenses/expenses.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateExpenseSchema } from '@/services/expenses/expenses.dto'

type EditExpenseDialogProps = {
  expense: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditExpenseDialog = ({
  expense,
  open,
  onOpenChange,
}: EditExpenseDialogProps) => {
  const form = useForm<UpdateExpense>({
    resolver: standardSchemaResolver(updateExpenseSchema),
    defaultValues: {
      id: expense.id,
      name: expense.name,
      description: expense.description,
      expensesCategoryId: expense.expensesCategoryId,
      amountSpent: expense.amountSpent,
      expenseDate: expense.expenseDate
        ? new Date(expense.expenseDate)
        : undefined,
      paymentMethod: expense.paymentMethod,
      suppliersName: expense.suppliersName ?? '',
      isActive: expense.isActive ?? true,
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <EditExpenseForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditExpenseDialog



