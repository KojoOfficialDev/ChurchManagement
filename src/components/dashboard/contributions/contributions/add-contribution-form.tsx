import { useCallback, useMemo } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import FieldTypeToRender from '../../field-type-to-render'
import type { FieldPath, UseFormReturn } from 'react-hook-form'
import type { FormField, FormSection } from '@/lib/types'
import type { Contribution } from '@/services/contributions/contributions.dto'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { contributionsMutations } from '@/services/contributions/contributions-mutations'
import { CONTRIBUTION_FORM_SECTIONS } from '@/services/contributions/contributions-form'
import { contributionTypesQueryOptions } from '@/services/contributions/contribution-types-queries'

type AddContributionFormProps = {
  form: UseFormReturn<Contribution>
}

export const AddContributionForm = ({ form }: AddContributionFormProps) => {
  const {
    createContribution: { mutateAsync, isPending },
  } = contributionsMutations()

  const { data: contributionTypes = [] } = useQuery(
    contributionTypesQueryOptions(),
  )

  // Enhance the contributionTypeId field with options from query
  const section = useMemo(() => {
    const baseSection = CONTRIBUTION_FORM_SECTIONS[0]
    const modifiedSection: FormSection = {
      ...baseSection,
      fields: baseSection.fields.map((field) => {
        if (field.name === 'contributionTypeId') {
          return {
            ...field,
            options: contributionTypes.map((type) => ({
              value: type.id,
              label: type.name,
            })),
          }
        }
        return field
      }),
    }
    return modifiedSection
  }, [contributionTypes])

  const shouldShowField = useCallback(
    (field: FormField) => {
      if (!field.dependsOn) return true
      const dependsOnValue = form.watch(
        field.dependsOn as FieldPath<Contribution>,
      )
      return field.dependsOnValue?.includes(dependsOnValue)
    },
    [form],
  )

  const handleSave = async (data: Contribution) => {
    await mutateAsync(data, {
      onSuccess: () => {
        form.reset()
      },
      onError: () => {
        toast.error('Failed to create contribution')
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
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  )
}

export default AddContributionForm
