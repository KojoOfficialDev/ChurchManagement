import { z } from 'zod/v3'

const baseEventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional(),
  venue: z.string().nullable().optional(),
  eventDate: z.coerce.date({ required_error: 'Event date is required' }),
  societyId: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
})

const eventWithoutAlertSchema = baseEventSchema.extend({
  addAlert: z.literal(false).default(false),
})

const eventWithAlertSchema = baseEventSchema.extend({
  addAlert: z.literal(true),
  frequency: z.string().min(1, 'Frequency is required when alert is enabled'),
  alertStartDate: z.coerce.date({
    required_error: 'Alert start date is required when alert is enabled',
  }),
})

export const eventSchema = z.discriminatedUnion('addAlert', [
  eventWithoutAlertSchema,
  eventWithAlertSchema,
])

export type Event = z.infer<typeof eventSchema>
export type EventWithoutAlert = z.infer<typeof eventWithoutAlertSchema>
export type EventWithAlert = z.infer<typeof eventWithAlertSchema>

export const updateEventSchema = eventSchema.and(
  z.object({
    id: z.string().min(1, 'ID is required'),
  }),
)

export type UpdateEvent = z.infer<typeof updateEventSchema>
