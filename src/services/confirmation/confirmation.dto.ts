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
  GodParent: z.string().min(1, 'God Parent is required'),
  revMinister: z.string().min(1, 'Name of Minister is required'),
})

export type Confirmation = z.infer<typeof confirmationSchema>
