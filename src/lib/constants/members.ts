import {
  EMPLOYMENT_STATUS,
  GENDER,
  GHANA_REGIONS,
  MARITAL_STATUS,
} from '@/lib/constants/general'

export type MemberFormFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'select'
  | 'textarea'
  | 'checkbox'
export type MemberFormField = {
  name: string
  label: string
  type: MemberFormFieldType
  placeholder?: string
  rows?: number
  options?: { label: string; value: string }[]
}
export type MemberFormSection = {
  title: string
  fields: MemberFormField[]
  subSections?: MemberFormSection[]
}
export const MEMBER_FORM_SECTIONS: MemberFormSection[] = [
  {
    title: 'Basic Information',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter first name',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter last name',
      },
      {
        name: 'middleName',
        label: 'Middle Name (s) (Optional)',
        type: 'text',
        placeholder: 'Enter middle name (s) (Optional)',
      },

      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter email',
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'text',
        placeholder: 'Enter phone number',
      },
      {
        name: 'whatsapp',
        label: 'WhatsApp Number',
        type: 'text',
        placeholder: 'Enter WhatsApp number',
      },
      {
        name: 'ghanaCardNumber',
        label: 'Ghana Card Number',
        type: 'text',
        placeholder: 'Enter Ghana Card number',
      },

      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        options: GENDER,
        placeholder: 'Select gender',
      },
    ],
  },
  {
    title: 'Background Information',
    fields: [
      {
        name: 'dob',
        label: 'Date of Birth',
        type: 'date',
        placeholder: 'Select date of birth',
      },
      {
        name: 'placeOfBirth',
        label: 'Place of Birth',
        type: 'text',
        placeholder: 'Enter place of birth',
      },
      {
        name: 'nationality',
        label: 'Nationality',
        type: 'text',
        placeholder: 'Enter nationality',
      },
      {
        name: 'region',
        label: 'Region',
        type: 'select',
        options: GHANA_REGIONS,
        placeholder: 'Select region',
      },
      {
        name: 'homeTown',
        label: 'Home Town',
        type: 'text',
        placeholder: 'Enter home town',
      },
      {
        name: 'placeOfResidence',
        label: 'Place of Residence',
        type: 'text',
        placeholder: 'Enter place of residence',
      },
      {
        name: 'homeAddress',
        label: 'Home Address or GPS address',
        type: 'text',
        placeholder: 'Enter home address or GPS address',
      },
    ],
  },
  {
    title: 'Family & Professional Information',
    fields: [
      {
        name: 'maritalStatus',
        label: 'Marital Status',
        type: 'select',
        options: MARITAL_STATUS,
        placeholder: 'Select marital status',
      },
      {
        name: 'spouseName',
        label: 'Name of Spouse',
        type: 'text',
        placeholder: 'Enter name of spouse',
      },
      {
        name: 'numberOfChildren',
        label: 'Number of Children',
        type: 'number',
        placeholder: 'Enter number of children',
      },
      {
        name: 'namesOfChildren',
        label: 'Names of Children',
        type: 'textarea',
        placeholder: 'Enter names of children',
        rows: 4,
      },
      {
        name: 'academicQualification',
        label: 'Academic Qualification (Highest)',
        type: 'text',
        placeholder: 'Enter academic qualification (highest)',
      },
      {
        name: 'employmentStatus',
        label: 'Employment Status',
        type: 'select',
        options: EMPLOYMENT_STATUS,
        placeholder: 'Select employment status',
      },
      {
        name: 'occupation',
        label: 'Occupation',
        type: 'text',
        placeholder: 'Enter occupation',
      },
      {
        name: 'placeOfWork',
        label: 'Place of Work',
        type: 'text',
        placeholder: 'Enter place of work',
      },
    ],
  },

  {
    title: 'Membership Information',
    fields: [
      {
        name: 'activeMembership',
        label: 'Are you an active member ',
        type: 'checkbox',
      },
      {
        name: 'baptismStatus',
        label: 'Are you a baptized member',
        type: 'checkbox',
      },
      {
        name: 'communicantStatus',
        label: 'Are you a communicant',
        type: 'checkbox',
      },
      {
        name: 'confirmationStatus',
        label: 'Have you received confirmation',
        type: 'checkbox',
      },
      {
        name: 'societiesStatus',
        label: 'Are you a member of any societies',
        type: 'checkbox',
      },
    ],
    subSections: [
      {
        title: 'society Information',
        fields: [
          {
            name: 'societies',
            label: 'Christian Mothers',
            type: 'checkbox',
          },
          {
            name: 'societies',
            label: 'Knights and Ladies of St. John',
            type: 'checkbox',
          },
          {
            name: 'societies',
            label: 'Knights and Ladies of Marshal',
            type: 'checkbox',
          },
          {
            name: 'societies',
            label: 'Catholic Youth Organization (CYO)',
            type: 'checkbox',
          },
        ],
      },
    ],
  },
  {
    title: 'Baptism & Confirmation Information',
    fields: [
      {
        name: 'membershipNumber',
        label: 'Membership Number',
        type: 'text',
        placeholder: 'Enter membership number',
      },
      {
        name: 'baptismDate',
        label: 'Baptism Date',
        type: 'date',
        placeholder: 'Select baptism date',
      },
      {
        name: 'placeOfBaptism',
        label: 'Place or Parish of Baptism',
        type: 'text',
        placeholder: 'Enter place or parish of baptism',
      },
      {
        name: 'dateOfConfirmation',
        label: 'Date of Confirmation',
        type: 'date',
        placeholder: 'Select date of confirmation',
      },
      {
        name: 'placeOfConfirmation',
        label: 'Place or Parish of Confirmation',
        type: 'text',
        placeholder: 'Enter place or parish of confirmation',
      },

      {
        name: 'baptismalName',
        label: 'Baptismal Name',
        type: 'text',
        placeholder: 'Enter baptismal name',
      },
      {
        name: 'dateOfCommunion',
        label: 'Date of First Communion',
        type: 'date',
        placeholder: 'Select date of first communion',
      },
      {
        name: 'placeOfCommunion',
        label: 'Place or Parish of First Communion',
        type: 'text',
        placeholder: 'Enter place or parish of first communion',
      },
    ],
  },
]
