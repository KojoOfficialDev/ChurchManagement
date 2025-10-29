import type { FormSection } from '@/lib/types/general'

export const BAPTISM_FORM_SECTIONS: Array<FormSection> = [
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
            name: 'baptismNumber',
            label: 'Baptism Number',
            type: 'text',
            placeholder: 'Enter baptism number',
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
            name: 'placeOfBirth',
            label: 'Place of Birth',
            type: 'text',
            placeholder: 'Enter place of birth',
          },
          {
            name: 'dateOfBirth',
            label: 'Date of Birth',
            type: 'date',
            placeholder: 'Select date of birth',
          },
          {
            name: 'homeDistrict',
            label: 'Home District',
            type: 'text',
            placeholder: 'Enter home district',
          },
          {
            name: 'baptismDate',
            label: 'Baptism Date',
            type: 'date',
            placeholder: 'Select baptism date',
          },
          {
            name: 'placeOfBaptism',
            label: 'Place of Baptism',
            type: 'text',
            placeholder: 'Enter place of baptism',
          },
          {
            name: 'godParent',
            label: 'God Parent',
            type: 'text',
            placeholder: 'Enter god parent',
          },
          {
            name: 'revMinister',
            label: 'Name of Minister',
            type: 'text',
            placeholder: 'Enter name of minister',
          },
          {
            name: 'fathersName',
            label: 'Fathers Name',
            type: 'text',
            placeholder: 'Enter fathers name',
          },
          {
            name: 'mothersName',
            label: 'Mothers Name',
            type: 'text',
            placeholder: 'Enter mothers name',
          },
        ],
      },
    ],
  },
]
