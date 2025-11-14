import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import AddEventDialog from './add-event-dialog'
import EditEventDialog from './edit-event-dialog'
import EventDetails from './event-details'
import type { EventData } from '@/services/events/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { eventsQueryOptions } from '@/services/events/queries'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { eventsMutations } from '@/services/events/mutations'
import { AlertDialogComponent } from '@/components/alert-dialog'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { EventsService } from '@/services/events/events.service'

export const EventsListSection = memo(() => {
  const {
    removeEvent: { mutateAsync, isPending },
  } = eventsMutations()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [selectedEvents, setSelectedEvents] = useState<Array<string>>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [viewingEvent, setViewingEvent] = useState<any>(null)

  const { data: eventsData } = useSuspenseQuery(
    eventsQueryOptions({ page, pageSize, search: debouncedSearch }),
  )

  const events = useMemo(() => eventsData.data, [eventsData])

  const { exportToExcel, isExporting } = useExcelExport<EventData>({
    fetchData: EventsService.getAllEvents,
    columns: [
      { header: 'ID', accessor: (item) => item.id },
      { header: 'Event Name', accessor: (item) => item.name },
      { header: 'Description', accessor: (item) => item.description || '-' },
      {
        header: 'Society Name',
        accessor: (item) => item.society?.name ?? 'General',
      },
      { header: 'Society ID', accessor: (item) => item.society?.id || '-' },
      { header: 'Venue', accessor: (item) => item.venue || '-' },
      {
        header: 'Event Date',
        accessor: (item) => format(new Date(item.eventDate), 'MMM dd, yyyy'),
      },
      {
        header: 'Is Active',
        accessor: (item) => (item.isActive ? 'Yes' : 'No'),
      },
      { header: 'Church ID', accessor: (item) => item.churchId || '-' },
      {
        header: 'Created Date',
        accessor: (item) =>
          item.createdDate
            ? format(new Date(item.createdDate), 'MMM dd, yyyy HH:mm')
            : '-',
      },
      { header: 'Created By', accessor: (item) => item.createdBy || '-' },
      {
        header: 'Modified Date',
        accessor: (item) =>
          item.modifiedDate
            ? format(new Date(item.modifiedDate), 'MMM dd, yyyy HH:mm')
            : '-',
      },
      { header: 'Modified By', accessor: (item) => item.modifiedBy || '-' },
    ],
    filename: 'events',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedEvents.includes(id)) {
        setSelectedEvents((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedEvents((prev) => [...prev, id])
      }
    },
    [selectedEvents],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedEvents(events.map((event) => event.id.toString()))
  }, [events])

  const handleDeselectAll = useCallback(() => {
    setSelectedEvents([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedEvents.length === events.length && events.length > 0,
    [selectedEvents, events.length],
  )

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [isAllSelected, handleDeselectAll, handleSelectAll])

  return (
    <section className="flex flex-col w-full items-start gap-[23px]">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] leading-[var(--text-xl-bold-line-height)] tracking-[var(--text-xl-bold-letter-spacing)] [font-style:var(--text-xl-bold-font-style)]">
          All Events
        </h1>

        <Button
          className="h-11 bg-[#4a1fb7] hover:bg-[#3d1899] rounded-lg px-5"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <span className="[font-family:'Inter',Helvetica] font-medium text-white text-base">
            Add Event
          </span>
        </Button>
      </header>

      <div className="flex flex-col w-full gap-2">
        <Card className="w-full bg-white rounded-2xl border border-[#eaecf0] overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between pt-5 pb-[19px] px-6 border-b border-[#eaecf0]">
              <h2 className="text-gray-600 [font-family:'Inter',Helvetica] font-bold text-xl">
                Events
              </h2>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Search by event name"
                      className="border-gray-500"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                  </InputGroup>

                  <Select defaultValue="all-society">
                    <SelectTrigger className="w-[170px] border-[#cfd4dc] [font-family:'Inter',Helvetica] font-normal text-sm text-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-society">All society</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedEvents.length > 1 && (
                    <Button variant="destructive" size="default">
                      <Trash2Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">Delete</span>
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="h-auto px-4 py-2.5 gap-2 border-[#cfd4dc]"
                  onClick={exportToExcel}
                  disabled={isExporting}
                >
                  <DownloadIcon className="w-5 h-5" />
                  <span className="[font-family:'Inter',Helvetica] font-medium text-sm text-gray-800">
                    {isExporting ? 'Exporting...' : 'Export'}
                  </span>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
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
                        Event Name
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Description
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Society
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Venue
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Event Date
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <TableRow
                        key={event.id}
                        className="border-b border-[#eaecf0]"
                      >
                        <TableCell className="px-6 py-3">
                          <Checkbox
                            checked={selectedEvents.includes(
                              event.id.toString(),
                            )}
                            onCheckedChange={() =>
                              toggleSelect(event.id.toString())
                            }
                            className="cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <span className="font-normal text-gray-800 text-xs">
                            {event.name}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <span className="font-normal text-gray-800 text-xs">
                            {event.description || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <span className="font-normal text-gray-800 text-xs">
                            {event.society?.name ?? 'General'}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <span className="font-normal text-gray-800 text-xs">
                            {event.venue || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <span className="font-normal text-gray-800 text-xs">
                            {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
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
                                onClick={() => setViewingEvent(event)}
                              >
                                <span className="font-body-text-s-regular">
                                  View Details
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                                onClick={() => setEditingEvent(event)}
                              >
                                <span className="font-body-text-s-regular">
                                  Edit
                                </span>
                              </DropdownMenuItem>
                              <AlertDialogComponent
                                title="Remove Event"
                                description="Are you sure you want to remove this event?"
                                onConfirm={() => {
                                  mutateAsync(event.id.toString())
                                }}
                                disabled={isPending}
                                variant="destructive"
                                confirmText="Remove"
                                cancelText="Cancel"
                              >
                                <DropdownMenuItem
                                  className="h-10 px-2 py-2 cursor-pointer"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <span className="font-body-text-s-regular text-red-700">
                                    Remove
                                  </span>
                                </DropdownMenuItem>
                              </AlertDialogComponent>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <span className="font-medium text-xs text-muted-foreground">
                          {debouncedSearch
                            ? `No events found matching "${debouncedSearch}"`
                            : 'No events found'}
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Pagination
          currentPage={eventsData.page}
          pageSize={eventsData.pageSize}
          totalCount={eventsData.totalCount}
          totalPages={eventsData.totalPages}
          hasPrevious={eventsData.hasPrevious}
          hasNext={eventsData.hasNext}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <AddEventDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
        />
      )}

      {viewingEvent && (
        <EventDetails
          event={viewingEvent}
          open={!!viewingEvent}
          onOpenChange={(open) => !open && setViewingEvent(null)}
        />
      )}
    </section>
  )
})

EventsListSection.displayName = 'EventsListSection'
