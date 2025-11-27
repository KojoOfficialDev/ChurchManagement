import type { Church } from '../setup/types'

export type SmsBundle = {
  id: number
  name: string | null
  smsAllocation: number
  active: boolean
  amount: number
}
export type PurchaseHistory = {
  id: number
  church: Church
  bundle: SmsBundle
  purchaseDate: string
  smsPurchased: number
  amountPaid: number
  transactionReference: string | null
  paymentMethod: string | null
}
