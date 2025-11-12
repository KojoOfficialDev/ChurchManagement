import type { FormSection } from '@/lib/types/general'

export const EXPENSE_CATEGORY_FORM_SECTIONS: Array<FormSection> = [
  {
    title: 'Category Information',
    fields: [
      {
        name: 'name',
        label: 'Category Name',
        type: 'text',
        placeholder: 'Enter category name',
      },
    ],
  },
]
