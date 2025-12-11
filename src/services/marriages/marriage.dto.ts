import { z } from 'zod/v3'

export const createMarriageSchema = z.object({
  marriageNumber: z.string().min(1, 'Marriage number is required'),
  coupleName: z.string().optional(),
  placeOfMarriage: z.string().min(1, 'Place of marriage is required'),
  marriageDate: z.date({ required_error: 'Marriage date is required' }),
  groomId: z.string().min(1, 'Groom ID is required'),
  groomWitness: z.string().min(1, 'Groom witness is required'),
  brideId: z.string().min(1, 'Bride ID is required'),
  brideWitness: z.string().min(1, 'Bride witness is required'),
  placeOfStay: z.string().min(1, 'Place of residence is required'),
  groomParentName: z.string().optional(),
  brideParentName: z.string().optional(),
  revMinister: z.string().min(1, 'Rev minister is required'),
  fileUrl: z.string().optional(),
})

export type CreateMarriage = z.infer<typeof createMarriageSchema>

export const updateMarriageSchema = createMarriageSchema.and(
  z.object({
    id: z.string().min(1, 'ID is required'),
  }),
)

export type UpdateMarriage = z.infer<typeof updateMarriageSchema>
