import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod/v3'

export const genderEnum = z.enum(['male', 'female'], {
  invalid_type_error: 'Invalid gender',
  required_error: 'Gender is required',
  message: 'Gender is required',
})

// Base member schema - always required fields
const baseMemberSchema = z.object({
  imageUrl: z.any().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  gender: genderEnum,
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  region: z.string().min(1, 'Region is required'),
  homeDistrict: z.string().min(1, 'Home district is required'),
  placeOfStay: z.string().min(1, 'Place of residence is required'),
  houseNumber: z.string().min(1, 'Home address is required'),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .optional()
    .or(z.literal('')),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => {
        return isValidPhoneNumber(val)
      },
      {
        message: 'Invalid phone number',
      },
    ),
  educationalLevel: z.string().optional(),
  occupation: z.string().optional(),
  isActive: z.boolean().default(false),
  membershipNumber: z.string().optional(),
  belongsToSociety: z.boolean().default(false),
  societyName: z.array(z.coerce.number()).optional(),
})

// Baptism discriminated union
const baptismSchema = z.discriminatedUnion('isBaptized', [
  z.object({
    isBaptized: z.literal(false),
  }),
  z.object({
    isBaptized: z.literal(true),
    baptismDate: z.date({ required_error: 'Baptism date is required' }),
    placeOfBaptism: z.string().min(1, 'Place of baptism is required'),
    baptismNumber: z.string().optional(),
  }),
])

// First Communion discriminated union
const firstCommunionSchema = z.discriminatedUnion('isFirstCommunion', [
  z.object({
    isFirstCommunion: z.literal(false),
  }),
  z.object({
    isFirstCommunion: z.literal(true),
    dateOfFirstCommunion: z.date({
      required_error: 'Date of first communion is required',
    }),
    placeOfFirstCommunion: z
      .string()
      .min(1, 'Place of first communion is required'),
    firstCommunionNumber: z.string().optional(),
  }),
])

// Confirmation discriminated union
const confirmationSchema = z.discriminatedUnion('isConfirmed', [
  z.object({
    isConfirmed: z.literal(false),
  }),
  z.object({
    isConfirmed: z.literal(true),
    dateOfConfirmation: z.date({
      required_error: 'Date of confirmation is required',
    }),
    placeOfConfirmation: z.string().min(1, 'Place of confirmation is required'),
    confirmationNumber: z.string().optional(),
  }),
])

// Employment status discriminated union
const employmentSchema = z.discriminatedUnion('employmentStatus', [
  z.object({
    employmentStatus: z.enum(['unemployed', 'student', 'retired'], {
      invalid_type_error: 'Invalid employment status',
      required_error: 'Employment status is required',
    }),
  }),
  z.object({
    employmentStatus: z.enum(['employed', 'self-employed'], {
      invalid_type_error: 'Invalid employment status',
      required_error: 'Employment status is required',
    }),
    placeOfWork: z.string().min(1, 'Place of work is required'),
    occupation: z.string().min(1, 'Occupation is required'),
  }),
])

// Marital status discriminated union
const maritalStatusSchema = z.discriminatedUnion('maritalStatus', [
  z.object({
    maritalStatus: z.enum(['single', 'divorced', 'widowed'], {
      invalid_type_error: 'Invalid marital status',
      required_error: 'Marital status is required',
    }),
  }),
  z.object({
    maritalStatus: z.literal('married'),
    spouseName: z.string().min(1, 'Spouse name is required'),
    numberOfChildren: z.coerce
      .number()
      .int()
      .nonnegative()
      .min(0, 'Number of children must be 0 or greater')
      .default(0),
    namesOfChildren: z.string().optional(),
  }),
])

// Combine all schemas using intersection
export const createMemberSchema = baseMemberSchema
  .and(baptismSchema)
  .and(firstCommunionSchema)
  .and(confirmationSchema)
  .and(employmentSchema)
  .and(maritalStatusSchema)

export type CreateMember = z.infer<typeof createMemberSchema>

// Update member schema - same as create but with id
export const updateMemberSchema = createMemberSchema.and(
  z.object({
    id: z.string().min(1, 'Member ID is required'),
  }),
)

export type UpdateMember = z.infer<typeof updateMemberSchema>
export type Gender = z.infer<typeof genderEnum>
export type EmploymentStatus = z.infer<typeof employmentSchema>
export type MaritalStatus = z.infer<typeof maritalStatusSchema>
