import type { FormSection } from '@/lib/types'

export const MARRIAGE_FORM_SECTIONS: Array<Omit<FormSection, 'title'>> = [
  {
    fields: [
      {
        name: 'marriageNumber',
        label: 'Marriage Number',
        type: 'text',
        placeholder: 'Enter marriage number',
      },
      {
        name: 'coupleName',
        label: 'Couple Name',
        type: 'text',
        placeholder: 'Enter couple name',
      },
      {
        name: 'groomId',
        label: "Groom's Name",
        type: 'text',
        placeholder: "Enter Groom's name",
      },
      {
        name: 'groomWitness',
        label: 'Groom Witness',
        type: 'text',
        placeholder: 'Enter groom witness',
      },
      {
        name: 'brideId',
        label: "Bride's Name",
        type: 'text',
        placeholder: "Enter bride's name",
      },
      {
        name: 'brideWitness',
        label: 'Bride Witness',
        type: 'text',
        placeholder: 'Enter bride witness',
      },
      {
        name: 'placeOfMarriage',
        label: 'Place of Marriage',
        type: 'text',
        placeholder: 'Enter place of marriage',
      },
      {
        name: 'marriageDate',
        label: 'Marriage Date',
        type: 'date',
        placeholder: 'Select marriage date',
      },
      {
        name: 'placeOfStay',
        label: 'Place of Residence',
        type: 'text',
        placeholder: 'Enter place of residence',
      },
      {
        name: 'groomParentName',
        label: 'Groom Parent Name',
        type: 'text',
        placeholder: 'Enter groom parent name',
      },
      {
        name: 'brideParentName',
        label: 'Bride Parent Name',
        type: 'text',
        placeholder: 'Enter bride parent name',
      },
      {
        name: 'revMinister',
        label: 'Name of Minister',
        type: 'text',
        placeholder: 'Enter name of minister',
      },
    ],
  },
]
