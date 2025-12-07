import { createFileRoute } from '@tanstack/react-router'
import { PricingSection } from '@/components/pricing-template'
import { plansQueryOptions } from '@/services/subscriptions/queries'

export const Route = createFileRoute('/pricing')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(plansQueryOptions())
  },
})

function RouteComponent() {
  const plans = Route.useLoaderData()
  return <PricingSection plans={plans} />
}
