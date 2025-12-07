export type Church = {
  createdDate: string
  createdBy: string
  modifiedDate: string
  modifiedBy: string
  isActive: boolean
  id: number
  name: string
  code: string
  active: boolean
  sendSms: boolean
  sendBirthdayAlerts: boolean
  sendAnnouncements: boolean
  churchContact: string
  churchEmail: string
  parentChurch: string
  isAnOutStation: boolean
  clientType: string
  smsTotal: number
  smsBalance: number
  lastSubscriptionDate: string
  logoUrl: string
  churchId: number
}

export type ChurchNotificationSettings = {
  sendSms: boolean
  sendAnnouncements: boolean
  sendBirthdayAlerts: boolean
}
