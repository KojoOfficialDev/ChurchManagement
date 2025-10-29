import type { FormSection } from '@/lib/types/general'

export const CONTRIBUTION_FORM_SECTIONS: Array<FormSection> = [
  {
    title: 'Contribution Information',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Enter contributor name',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter description',
      },
      {
        name: 'contributionTypeId',
        label: 'Contribution Type',
        type: 'select',
        placeholder: 'Select contribution type',
      },
      {
        name: 'amount',
        label: 'Amount',
        type: 'number',
        placeholder: 'Enter amount',
      },
      {
        name: 'channel',
        label: 'Channel',
        type: 'text',
        placeholder: 'Enter payment channel',
      },
      {
        name: 'reference',
        label: 'Reference',
        type: 'text',
        placeholder: 'Enter reference number',
      },
      {
        name: 'mobileNumber',
        label: 'Mobile Number',
        type: 'text',
        placeholder: 'Enter mobile number',
      },
      {
        name: 'paymentDate',
        label: 'Payment Date',
        type: 'date',
        placeholder: 'Select payment date',
      },
      {
        name: 'taxDeductable',
        label: 'Tax Deductible',
        type: 'checkbox',
        placeholder: 'Is this tax deductible?',
      },
      {
        name: 'isActive',
        label: 'Active',
        type: 'checkbox',
        placeholder: 'Is this contribution active?',
      },
    ],
  },
]

