// Explicit mapping between values and labels
export type SettingsTabMapping = {
  'church-profile': 'Church Profile'
  setup: 'Setup'
  'user-management': 'User Management'
  subscriptions: 'Subscriptions'
  'sms-credit': 'SMS Credit'
  personalization: 'Personalization'
}

// Derive value and label types from the mapping
export type SettingsTabValue = keyof SettingsTabMapping

export type SettingsTabLabel = SettingsTabMapping[SettingsTabValue]

// Properly typed tab type that infers the correct label for each value
export type SettingsTabType<T extends SettingsTabValue = SettingsTabValue> = {
  label: SettingsTabMapping[T]
  value: T
}
