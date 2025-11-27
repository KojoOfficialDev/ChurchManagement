import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { EditExpenseCategoryForm } from './edit-expense-category-form'
import type { UpdateExpenseCategory } from '@/services/expenses/expenses.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateExpenseCategorySchema } from '@/services/expenses/expenses.dto'

type EditExpenseCategoryDialogProps = {
  category: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditExpenseCategoryDialog = ({
  category,
  open,
  onOpenChange,
}: EditExpenseCategoryDialogProps) => {
  const form = useForm<UpdateExpenseCategory>({
    resolver: standardSchemaResolver(updateExpenseCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      active: category.active ?? true,
      isActive: category.isActive ?? true,
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Expense Category</DialogTitle>
        </DialogHeader>
        <EditExpenseCategoryForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditExpenseCategoryDialog







