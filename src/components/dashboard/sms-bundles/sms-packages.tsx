import { Button } from '@/components/ui/button'
import { useSuspenseQuery } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'
import { getSmsBundlesOptions } from '@/services/sms-bundles/queries'
import { formatCurrency } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import type { PurchaseSmsBundle } from '@/services/sms-bundles/smsBundles.dto'
import { useSmsBundlesMutations } from '@/services/sms-bundles/mutations'

export const SMSPackages = () => {
  const { data } = useSuspenseQuery(getSmsBundlesOptions())
  const activeBundles = data.filter((bundle) => bundle.active)
  return (
    <div className="space-y-4 mt-8">
      <div>
        <h3 className="text-gray-800 font-semibold text-xl">Buy SMS Credit</h3>
        <p className="text-gray-500 text-sm">Top-up your SMS credit </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeBundles.map((bundle) => (
          <div
            key={bundle.id}
            className="border border-gray-200 bg-white rounded-lg p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-full">
                <MessageCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {bundle.smsAllocation.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">SMS credit</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(bundle.amount)}
              </span>
              <ConfirmationDialog
                bundleId={bundle.id}
                allocation={bundle.smsAllocation}
                amount={bundle.amount}
              >
                <Button
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary/10 hover:text-primary rounded-full px-6 bg-transparent"
                >
                  Buy
                </Button>
              </ConfirmationDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default SMSPackages

function ConfirmationDialog({
  children,
  allocation,
  amount,
  bundleId,
}: {
  children: React.ReactNode
  allocation: number
  amount: number
  bundleId: number
}) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<PurchaseSmsBundle>({
    bundleId: bundleId.toString(),
    paymentMethod: 'Mobile Money',
    transactionReference: '',
  })
  const {
    purchaseSmsBundle: { mutateAsync, isPending },
  } = useSmsBundlesMutations()
  const onSubmit = async () => {
    await mutateAsync(data)
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogDescription>
            You are about to purchase {allocation} SMS credit for{' '}
            {formatCurrency(amount)}.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Enter transaction reference"
          value={data.transactionReference}
          onChange={(e) =>
            setData({ ...data, transactionReference: e.target.value })
          }
        />
        <Button
          onClick={onSubmit}
          className="w-full"
          disabled={!data.transactionReference || isPending}
        >
          {isPending ? 'Purchasing...' : 'Purchase Bundle'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
