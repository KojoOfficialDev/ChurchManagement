import { useCallback, useMemo } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import FieldTypeToRender from '../../field-type-to-render'
import type { FieldPath, UseFormReturn } from 'react-hook-form'
import type { FormField, FormSection } from '@/lib/types'
import type { UpdateExpense } from '@/services/expenses/expenses.dto'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { expensesMutations } from '@/services/expenses/expenses-mutations'
import { EXPENSE_FORM_SECTIONS } from '@/services/expenses/expenses-form'
import { expenseCategoriesQueryOptions } from '@/services/expenses/expense-categories-queries'

type EditExpenseFormProps = {
  form: UseFormReturn<UpdateExpense>
  onOpenChange: (open: boolean) => void
}

export const EditExpenseForm = ({
  form,
  onOpenChange,
}: EditExpenseFormProps) => {
  const {
    updateExpense: { mutateAsync, isPending },
  } = expensesMutations()

  const { data: expenseCategories = [] } = useQuery(
    expenseCategoriesQueryOptions(),
  )

  // Enhance the expensesCategoryId field with options from query
  const section = useMemo(() => {
    const baseSection = EXPENSE_FORM_SECTIONS[0]
    const modifiedSection: FormSection = {
      ...baseSection,
      fields: baseSection.fields.map((field) => {
        if (field.name === 'expensesCategoryId') {
          return {
            ...field,
            options: expenseCategories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
          }
        }
        return field
      }),
    }
    return modifiedSection
  }, [expenseCategories])

  const shouldShowField = useCallback(
    (field: FormField) => {
      if (!field.dependsOn) return true
      const dependsOnValue = form.watch(
        field.dependsOn as FieldPath<UpdateExpense>,
      )
      return field.dependsOnValue?.includes(dependsOnValue!)
    },
    [form],
  )

  const handleSave = async (data: UpdateExpense) => {
    await mutateAsync(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Failed to update expense')
      },
    })
  }

  return (
    <div className="space-y-6">
      <ScrollArea>
        <form className="space-y-6 h-fit max-h-[calc(100vh_-_260px)] p-4">
          <div className="grid grid-cols-2 gap-4">
            {section.fields.map((field) => {
              if (!shouldShowField(field)) return null
              return (
                <FieldTypeToRender
                  key={field.name}
                  control={form.control}
                  field={field}
                  form={form}
                  fieldType={field.type}
                />
              )
            })}
          </div>
        </form>
      </ScrollArea>
      <DialogFooter className="flex items-center justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline" disabled={isPending} size="lg">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          onClick={form.handleSubmit(handleSave, () => {
            toast.error('Please fill in all required fields')
          })}
        >
          {isPending ? 'Updating...' : 'Update'}
        </Button>
      </DialogFooter>
    </div>
  )
}

export default EditExpenseForm







