import { z } from 'zod/v3'

export const genderEnum = z.enum(['male', 'female'], {
  invalid_type_error: 'Invalid gender',
  required_error: 'Gender is required',
  message: 'Invalid gender',
})
export const maritalStatusEnum = z.enum(
  ['single', 'married', 'divorced', 'widowed'],
  {
    invalid_type_error: 'Invalid marital status',
    required_error: 'Marital status is required',
    message: 'Marital status is required',
  },
)
export const employmentStatusEnum = z.enum(
  ['employed', 'unemployed', 'self-employed', 'student', 'retired'],
  {
    invalid_type_error: 'Invalid employment status',
    required_error: 'Employment status is required',
    message: 'Invalid employment status',
  },
)

export const createMemberSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Invalid email address' })
    .optional(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => {
        if (val.startsWith('+233') && val.length === 13) return true
        if (val.startsWith('0') && val.length === 10) return true
        return false
      },
      {
        message: 'Invalid phone number',
      },
    ),
  whatsapp: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === '') return true
        if (val === undefined) return true
        if (val.startsWith('+233') && val.length === 13) return true
        if (val.startsWith('0') && val.length === 10) return true
        return false
      },
      {
        message: 'Invalid WhatsApp number',
      },
    ),
  ghanaCardNumber: z.string().min(1, 'Ghana Card number is required'),
  gender: genderEnum,
  dob: z.date(),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  region: z.string().min(1, 'Region is required'),
  homeTown: z.string().min(1, 'Home town is required'),
  placeOfResidence: z.string().min(1, 'Place of residence is required'),
  homeAddress: z.string().min(1, 'Home address is required'),
  maritalStatus: maritalStatusEnum,
  spouseName: z.string().optional(),
  numberOfChildren: z.coerce.number().default(0),
  namesOfChildren: z.string().optional(),
  academicQualification: z.string().optional(),
  employmentStatus: employmentStatusEnum,
  occupation: z.string().optional(),
  placeOfWork: z.string().optional(),
  activeMembership: z.boolean(),
  baptismStatus: z.boolean(),
  communicantStatus: z.boolean(),
  confirmationStatus: z.boolean(),
  societiesStatus: z.boolean(),
  societies: z.array(z.boolean()).optional(),
  membershipNumber: z
    .string()
    .min(1, 'Membership number is required')
    .optional(),
  baptismDate: z.date().optional(),
  placeOfBaptism: z.string().min(1, 'Place of baptism is required').optional(),
  dateOfConfirmation: z.date().optional(),
  placeOfConfirmation: z
    .string()
    .min(1, 'Place of confirmation is required')
    .optional(),
  dateOfCommunion: z.date().optional(),
  placeOfCommunion: z
    .string()
    .min(1, 'Place of communion is required')
    .optional(),
})

export type CreateMember = z.infer<typeof createMemberSchema>
export type Gender = z.infer<typeof genderEnum>
export type MaritalStatus = z.infer<typeof maritalStatusEnum>
export type EmploymentStatus = z.infer<typeof employmentStatusEnum>
