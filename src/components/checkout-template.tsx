import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  Clock,
  CreditCard,
  Loader2,
  MessageSquare,
} from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Plan } from '@/services/subscriptions/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useSubscriptionsMutations } from '@/services/subscriptions/mutations'
import { formatCurrency } from '@/lib/utils'
import { churchProfileQuery } from '@/services/setup/queries'

export function CheckoutSection({ plan }: { plan: Plan }) {
  const { data } = useSuspenseQuery(churchProfileQuery)
  const navigate = useNavigate()
  const { subscribe } = useSubscriptionsMutations()
  const [useContactNumber, setUseContactNumber] = useState(true)
  const [msisdn, setMsisdn] = useState(() => data.churchContact ?? '')

  useEffect(() => {
    if (useContactNumber) {
      setMsisdn(data.churchContact ?? '')
    }
  }, [data.churchContact, useContactNumber])

  const resolvedMsisdn = useMemo(
    () => (useContactNumber ? (data.churchContact ?? '') : msisdn).trim(),
    [data.churchContact, msisdn, useContactNumber],
  )

  const handleSubscribe = () => {
    subscribe.mutate(
      {
        subscriptionTypeId: plan.id,
        channel: 'Mobile money',
        subscriptionTotal: plan.price,
        Msisdn: resolvedMsisdn,
      },
      {
        onSuccess: (data) => {
          if (data?.data) {
            window.open(
              data?.data?.checkOutUrl ?? data?.data?.checkoutDirectUrl,
              '_blank',
            )
          }
        },
        onError: () => {
          toast.error('Failed to initiate payments')
        },
      },
    )
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#7C5CFC] via-[#6B4FE0] to-[#5A3FCC] px-4 py-8 md:px-8 lg:px-16">
      {/* Header */}
      <div className="mb-8">
        <button
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
          onClick={() => navigate({ to: '/pricing' })}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Complete Your Subscription
          </h1>
          <p className="text-lg text-white/80">
            Review your plan and confirm to get started
          </p>
        </div>
      </div>

      {/* Checkout Card */}
      <div className="mx-auto max-w-lg">
        <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
          <CardHeader className="border-b pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-[#7C5CFC]" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Plan Name */}
            <div className="mb-6">
              <span className="inline-block rounded-full bg-[#7C5CFC]/10 px-4 py-1.5 text-sm font-semibold text-[#7C5CFC]">
                {plan.name} Plan
              </span>
            </div>

            {/* Plan Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Validity</span>
                </div>
                <span className="font-medium text-gray-900">
                  {plan.validity} days
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <MessageSquare className="h-4 w-4" />
                  <span>SMS Credits</span>
                </div>
                <span className="font-medium text-gray-900">
                  {plan.allocatedSmsCredits.toLocaleString()}
                </span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Billing Details */}
            <div className="space-y-4 rounded-xl bg-gray-50 px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    Billing mobile number
                  </p>
                  <p className="text-sm text-gray-500">
                    This Msisdn will be used for mobile money billing.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Checkbox
                    checked={useContactNumber}
                    onCheckedChange={(value) =>
                      setUseContactNumber(Boolean(value))
                    }
                  />
                  Use church contact
                </label>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="billing-msisdn"
                  className="text-sm text-gray-700"
                >
                  Mobile number (Msisdn)
                </Label>
                <Input
                  id="billing-msisdn"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={msisdn}
                  onChange={(event) => setMsisdn(event.target.value)}
                  disabled={useContactNumber}
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-[#7C5CFC]">
                {formatCurrency(plan.price)}
              </span>
            </div>

            {/* Subscribe Button */}
            <Button
              onClick={handleSubscribe}
              disabled={subscribe.isPending || !resolvedMsisdn}
              className="mt-8 h-12 w-full rounded-full bg-[#4338CA] text-base font-medium text-white transition hover:bg-[#3730A3]"
            >
              {subscribe.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Subscription'
              )}
            </Button>

            {/* Back Link */}
            <p className="mt-4 text-center text-sm text-gray-500">
              Changed your mind?{' '}
              <button
                onClick={() => navigate({ to: '/pricing' })}
                className="font-medium text-[#7C5CFC] hover:underline"
              >
                View other plans
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
