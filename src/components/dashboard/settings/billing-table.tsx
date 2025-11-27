import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { subscriptionHistoryQueryOptions } from '@/services/subscriptions/queries'
import { SubscriptionsService } from '@/services/subscriptions/subscriptions.service'
import type { SubscriptionHistory } from '@/services/subscriptions/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { DownloadIcon } from 'lucide-react'

export const BillingTable = () => {
  const { data: subscriptionHistory } = useSuspenseQuery(
    subscriptionHistoryQueryOptions(),
  )
  const { exportToExcel, isExporting } = useExcelExport<SubscriptionHistory>({
    fetchData: () => SubscriptionsService.getSubsriptionHistory(),
    columns: [
      {
        header: 'Purchase Date',
        accessor: (item) => format(new Date(item.createdDate), 'MMM dd, yyyy'),
      },
      {
        header: 'Subscription Start Date',
        accessor: (item) =>
          format(new Date(item.subscriptionStartDate), 'MMM dd, yyyy'),
      },
      {
        header: 'Subscription End Date',
        accessor: (item) =>
          format(new Date(item.subscriptionEndDate), 'MMM dd, yyyy'),
      },
      {
        header: 'Amount (GHS)',
        accessor: (item) => formatCurrency(item.subscriptionType.price),
      },
      {
        header: 'Plan',
        accessor: (item) => item.subscriptionType.name,
      },
      {
        header: 'Status',
        accessor: (item) => (item.isActive ? 'Active' : 'Inactive'),
      },
    ],
    filename: 'billing-history',
  })
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <div className="flex items-center justify-end w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={exportToExcel}
          disabled={isExporting}
        >
          <DownloadIcon className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </div>
      <section className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-white rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <header className="flex items-center justify-between w-full bg-white border-b border-solid border-[#eaecf0] px-6 py-5">
            <h2 className="font-bold text-gray-800 text-xl leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
              Billing history
            </h2>
          </header>

          <div className="w-full bg-white overflow-x-auto p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fbfcfc] border-b border-[#eaecf0] hover:bg-[#fbfcfc]">
                  <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                    Purchase Date
                  </TableHead>
                  <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                    Subscription Start Date
                  </TableHead>
                  <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                    Subscription End Date
                  </TableHead>
                  <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                    Amount (GHS)
                  </TableHead>
                  <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                    Plan
                  </TableHead>
                  <TableHead className="font-medium text-gray-800 text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0]">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionHistory.map((row, index) => (
                  <TableRow key={index} className="border-b border-[#eaecf0]">
                    <TableCell className="font-normal text-gray-800 text-xs leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
                      {format(new Date(row.createdDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-normal text-gray-800 text-xs leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
                      {format(
                        new Date(row.subscriptionStartDate),
                        'MMM dd, yyyy',
                      )}
                    </TableCell>
                    <TableCell className="font-normal text-gray-800 text-xs leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
                      {format(
                        new Date(row.subscriptionEndDate),
                        'MMM dd, yyyy',
                      )}
                    </TableCell>
                    <TableCell className="font-normal text-gray-800 text-xs leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
                      {formatCurrency(row.subscriptionType.price)}
                    </TableCell>
                    <TableCell className="font-normal text-gray-800 text-xs leading-5 [font-family:'Inter',Helvetica] tracking-[0]">
                      {row.subscriptionType.name}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#ebfdf2] text-[#037847] hover:bg-[#ebfdf2] font-medium text-xs leading-[18px] [font-family:'Inter',Helvetica] tracking-[0] rounded-2xl px-2 py-0.5">
                        {row.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  )
}
