import type { FormSection } from '@/lib/types/general'

export const EVENT_FORM_SECTIONS: Array<FormSection> = [
  {
    title: 'Event Information',
    fields: [
      {
        name: 'name',
        label: 'Event Name',
        type: 'text',
        placeholder: 'Enter event name',
      },
      {
        name: 'venue',
        label: 'Venue',
        type: 'text',
        placeholder: 'Enter event venue',
      },
      {
        name: 'eventDate',
        label: 'Event Date',
        type: 'date',
        placeholder: 'Select event date',
      },
      {
        name: 'societyId',
        label: 'Society',
        type: 'select',
        placeholder: 'Select society',
      },
      {
        name: 'addAlert',
        label: 'Enable Alert',
        type: 'checkbox',
      },
      {
        name: 'frequency',
        label: 'Alert Frequency',
        type: 'text',
        placeholder: 'e.g., Daily, Weekly, Monthly',
        dependsOn: 'addAlert',
        dependsOnValue: [true],
      },
      {
        name: 'alertStartDate',
        label: 'Alert Start Date',
        type: 'date',
        placeholder: 'Select alert start date',
        dependsOn: 'addAlert',
        dependsOnValue: [true],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter event description',
      },
    ],
  },
]
