import { DownloadIcon, CalendarIcon } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSidebar } from '@/lib/contexts/sidebar.context'
import { getPurchaseHistoriesOptions } from '@/services/sms-bundles/queries'
import { formatCurrency } from '@/lib/utils'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { SmsBundlesService } from '@/services/sms-bundles/smsbundles.service'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { PurchaseHistory } from '@/services/sms-bundles/types'

const PurchaseHistories = memo(() => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const { isOpen } = useSidebar()

  // Convert dates to ISO strings for API
  const startDateString = startDate
    ? startDate.toISOString().split('T')[0]
    : undefined
  const endDateString = endDate
    ? endDate.toISOString().split('T')[0]
    : undefined

  const { data: purchaseHistories = [] } = useSuspenseQuery(
    getPurchaseHistoriesOptions({
      startDate: startDateString,
      endDate: endDateString,
    }),
  )

  const { exportToExcel, isExporting } = useExcelExport<PurchaseHistory>({
    fetchData: async () => {
      return await SmsBundlesService.getPurchaseHistory({
        startDate: startDateString,
        endDate: endDateString,
      })
    },
    columns: [
      { header: 'ID', accessor: (item) => item.id },
      {
        header: 'Purchase Date',
        accessor: (item) =>
          item.purchaseDate
            ? format(new Date(item.purchaseDate), 'MMM dd, yyyy')
            : '-',
      },
      {
        header: 'SMS Purchased',
        accessor: (item) => item.smsPurchased.toLocaleString(),
      },
      {
        header: 'Amount Paid',
        accessor: (item) => formatCurrency(item.amountPaid),
      },
      {
        header: 'Transaction Reference',
        accessor: (item) => item.transactionReference || '-',
      },
      {
        header: 'Payment Method',
        accessor: (item) => item.paymentMethod || '-',
      },
      {
        header: 'Bundle Name',
        accessor: (item) => item.bundle.name || '-',
      },
      { header: 'Bundle ID', accessor: (item) => item.bundle.id },
      {
        header: 'Church Name',
        accessor: (item) => item.church?.name || '-',
      },
    ],
    filename: 'purchase-histories',
  })

  const clearFilters = useCallback(() => {
    setStartDate(undefined)
    setEndDate(undefined)
  }, [])

  const hasActiveFilters = useMemo(
    () => startDate !== undefined || endDate !== undefined,
    [startDate, endDate],
  )

  if (purchaseHistories.length === 0 && !hasActiveFilters) {
    return (
      <section className="flex flex-col w-full items-start gap-6">
        <header className="flex items-center justify-between w-full">
          <h2 className="text-gray-800 font-text-lg-bold text-lg font-semibold">
            Purchase Histories
          </h2>
        </header>
        <div className="border-t w-full">
          <div className="flex items-center justify-center w-full py-12">
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-gray-800 font-semibold text-lg">
                No purchase histories found
              </h3>
              <p className="text-gray-500 text-sm">
                Purchase histories will appear here once you make your first SMS
                bundle purchase
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col w-full items-start gap-6">
      <header className="flex items-center justify-between w-full">
        <h2 className="text-gray-800 font-text-lg-bold text-lg font-semibold">
          Purchase Histories
        </h2>
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h3 className="text-gray-600 font-bold text-xl">
              All Purchase Histories
            </h3>

            <div className="flex items-center gap-4">
              <div className="flex items-start gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'text-muted-foreground justify-between',
                        startDate && 'text-black dark:text-white',
                      )}
                    >
                      {startDate
                        ? format(startDate, 'MMM dd, yyyy')
                        : 'Start Date'}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'text-muted-foreground justify-between',
                        endDate && 'text-black dark:text-white',
                      )}
                    >
                      {endDate ? format(endDate, 'MMM dd, yyyy') : 'End Date'}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>

                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                size={isOpen ? 'icon' : 'default'}
                onClick={exportToExcel}
                disabled={isExporting}
              >
                <DownloadIcon className="w-5 h-5" />
                {!isOpen && (
                  <span className="font-medium text-sm">
                    {isExporting ? 'Exporting...' : 'Export'}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            {purchaseHistories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#fbfcfc] border-b border-[#eaecf0] hover:bg-[#fbfcfc]">
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Purchase Date
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        SMS Purchased
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Amount Paid
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Transaction Reference
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Payment Method
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Bundle Name
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseHistories.map((history) => (
                    <TableRow
                      key={history.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {history.purchaseDate
                            ? format(
                                new Date(history.purchaseDate),
                                'MMM dd, yyyy',
                              )
                            : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {history.smsPurchased.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {formatCurrency(history.amountPaid)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {history.transactionReference || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {history.paymentMethod || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {history.bundle.name || '-'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center w-full h-full py-8">
                <span className="font-medium text-xs text-muted-foreground">
                  No purchase histories found for the selected date range
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})

PurchaseHistories.displayName = 'PurchaseHistories'
export default PurchaseHistories
