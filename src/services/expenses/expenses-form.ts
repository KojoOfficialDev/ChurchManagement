import type { FormSection } from '@/lib/types/general'

export const EXPENSE_FORM_SECTIONS: Array<FormSection> = [
  {
    title: 'Expense Information',
    fields: [
      {
        name: 'name',
        label: 'Expense Name',
        type: 'text',
        placeholder: 'Enter expense name',
      },
      {
        name: 'expensesCategoryId',
        label: 'Expense Category',
        type: 'select',
        placeholder: 'Select expense category',
      },
      {
        name: 'amountSpent',
        label: 'Amount Spent',
        type: 'number',
        placeholder: 'Enter amount spent',
      },
      {
        name: 'expenseDate',
        label: 'Expense Date',
        type: 'date',
        placeholder: 'Select expense date',
      },
      {
        name: 'paymentMethod',
        label: 'Payment Method',
        type: 'text',
        placeholder: 'Enter payment method',
      },
      {
        name: 'suppliersName',
        label: 'Supplier Name',
        type: 'text',
        placeholder: 'Enter supplier name (optional)',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter description',
      },
    ],
  },
]
