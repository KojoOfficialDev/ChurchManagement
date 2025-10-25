import { z } from 'zod/v3'

export const createMarriageSchema = z.object({
  marriageNumber: z.string().min(1, 'Marriage number is required'),
  coupleName: z.string().min(1, 'Couple name is required'),
  placeOfMarriage: z.string().min(1, 'Place of marriage is required'),
  marriageDate: z.date({ required_error: 'Marriage date is required' }),
  groomId: z.string().min(1, 'Groom ID is required'),
  groomWitness: z.string().min(1, 'Groom witness is required'),
  brideId: z.string().min(1, 'Bride ID is required'),
  brideWitness: z.string().min(1, 'Bride witness is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  placeOfStay: z.string().min(1, 'Place of stay is required'),
  homeDistrict: z.string().min(1, 'Home district is required'),
  groomParentName: z.string().min(1, 'Groom parent name is required'),
  brideParentName: z.string().min(1, 'Bride parent name is required'),
  revMinister: z.string().min(1, 'Rev minister is required'),
})

export type CreateMarriage = z.infer<typeof createMarriageSchema>
