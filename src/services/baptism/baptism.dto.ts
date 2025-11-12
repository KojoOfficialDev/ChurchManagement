import { z } from 'zod/v3'

export const baptismSchema = z.object({
  isMember: z.boolean().default(false),
  memberId: z.string().min(1, 'Member name is required'),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  baptismNumber: z.string().optional(),
  baptismDate: z.date({ required_error: 'Baptism date is required' }),
  placeOfBaptism: z.string().min(1, 'Place of baptism is required'),
  godParent: z.string().min(1, 'God parent is required'),
  revMinister: z.string().min(1, 'Rev minister is required'),
  fathersName: z.string().min(1, 'Fathers name is required'),
  mothersName: z.string().min(1, 'Mothers name is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  homeDistrict: z.string().min(1, 'Home district is required'),
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
})

export type Baptism = z.infer<typeof baptismSchema>
