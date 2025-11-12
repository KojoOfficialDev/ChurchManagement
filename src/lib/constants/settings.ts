import type { SettingsTabType } from '../types/settings'

export const SETTINGS_TABS: Array<SettingsTabType> = [
  {
    label: 'Church Profile',
    value: 'church-profile',
  },
  {
    label: 'Setup',
    value: 'setup',
  },
  {
    label: 'User Management',
    value: 'user-management',
  },
  {
    label: 'Subscriptions',
    value: 'subscriptions',
  },
  {
    label: 'SMS Credit',
    value: 'sms-credit',
  },
  {
    label: 'Personalization',
    value: 'personalization',
  },
]

export const SETTINGS_TABS_VALUES = SETTINGS_TABS.map((tab) => tab.value)
