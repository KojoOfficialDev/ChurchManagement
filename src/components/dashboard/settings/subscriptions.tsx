import { CurrentSubscriptionSection } from '@/components/dashboard/settings/current-subscription'
import { BillingTable } from '@/components/dashboard/settings/billing-table'

const Subscriptions = () => {
  return (
    <div>
      <CurrentSubscriptionSection />
      <BillingTable />
    </div>
  )
}

export default Subscriptions
