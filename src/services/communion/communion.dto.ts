import { z } from 'zod/v3'

export const communionSchema = z.object({
  isMember: z.boolean().default(false),
  memberId: z.string().min(1, 'Member name is required'),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  homeDistrict: z.string().min(1, 'Home district is required'),
  firstCommunionNumber: z.string().optional(),
  firstCommunionDate: z.date({ required_error: 'Communion date is required' }),
  placeOfFirstCommunion: z.string().min(1, 'Place of communion is required'),
  godParent: z.string().min(1, 'God parent is required'),
  revMinister: z.string().min(1, 'Rev minister is required'),
})

export type Communion = z.infer<typeof communionSchema>
