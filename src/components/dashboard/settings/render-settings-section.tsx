import { Suspense } from 'react'
import Subscriptions from './subscriptions'
import { ChurchProfileForm } from './church-profile-form'
import type { SettingsTabValue } from '@/lib/types/settings'
import UsersTable from '@/components/dashboard/users/users-table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'

type RenderSettingsSectionProps = {
  tab: SettingsTabValue
}
export const RenderSettingsSection = ({ tab }: RenderSettingsSectionProps) => {
  switch (tab) {
    case 'church-profile':
      return <ChurchProfileForm />
    case 'user-management':
      return (
        <ErrorBoundary level="section">
          <Suspense fallback={<TableSkeleton />}>
            <UsersTable />
          </Suspense>
        </ErrorBoundary>
      )
    case 'subscriptions':
      return <Subscriptions />
  }
}
