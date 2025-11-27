import { z } from 'zod/v3'

export const purchaseSmsBundleSchema = z.object({
  bundleId: z.string().min(1, 'Bundle id is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  transactionReference: z.string().min(1, 'Payment reference is required'),
})

export type PurchaseSmsBundle = z.infer<typeof purchaseSmsBundleSchema>
