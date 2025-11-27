import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { AlertStatsSkeleton } from '@/components/skeletons/alert-stats-skeleton'
import { SMSPackagesSkeleton } from '@/components/skeletons/sms-packages-skeleton'
import { AlertStats } from '../alert-center/alert-stats'
import SMSPackages from '../sms-bundles/sms-packages'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'
import PurchaseHistories from '../sms-bundles/purchase-histories'

const SmsManagement = () => {
  return (
    <div>
      <section className="w-full space-y-4 mt-5">
        <h3 className="text-gray-800 font-semibold text-xl">
          Your Credit Balance
        </h3>
        <Suspense fallback={<AlertStatsSkeleton />}>
          <ErrorBoundary level="component">
            <AlertStats />
          </ErrorBoundary>
        </Suspense>
      </section>
      <section className="w-full space-y-4 mt-5">
        <Suspense fallback={<SMSPackagesSkeleton />}>
          <ErrorBoundary level="component">
            <SMSPackages />
          </ErrorBoundary>
        </Suspense>
      </section>
      <section className="w-full space-y-4 mt-5">
        <Suspense fallback={<TableSkeleton />}>
          <ErrorBoundary level="component">
            <PurchaseHistories />
          </ErrorBoundary>
        </Suspense>
      </section>
    </div>
  )
}

export default SmsManagement
