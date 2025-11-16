import z from 'zod/v3'

export const alertTemplateSchema = z.object({
  isActive: z.boolean().default(true),
  name: z.string().nullable().optional(),
  message: z.string().min(1, 'Template message is missing'),
  active: z.boolean().default(true),
})

export const alertMessageSchema = z
  .object({
    message: z.string().min(1, 'Message is required'),
    memberId: z.coerce.number().nullable().optional(),
    societyIds: z.array(z.coerce.number()).nullable().optional(),
  })
  .refine(
    (data) => {
      if (
        data.memberId &&
        data?.societyIds?.length &&
        data?.societyIds?.length > 0
      ) {
        return false
      }
      return true
    },
    {
      path: ['memberId', 'societyIds'],
      message: 'You cannot select both member and society',
    },
  )

export type CreateAlertTemplate = z.infer<typeof alertTemplateSchema>
export type CreateAlertMessage = z.infer<typeof alertMessageSchema>
