import { z } from 'zod/v3'

const baseContributionTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  isActive: z.boolean().default(true),
  paymentType: z.string().min(1, 'Payment type is required'),
  active: z.boolean().default(true),
})

const campaignContributionSchema = z.discriminatedUnion('isCampaign', [
  z.object({
    isCampaign: z.literal(false),
  }),
  z.object({
    isCampaign: z.literal(true),
    fundRaisingGoal: z.string().min(1, 'Fundraising theme is required'),
    startDate: z.date({ required_error: 'Start date is required' }),
    endDate: z.date({ required_error: 'End date is required' }),
    initialAmount: z.number().min(0, 'Target amount is required'),
  }),
])

export const contributionTypeSchema = baseContributionTypeSchema.and(
  campaignContributionSchema,
)

// contributions
export const contributionSchema = z.object({
  isActive: z.boolean().default(true),
  active: z.boolean().default(true),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  contributionTypeId: z.coerce
    .number()
    .min(1, 'Contribution type id is required'),
  amount: z.number().min(0, 'Amount is required'),
  channel: z.string().min(1, 'Channel is required'),
  reference: z.string().min(1, 'Reference is required'),
  taxDeductable: z.boolean().default(true),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  paymentDate: z.date({ required_error: 'Payment date is required' }),
})

export const updateContributionTypeSchema = contributionTypeSchema.and(
  z.object({
    id: z.string().min(1, 'ID is required'),
  }),
)

export const updateContributionSchema = contributionSchema.and(
  z.object({
    id: z.string().min(1, 'ID is required'),
  }),
)

export type ContributionType = z.infer<typeof contributionTypeSchema>
export type Contribution = z.infer<typeof contributionSchema>
export type UpdateContributionType = z.infer<
  typeof updateContributionTypeSchema
>
export type UpdateContribution = z.infer<typeof updateContributionSchema>
