import { PlusCircle } from 'lucide-react'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import AddExpenseForm from './add-expense-form'
import type { Expense } from '@/services/expenses/expenses.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { expenseSchema } from '@/services/expenses/expenses.dto'

const AddExpenseDialog = () => {
  const form = useForm<Expense>({
    resolver: standardSchemaResolver(expenseSchema),
    defaultValues: {
      name: '',
      description: '',
      expensesCategoryId: 0,
      amountSpent: 0,
      expenseDate: undefined,
      paymentMethod: '',
      suppliersName: '',
      isActive: true,
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'} className="flex items-center gap-2">
          Add Expense <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <AddExpenseForm form={form} />
      </DialogContent>
    </Dialog>
  )
}

export default AddExpenseDialog

