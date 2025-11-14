import type { FormSection, SelectType } from '@/lib/types'
import {
  EDUCATIONAL_LEVEL,
  EMPLOYMENT_STATUS,
  GENDER,
  GHANA_REGIONS,
  MARITAL_STATUS,
} from '@/lib/constants/general'
import { useNationalitiesMutations } from '@/services/nationalities/mutations'
import { useAssetsMutations } from '@/services/assets/mutations'
import { useSocietiesMutations } from '@/services/societies/mutations'

type useMemberFormArges = {
  nationalities: Array<SelectType>
  societies: Array<SelectType>
}
export const useMemberForm = ({
  nationalities,
  societies,
}: useMemberFormArges) => {
  const {
    createNationality: { mutateAsync },
  } = useNationalitiesMutations()
  const {
    uploadImage: { mutateAsync: uploadImage },
  } = useAssetsMutations()
  const {
    createSociety: { mutateAsync: createSociety },
  } = useSocietiesMutations()
  const MEMBER_FORM_SECTIONS: Array<FormSection> = [
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
          name: 'gender',
          label: 'Gender',
          type: 'select',
          options: GENDER,
          placeholder: 'Select gender',
        },
        {
          name: 'isActive',
          label: 'Are you an active member',
          type: 'checkbox',
        },
        {
          name: 'isBaptized',
          label: 'Are you a baptized member',
          type: 'checkbox',
          autoClearsFrom: ['isFirstCommunion', 'isConfirmed'],
        },
        {
          name: 'isFirstCommunion',
          label: 'Are you a communicant',
          type: 'checkbox',
          autoFills: ['isBaptized'],
          autoClearsFrom: ['isConfirmed'],
        },
        {
          name: 'isConfirmed',
          label: 'Are you a confirmed member',
          type: 'checkbox',
          autoFills: ['isFirstCommunion', 'isBaptized'],
        },
      ],
    },
    {
      title: 'Background Information',
      childSections: [
        {
          title: 'Baptism Information',
          dependsOn: 'isBaptized',
          dependsOnValue: [true],
          fields: [
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
              name: 'baptismNumber',
              label: 'NLB Number',
              type: 'text',
              placeholder: 'Enter NLB number',
            },
          ],
        },
        {
          title: 'First Communion Information',
          dependsOn: 'isFirstCommunion',
          dependsOnValue: [true],
          fields: [
            {
              name: 'dateOfFirstCommunion',
              label: 'Date of First Communion',
              type: 'date',
              placeholder: 'Select date of first communion',
            },
            {
              name: 'placeOfFirstCommunion',
              label: 'Place of First Communion',
              type: 'text',
              placeholder: 'Enter place of first communion',
            },
            {
              name: 'firstCommunionNumber',
              label: 'NLC Number',
              type: 'text',
              placeholder: 'Enter NLC number',
            },
          ],
        },
        {
          title: 'Confirmation Information',
          dependsOn: 'isConfirmed',
          dependsOnValue: [true],
          fields: [
            {
              name: 'dateOfConfirmation',
              label: 'Date of Confirmation',
              type: 'date',
              placeholder: 'Select date of confirmation',
            },
            {
              name: 'placeOfConfirmation',
              label: 'Place of Confirmation',
              type: 'text',
              placeholder: 'Enter place of confirmation',
            },
            {
              name: 'confirmationNumber',
              label: 'Enter NL Conf. Number',
              type: 'text',
              placeholder: 'Enter NL Conf. number',
            },
          ],
        },
      ],
      fields: [
        {
          name: 'dateOfBirth',
          label: 'Date of Birth',
          type: 'date',
          placeholder: 'Select date of birth',
          disabled: (value) =>
            value && new Date(value as string) > new Date() ? true : false,
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
          type: 'select',
          placeholder: 'Select nationality',
          options: nationalities,
          allowCreate: true,
          createConfig: {
            onCreate: async (value) => {
              const response = await mutateAsync(value)
              return response
            },
            dialogTitle: 'Create New Nationality',
            buttonText: 'Create New Nationality',
            inputLabel: 'Nationality Name',
            inputPlaceholder: 'Enter nationality name',
            submitButtonText: 'Create New Nationality',
            cancelButtonText: 'Cancel',
          },
        },
        {
          name: 'region',
          label: 'Region',
          type: 'select',
          options: GHANA_REGIONS,
          placeholder: 'Select region',
        },
        {
          name: 'homeDistrict',
          label: 'Home District',
          type: 'text',
          placeholder: 'Enter home district',
        },
        {
          name: 'placeOfStay',
          label: 'Place of Residence',
          type: 'text',
          placeholder: 'Enter place of residence',
        },
        {
          name: 'houseNumber',
          label: 'Home Address or GPS address',
          type: 'text',
          placeholder: 'Enter home address or GPS address',
        },
      ],
    },
    {
      title: 'Family & Professional Information',
      childSections: [
        {
          title: 'Employment Information',
          dependsOn: 'employmentStatus',
          dependsOnValue: ['employed', 'self-employed'],
          fields: [
            {
              name: 'placeOfWork',
              label: 'Place of Work',
              type: 'text',
              placeholder: 'Enter place of work',
            },
          ],
        },
        {
          title: 'Spouse Information',
          dependsOn: 'maritalStatus',
          dependsOnValue: ['married'],
          fields: [
            {
              name: 'spouseName',
              label: 'Spouse Name',
              type: 'text',
              placeholder: 'Enter spouse name',
            },
            {
              name: 'numberOfChildren',
              label: 'Number of Children',
              type: 'number',
              placeholder: 'Enter number of children',
            },
            {
              name: 'namesOfChildren',
              label: 'Names of Children (Optional)',
              type: 'textarea',
              placeholder: 'Enter names of children',
              rows: 3,
            },
          ],
        },
      ],
      fields: [
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter email',
        },
        {
          name: 'phoneNumber',
          label: 'Phone Number',
          type: 'tel',
          placeholder: 'Enter phone number',
        },
        {
          name: 'educationalLevel',
          label: 'Educational Level (Highest)',
          type: 'select',
          options: EDUCATIONAL_LEVEL,
          placeholder: 'Select educational level (highest)',
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
          dependsOn: 'employmentStatus',
          dependsOnValue: ['employed', 'self-employed'],
        },
        {
          name: 'maritalStatus',
          label: 'Marital Status',
          type: 'select',
          options: MARITAL_STATUS,
          placeholder: 'Select marital status',
        },
      ],
    },
    {
      title: 'Membership & Societies Information ',
      fields: [
        {
          name: 'imageUrl',
          label: 'Profile Picture',
          type: 'file',
          placeholder: 'Upload member image',
          onUpload: async (file) => {
            const result = await uploadImage(file)
            return result
          },
        },
        {
          name: 'belongsToSociety',
          label: 'Do you belong to any society',
          type: 'checkbox',
        },
        {
          name: 'societyName',
          label: 'Societies',
          type: 'multi-select',
          allowCreate: true,
          createConfig: {
            onCreate: async (value) => {
              const response = await createSociety(value)
              return response
            },
          },
          options: societies,
          placeholder: 'Select societies',
          dependsOn: 'belongsToSociety',
          dependsOnValue: [true],
        },
      ],
    },
  ]

  return { MEMBER_FORM_SECTIONS }
}

// export const getFormFields = async () => {
//   const { queryClient } = getContext()
//   const data = await queryClient.ensureQueryData(getNationalitiesOptions)

//   const nationalities = data.map((nation) => {
//     return {
//       label: nation.name,
//       value: nation.id,
//     }
//   })
// }
