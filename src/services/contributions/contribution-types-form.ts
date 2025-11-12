import type { FormSection } from '@/lib/types/general'

export const CONTRIBUTION_TYPE_FORM_SECTIONS: Array<FormSection> = [
  {
    title: 'Basic Information',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'Enter contribution type name',
      },
      {
        name: 'paymentType',
        label: 'Payment Type',
        type: 'text',
        placeholder: 'Enter payment type',
      },
      {
        name: 'isActive',
        label: 'Is this contribution type currently active?',
        type: 'checkbox',
      },
      {
        name: 'isCampaign',
        label: 'Is Campaign',
        type: 'checkbox',
        placeholder: 'Is this a campaign?',
      },
    ],
    childSections: [
      {
        title: 'Campaign Information',
        dependsOn: 'isCampaign',
        dependsOnValue: [true],
        fields: [
          {
            name: 'fundRaisingGoal',
            label: 'Fundraising Theme',
            type: 'text',
            placeholder: 'Enter fundraising theme',
          },
          {
            name: 'initialAmount',
            label: 'Initial Amount',
            type: 'number',
            placeholder: 'Enter initial amount',
          },
          {
            name: 'startDate',
            label: 'Start Date',
            type: 'date',
            placeholder: 'Select start date',
          },
          {
            name: 'endDate',
            label: 'End Date',
            type: 'date',
            placeholder: 'Select end date',
          },
        ],
      },
    ],
  },
]
