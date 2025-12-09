export type Plan = {
  id: number
  name: string
  validity: number
  allocatedSmsCredits: number
  price: number
  createdDate: string
  createdBy: string
  modifiedDate: string
  modifiedBy: string
  isActive: boolean
}

export type SubscriptionHistory = {
  id: number
  churchId: number
  subscriptionTypeId: number
  subscriptionType: Plan
  subscriptionStartDate: string
  subscriptionEndDate: string
  createdAt: string
  reason: string
  createdDate: string
  createdBy: string
  modifiedDate: string
  modifiedBy: string
  isActive: boolean
}

export type Suscribe = {
  churchId: number
  subscriptionTypeId: number
  channel: string | null
  subscriptionTotal: number | null
}
