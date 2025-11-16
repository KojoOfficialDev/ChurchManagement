import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { Suspense, memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSidebar } from '@/lib/contexts/sidebar.context'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { alertMessagesOptions } from '@/services/alerts/queries'
import { Pagination } from '@/components/ui/pagination'
import { ErrorBoundary } from '@/components/error-boundary'
import { ButtonSkeleton } from '@/components/skeletons/button-skeleton'
import { EmptyComponent } from '@/components/empty-component'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useAlertsMutations } from '@/services/alerts/mutations'
import { AlertDialogComponent } from '@/components/alert-dialog'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { AlertsService } from '@/services/alerts/alerts.service'
import AlertLogDetails from './alert-log-details'
import EditAlertLogDialog from './edit-alert-log-dialog'

const AlertLogTable = memo(() => {
  const {
    removeAlertMessage: { mutateAsync, isPending },
  } = useAlertsMutations()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const { data: alertMessagesResponse } = useSuspenseQuery(
    alertMessagesOptions({ page, pageSize, search: debouncedSearch }),
  )
  const { isOpen } = useSidebar()
  const [selectedMessages, setSelectedMessages] = useState<Array<string>>([])
  const [editingMessage, setEditingMessage] = useState<any>(null)
  const [viewingMessage, setViewingMessage] = useState<any>(null)

  const messages = useMemo(
    () => alertMessagesResponse.data || [],
    [alertMessagesResponse],
  )

  const { exportToExcel, isExporting } = useExcelExport({
    fetchData: AlertsService.getAllMessage,
    columns: [
      { header: 'ID', accessor: (item: any) => item.id },
      {
        header: 'Recipient Name',
        accessor: (item: any) => item.recipientName || '-',
      },
      {
        header: 'Phone Number',
        accessor: (item: any) => item.phoneNumber || '-',
      },
      {
        header: 'Message',
        accessor: (item: any) => item.message || '-',
      },
      {
        header: 'Message Type',
        accessor: (item: any) => item.messageType || '-',
      },
      {
        header: 'Status',
        accessor: (item: any) => item.status || '-',
      },
      {
        header: 'Delivery Status',
        accessor: (item: any) => item.deliveryStatus || '-',
      },
      {
        header: 'Sent Date',
        accessor: (item: any) =>
          item.sentDate
            ? format(new Date(item.sentDate), 'MMM dd, yyyy HH:mm')
            : '-',
      },
      {
        header: 'Created Date',
        accessor: (item: any) =>
          item.createdDate
            ? format(new Date(item.createdDate), 'MMM dd, yyyy HH:mm')
            : '-',
      },
    ],
    filename: 'alert-messages',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedMessages.includes(id)) {
        setSelectedMessages((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedMessages((prev) => [...prev, id])
      }
    },
    [selectedMessages],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedMessages(messages.map((message) => message.id.toString()))
  }, [messages])

  const handleDeselectAll = useCallback(() => {
    setSelectedMessages([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedMessages.length === messages.length && messages.length > 0,
    [selectedMessages, messages],
  )

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [isAllSelected, handleSelectAll, handleDeselectAll])

  if (messages.length === 0 && !debouncedSearch) {
    return (
      <EmptyComponent
        title="No alert messages found"
        description="No alert messages have been sent yet"
        buttonText=""
        buttonOnClick={<></>}
        media={
          <img
            src="/image-3.svg"
            alt="No messages found"
            className="w-full h-full"
          />
        }
      />
    )
  }

  return (
    <section className="flex flex-col w-full items-start gap-6">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
          Alert Log
        </h1>
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">All Messages</h2>

            <div className="flex items-center gap-4">
              <div className="flex items-start gap-2">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Search..."
                    className="border-gray-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                </InputGroup>

                {selectedMessages.length > 1 && (
                  <Button
                    variant="destructive"
                    size={isOpen ? 'icon' : 'default'}
                  >
                    <Trash2Icon className="w-5 h-5" />
                    {!isOpen && (
                      <span className="font-medium text-sm">Delete</span>
                    )}
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
            {messages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#fbfcfc] border-b border-[#eaecf0] hover:bg-[#fbfcfc]">
                    <TableHead className="w-[75px] px-6 py-3">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleSelectAll}
                        className="cursor-pointer"
                      />
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Recipient
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Phone Number
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Message
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Type
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Status
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Sent Date
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow
                      key={message.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedMessages.includes(
                            message.id.toString(),
                          )}
                          onCheckedChange={() =>
                            toggleSelect(message.id.toString())
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {message.recipientName || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {message.phoneNumber || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3 max-w-[300px]">
                        <span className="font-normal text-gray-800 text-xs line-clamp-2">
                          {message.message || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {message.messageType || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {message.status || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-[11px]">
                        <span className="font-normal text-gray-800 text-xs">
                          {message.sentDate
                            ? format(new Date(message.sentDate), 'MMM dd, yyyy')
                            : '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-auto w-auto p-0"
                            >
                              <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[149px] bg-[#ffffff] rounded-xl border border-solid border-[#ececec] shadow-[0px_24px_48px_-12px_#0f172814] p-3"
                          >
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() => setViewingMessage(message)}
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() => setEditingMessage(message)}
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                Edit
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <AlertDialogComponent
                                title="Remove Alert Message"
                                description="Are you sure you want to remove this alert message?"
                                onConfirm={() => {
                                  mutateAsync(message.id.toString())
                                }}
                                disabled={isPending}
                                variant="destructive"
                                confirmText="Remove"
                                cancelText="Cancel"
                              >
                                <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-red-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                  Remove
                                </span>
                              </AlertDialogComponent>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="font-medium text-xs py-4 px-2 text-muted-foreground">
                  No records found matching your search "{debouncedSearch}"
                </span>
              </div>
            )}
          </div>
        </div>
        {alertMessagesResponse.totalCount > 0 && (
          <Pagination
            currentPage={alertMessagesResponse.page}
            pageSize={alertMessagesResponse.pageSize}
            totalCount={alertMessagesResponse.totalCount}
            totalPages={alertMessagesResponse.totalPages}
            hasPrevious={alertMessagesResponse.hasPrevious}
            hasNext={alertMessagesResponse.hasNext}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {editingMessage && (
        <EditAlertLogDialog
          message={editingMessage}
          open={!!editingMessage}
          onOpenChange={(open) => !open && setEditingMessage(null)}
        />
      )}

      {viewingMessage && (
        <AlertLogDetails
          message={viewingMessage}
          open={!!viewingMessage}
          onOpenChange={(open) => !open && setViewingMessage(null)}
        />
      )}
    </section>
  )
})

AlertLogTable.displayName = 'AlertLogTable'
export default AlertLogTable

