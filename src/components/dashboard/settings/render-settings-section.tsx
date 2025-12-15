import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ChurchProfileFormSkeleton } from '../../skeletons/church-profile-form.skeleton'
import { PersonalizationSkeleton } from '../../skeletons/personalization-skeleton'
import Subscriptions from './subscriptions'
import { ChurchProfileForm } from './church-profile-form'
import SetupTabs from './setup/setup-tabs'
import { Personalization } from './personalization'
import type { SettingsTabValue } from '@/lib/types/settings'
import UsersTable from '@/components/dashboard/users/users-table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'
import SmsManagement from '@/components/dashboard/settings/sms-management'
import { sessionOptions } from '@/services/auth/queries'
import { SETTINGS_TABS } from '@/lib/constants'

type RenderSettingsSectionProps = {
  tab: SettingsTabValue
}
export const RenderSettingsSection = ({ tab }: RenderSettingsSectionProps) => {
  const { data } = useSuspenseQuery(sessionOptions)

  // Check if user has permission to access this tab
  const tabConfig = SETTINGS_TABS.find((t) => t.value === tab)
  const hasPermission =
    !tabConfig?.roles ||
    tabConfig.roles.length === 0 ||
    tabConfig.roles.some((role) => data.roles.includes(role))

  if (!hasPermission) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          You don't have permission to access this section.
        </p>
      </div>
    )
  }
  switch (tab) {
    case 'church-profile':
      return (
        <ErrorBoundary level="section">
          <Suspense fallback={<ChurchProfileFormSkeleton />}>
            <ChurchProfileForm />
          </Suspense>
        </ErrorBoundary>
      )
    case 'setup':
      return <SetupTabs />
    case 'user-management':
      return (
        <ErrorBoundary level="section">
          <Suspense fallback={<TableSkeleton />}>
            <UsersTable />
          </Suspense>
        </ErrorBoundary>
      )
    case 'subscriptions':
      return (
        <ErrorBoundary level="section">
          <Suspense fallback={<TableSkeleton />}>
            <Subscriptions />
          </Suspense>
        </ErrorBoundary>
      )
    case 'sms-credit':
      return <SmsManagement />
    case 'personalization':
      return (
        <main className="p-6 max-w-2xl">
          <ErrorBoundary level="section">
            <Suspense fallback={<PersonalizationSkeleton />}>
              <Personalization />
            </Suspense>
          </ErrorBoundary>
        </main>
      )
  }
}
