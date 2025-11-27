import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/text-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getSmsBundlesOptions } from '@/services/sms-bundles/queries'
import { useSmsBundlesMutations } from '@/services/sms-bundles/mutations'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm, Controller } from 'react-hook-form'
import { Suspense, useState, type ReactNode } from 'react'
import {
  purchaseSmsBundleSchema,
  type PurchaseSmsBundle,
} from '@/services/sms-bundles/smsBundles.dto'
import { formatCurrency } from '@/lib/utils'

// Skeleton for loading state
const PurchaseFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

// Form component that uses useSuspenseQuery
const PurchaseForm = ({ onClose }: { onClose: () => void }) => {
  const { data: bundles } = useSuspenseQuery(getSmsBundlesOptions())
  const { purchaseSmsBundle } = useSmsBundlesMutations()

  const form = useForm<PurchaseSmsBundle>({
    resolver: standardSchemaResolver(purchaseSmsBundleSchema),
    defaultValues: {
      bundleId: '',
      paymentMethod: 'Mobile Money',
      transactionReference: '',
    },
  })

  const onSubmit = async (data: PurchaseSmsBundle) => {
    await purchaseSmsBundle.mutateAsync({
      bundleId: data.bundleId,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
    })
    form.reset()
    onClose()
  }

  const activeBundles = bundles.filter((bundle) => bundle.active)

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {/* Bundle Selection */}
      <div className="space-y-2">
        <Label htmlFor="bundleId">Select Bundle</Label>
        <Controller
          control={form.control}
          name="bundleId"
          render={({ field, fieldState: { error } }) => (
            <div>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={purchaseSmsBundle.isPending}
              >
                <SelectTrigger
                  id="bundleId"
                  className="w-full h-12 bg-white border-[#dadada]"
                  aria-invalid={!!error}
                >
                  <SelectValue placeholder="Choose an SMS bundle" />
                </SelectTrigger>
                <SelectContent>
                  {activeBundles.map((bundle) => (
                    <SelectItem
                      key={bundle.id}
                      value={bundle.id.toString()}
                      className="flex flex-col gap-1"
                    >
                      {bundle.name}
                      <span className="text-xs text-gray-500">
                        sms allocation:
                      </span>
                      {bundle.smsAllocation} SMS
                      <span className="text-xs text-gray-500">amount:</span>
                      {formatCurrency(bundle.amount)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && (
                <p className="text-sm text-destructive pt-0.5 px-2">
                  {error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Payment Method */}
      <TextInput
        control={form.control}
        name="paymentMethod"
        label="Payment Method"
        placeholder="Mobile Money"
        disabled={purchaseSmsBundle.isPending}
        error={form.formState.errors.paymentMethod?.message}
      />

      {/* Transaction Reference */}
      <TextInput
        control={form.control}
        name="transactionReference"
        label="Transaction Reference"
        placeholder="Enter Mobile Money transaction reference"
        disabled={purchaseSmsBundle.isPending}
        error={form.formState.errors.transactionReference?.message}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={purchaseSmsBundle.isPending}
        className="w-full"
      >
        {purchaseSmsBundle.isPending ? 'Processing...' : 'Purchase Bundle'}
      </Button>
    </form>
  )
}

export const PurchaseDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase SMS Bundle</DialogTitle>
        </DialogHeader>
        <Suspense fallback={<PurchaseFormSkeleton />}>
          <PurchaseForm onClose={() => setOpen(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}
