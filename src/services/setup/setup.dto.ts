// {

//   "name": "string",
//   "churchContact": "string",
//   "churchEmail": "string",

//   "logoUrl": "string"
// }

import { z } from 'zod/v3'

export const churchProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  churchContact: z.string().min(1, 'Church contact is required'),
  churchEmail: z.string().email({ message: 'Invalid email address' }),
  logoUrl: z.string().min(1, 'Logo URL is required'),
})

export type ChurchProfile = z.infer<typeof churchProfileSchema>
