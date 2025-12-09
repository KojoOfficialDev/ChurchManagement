import { useNavigate, useRouter } from '@tanstack/react-router'
import { Check, ChevronLeft } from 'lucide-react'
import type { Plan } from '@/services/subscriptions/types'
import { formatCurrency } from '@/lib/utils'

export function PricingSection({ plans }: { plans: Array<Plan> }) {
  const router = useRouter()
  const navigate = useNavigate()
  const badgeColors = [
    'bg-emerald-100 text-emerald-600',
    'bg-orange-100 text-orange-500',
    'bg-violet-100 text-violet-700',
  ]
  return (
    <section className="min-h-screen bg-[#7C5CFC] px-4 py-8 md:px-8 lg:px-16">
      {/* Header */}
      <div className="mb-8">
        <button
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#7C5CFC]"
          onClick={() => router.history.back()}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Get more with less
          </h1>
          <p className="text-lg text-white/90">
            Choose your plan that best suit your church
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div key={plan.name} className="rounded-2xl bg-white p-6 shadow-lg">
            {/* Badge Row */}
            <div className="mb-6 flex items-center justify-between">
              <span
                className={`rounded-md px-3 py-1 text-sm font-medium ${badgeColors[index % badgeColors.length]}`}
              >
                {plan.name}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 md:text-5xl">
                  {formatCurrency(plan.price)}
                </span>
                <span className="text-gray-500">/ {plan.validity} days</span>
              </div>
            </div>

            {/* Subscribe Button */}
            {plan.isActive && (
              <div className="mb-4">
                <button
                  className="w-full rounded-full bg-[#4338CA] py-3 font-medium text-white transition hover:bg-[#3730A3]"
                  onClick={() =>
                    navigate({
                      to: '/checkout',
                      search: { planId: plan.id },
                    })
                  }
                >
                  Subscribe
                </button>
              </div>
            )}

            {/* Description */}
            <p className="mb-4 font-medium text-gray-900">
              {plan.allocatedSmsCredits} SMS credits
            </p>

            {/* Features */}
            <div>
              <h3 className="mb-3 font-semibold text-gray-900">Features</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-[#4338CA]">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-gray-700">SMS credits</span>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
