import { PlusCircle } from 'lucide-react'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import AddExpenseCategoryForm from './add-expense-category-form'
import type { ExpenseCategory } from '@/services/expenses/expenses.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { expenseCategorySchema } from '@/services/expenses/expenses.dto'

const AddExpenseCategoryDialog = () => {
  const form = useForm<ExpenseCategory>({
    resolver: standardSchemaResolver(expenseCategorySchema),
    defaultValues: {
      name: '',
      active: true,
      isActive: true,
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'} className="flex items-center gap-2">
          Add Expense Category <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Add New Expense Category</DialogTitle>
        </DialogHeader>
        <AddExpenseCategoryForm form={form} />
      </DialogContent>
    </Dialog>
  )
}

export default AddExpenseCategoryDialog



