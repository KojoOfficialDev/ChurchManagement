import type { SettingsTabType } from '../types/settings'

export const SETTINGS_TABS: Array<SettingsTabType> = [
  {
    label: 'Church Profile',
    value: 'church-profile',
    roles: ['Administrator'],
  },
  {
    label: 'Setup',
    value: 'setup',
  },
  {
    label: 'User Management',
    value: 'user-management',
    roles: ['Administrator'],
  },
  {
    label: 'Subscriptions',
    value: 'subscriptions',
    roles: ['Administrator'],
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
