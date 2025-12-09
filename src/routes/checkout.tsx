import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { CheckoutSection } from '@/components/checkout-template'
import { plansQueryOptions } from '@/services/subscriptions/queries'

const checkoutSearchSchema = z.object({
  planId: z.number(),
})

export const Route = createFileRoute('/checkout')({
  component: RouteComponent,
  validateSearch: checkoutSearchSchema,
})

function RouteComponent() {
  const { planId } = Route.useSearch()
  const { data: plans } = useSuspenseQuery(plansQueryOptions())
  const plan = plans.find((p) => p.id === planId)

  if (!plan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#7C5CFC]">
        <p className="text-lg text-white">Plan not found</p>
      </div>
    )
  }

  return <CheckoutSection plan={plan} />
}
