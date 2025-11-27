import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { subscriptionQueryOptions } from '@/services/subscriptions/queries'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useMemo } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const CurrentSubscriptionSection = () => {
  const {
    data: subscription,
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery(subscriptionQueryOptions())

  const isFreePlan = useMemo(() => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        return true
      }
      return false
    }
    return false
  }, [subscription, error, isLoading])

  if (isLoading) {
    return (
      <section className="flex flex-col items-start gap-6 w-full py-8">
        <div className="flex flex-col items-start gap-[18px] w-full">
          <Skeleton className="h-8 w-48" />
          <Card className="w-full bg-white rounded-3xl border-solid border-[#cfd4dc] shadow-none border-0">
            <CardContent className="flex items-start gap-12 p-10">
              <div className="flex flex-col items-start gap-[23px] flex-1">
                <Skeleton className="h-10 w-24 rounded-full" />
                <div className="flex items-center justify-between w-full">
                  <div className="relative w-[308px] h-[101.24px]">
                    <Skeleton className="h-20 w-[304px]" />
                    <Skeleton className="absolute top-[73px] left-[229px] h-7 w-16" />
                  </div>
                  <Skeleton className="h-[38px] w-[99px] rounded-[100px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }
  if (isError && !isFreePlan) {
    return (
      <section className="flex flex-col items-start gap-6 w-full py-8">
        <div className="flex flex-col items-start gap-[18px] w-full">
          <h2 className="w-full mt-[-1.00px] font-[number:var(--text-xl-bold-font-weight)] text-gray-800 text-[length:var(--text-xl-bold-font-size)] leading-[var(--text-xl-bold-line-height)] flex items-center justify-start font-text-xl-bold tracking-[var(--text-xl-bold-letter-spacing)] [font-style:var(--text-xl-bold-font-style)]">
            Current Subscription
          </h2>
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load subscription</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                {error instanceof AxiosError
                  ? error.response?.data?.message ||
                    error.message ||
                    'Unable to load your subscription information. Please try again.'
                  : 'An unexpected error occurred while loading your subscription.'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }
  return (
    <section className="flex flex-col items-start gap-6 w-full py-8">
      <div className="flex flex-col items-start gap-[18px] w-full">
        <h2 className="w-full mt-[-1.00px] font-[number:var(--text-xl-bold-font-weight)] text-gray-800 text-[length:var(--text-xl-bold-font-size)] leading-[var(--text-xl-bold-line-height)] flex items-center justify-start font-text-xl-bold tracking-[var(--text-xl-bold-letter-spacing)] [font-style:var(--text-xl-bold-font-style)]">
          Current Subscription
        </h2>

        <Card className="w-full bg-white rounded-3xl border-solid border-[#cfd4dc] shadow-none border-0">
          <CardContent className="flex items-start gap-12 p-10">
            <div className="flex flex-col items-start gap-[23px] flex-1">
              <Badge className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#f7900914] rounded-full hover:bg-[#f7900914] h-auto">
                <span className="w-fit font-medium text-[#f79009] text-xl text-center leading-8 whitespace-nowrap [font-family:'Inter',Helvetica] tracking-[0]">
                  {isFreePlan ? 'Free' : 'Standard'}
                </span>
              </Badge>

              <div className="flex items-center justify-between w-full">
                <div className="relative w-[308px] h-[101.24px]">
                  <div className="absolute top-0 left-0 w-[304px] h-20 flex items-center justify-center [font-family:'Inter',Helvetica] font-bold text-[#1e1e1e] text-5xl tracking-[0] leading-[80px]">
                    {isFreePlan ? 'GH₵0.00' : 'GH₵1,400'}
                  </div>

                  <div className="absolute top-[73px] left-[229px] h-7 font-[number:var(--text-lg-medium-font-weight)] text-[#667084] text-[length:var(--text-lg-medium-font-size)] leading-[var(--text-lg-medium-line-height)] whitespace-nowrap flex items-center justify-center font-text-lg-medium tracking-[var(--text-lg-medium-letter-spacing)] [font-style:var(--text-lg-medium-font-style)]">
                    /Month
                  </div>
                </div>

                <Button
                  variant="outline"
                  asChild
                  className="w-[99px] h-[38px] gap-[2.97px] px-[14.83px] py-3 rounded-[100px] border-[0.74px] border-solid border-[#4a1fb7] bg-transparent hover:bg-transparent"
                >
                  <Link to="/pricing">
                    <span className="[font-family:'Inter',Helvetica] font-semibold text-[#4a1fb7] text-base tracking-[0] leading-6 whitespace-nowrap">
                      Change
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
