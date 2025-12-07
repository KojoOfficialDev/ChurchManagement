import { Suspense } from 'react'
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

type RenderSettingsSectionProps = {
  tab: SettingsTabValue
}
export const RenderSettingsSection = ({ tab }: RenderSettingsSectionProps) => {
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
