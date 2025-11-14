import type { FormSection } from '@/lib/types/general'

export const COMMUNION_FORM_SECTIONS: Array<FormSection> = [
  {
    title: 'Membership Information',
    fields: [
      {
        name: 'isMember',
        label: 'Is this a member of the church',
        type: 'checkbox',
        placeholder: 'Select is member',
      },
      {
        name: 'memberId',
        label: 'Member ID',
        type: 'member-search',
        placeholder: 'Search for a member...',
        dependsOn: 'isMember',
        dependsOnValue: [true],
      },
    ],
    childSections: [
      {
        title: 'Personal Information',
        fields: [
          {
            name: 'firstCommunionNumber',
            label: 'First Communion Number',
            type: 'text',
            placeholder: 'Enter first communion number',
          },
          {
            name: 'firstName',
            label: 'First Name',
            type: 'text',
            placeholder: 'Enter first name',
          },
          {
            name: 'middleName',
            label: 'Middle Name',
            type: 'text',
            placeholder: 'Enter middle name',
          },
          {
            name: 'lastName',
            label: 'Last Name',
            type: 'text',
            placeholder: 'Enter last name',
          },
          {
            name: 'homeDistrict',
            label: 'Home District',
            type: 'text',
            placeholder: 'Enter home district',
          },
          {
            name: 'firstCommunionDate',
            label: 'First Communion Date',
            type: 'date',
            placeholder: 'Select first communion date',
          },
          {
            name: 'placeOfFirstCommunion',
            label: 'Place of First Communion',
            type: 'text',
            placeholder: 'Enter place of first communion',
          },
          {
            name: 'revMinister',
            label: 'Name of Minister',
            type: 'text',
            placeholder: 'Enter name of minister',
          },
        ],
      },
    ],
  },
]
