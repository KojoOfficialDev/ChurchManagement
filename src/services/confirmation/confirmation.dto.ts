import { z } from 'zod/v3'

export const confirmationSchema = z.object({
  isMember: z.boolean().default(false),
  memberId: z.string().min(1, 'Member name is required'),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  homeDistrict: z.string().min(1, 'Home district is required'),
  confirmationNumber: z.string().optional(),
  confirmationDate: z.date({ required_error: 'Confirmation date is required' }),
  placeOfConfirmation: z.string().min(1, 'Place of confirmation is required'),
  godParent: z.string().min(1, 'God Parent is required'),
  revMinister: z.string().min(1, 'Name of Minister is required'),
  fileUrl: z.string().optional(),
})

export type Confirmation = z.infer<typeof confirmationSchema>

export const updateConfirmationSchema = confirmationSchema.and(
  z.object({
    id: z.string().min(1, 'ID is required'),
  }),
)

export type UpdateConfirmation = z.infer<typeof updateConfirmationSchema>
