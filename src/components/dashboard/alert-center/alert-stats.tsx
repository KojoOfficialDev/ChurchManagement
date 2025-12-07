import { ArrowUpRightIcon, MessageSquareText } from 'lucide-react'
import { memo, useMemo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PurchaseDialog } from '../sms-bundles/purchase-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { churchProfileQuery } from '@/services/setup/queries'

const iconColors = ['text-purple-600', 'text-yellow-600', 'text-green-600']
export const AlertStats = memo(() => {
  const { data } = useSuspenseQuery(churchProfileQuery)

  const smsStats = useMemo(() => {
    return [
      {
        label: 'Total SMS',
        value: data.smsTotal,
      },
      {
        label: 'Sent SMS',
        value: data.smsBalance,
      },
      {
        label: 'Remaining SMS',
        value: data.smsTotal - data.smsBalance,
      },
    ]
  }, [data])

  return (
    <section className="flex items-end gap-[17px] w-full">
      <div className="grid grid-cols-3 gap-5 flex-1">
        {smsStats.map((stat, index) => (
          <Card key={index} className="border-[#cfd4dc] shadow-none">
            <CardContent className="flex items-start gap-3 p-5">
              <MessageSquareText className={iconColors[index]} />
              <div className="flex flex-col gap-4 flex-1">
                <div className="opacity-70 font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] text-gray-800 text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] [font-style:var(--text-sm-medium-font-style)]">
                  {stat.label}
                </div>
                <div className="font-display-xs-bold font-[number:var(--display-xs-bold-font-weight)] text-gray-800 text-[length:var(--display-xs-bold-font-size)] tracking-[var(--display-xs-bold-letter-spacing)] leading-[var(--display-xs-bold-line-height)] [font-style:var(--display-xs-bold-font-style)]">
                  {stat.value}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="ghost"
        className="h-auto flex items-center gap-2.5 px-3 py-5 rounded-lg"
      >
        <PurchaseDialog>
          <Button
            variant="ghost"
            className="h-auto flex items-center gap-2.5 px-3 py-5 rounded-lg cursor-pointer"
          >
            <span className="[font-family:'Inter',Helvetica] font-medium text-[#4a1fb7] text-base tracking-[0] leading-4 whitespace-nowrap">
              Top-up SMS
            </span>
            <ArrowUpRightIcon className="w-6 h-6" />
          </Button>
        </PurchaseDialog>
      </Button>
    </section>
  )
})
