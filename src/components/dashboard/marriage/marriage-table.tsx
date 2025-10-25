import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { memo, useCallback, useMemo, useState } from 'react'
import { useSidebar } from '@/lib/contexts/sidebar.context'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import AddMarriageDialog from '@/components/dashboard/marriage/add-mariage-dialog'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getMarriagesOptions } from '@/services/marriages/queries'

const pageNumbers = [
  { number: 1, active: true },
  { number: 2, active: false },
  { number: 3, active: false },
  { number: 4, active: false },
  { number: 5, active: false },
]

const MarriageTable = memo(() => {
  const { data: marriages } = useSuspenseQuery(getMarriagesOptions)
  const { isOpen } = useSidebar()
  const [selectedMarriages, setSelectedMarriages] = useState<string[]>([])

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedMarriages.includes(id)) {
        setSelectedMarriages((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedMarriages((prev) => [...prev, id])
      }
    },
    [selectedMarriages],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedMarriages(marriages.map((marriage) => marriage.id.toString()))
  }, [])

  const handleDeselectAll = useCallback(() => {
    setSelectedMarriages([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedMarriages.length === marriages.length,
    [selectedMarriages],
  )
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [selectedMarriages])

  return (
    <section className="flex flex-col w-full items-start gap-6">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
          Marriage
        </h1>

        <AddMarriageDialog />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">All Marriages</h2>

            <div className="flex items-center gap-4">
              <div className="flex items-start gap-2">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Search..."
                    className="border-gray-500"
                  />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                </InputGroup>

                <Select>
                  <SelectTrigger className="w-[170px] border-[#cfd4dc] bg-[#ffffff]">
                    <SelectValue>
                      <span className="font-normal text-gray-600 text-sm">
                        All societies
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All societies</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[170px] border-[#cfd4dc] bg-[#ffffff]">
                    <SelectValue>
                      <span className="font-normal text-gray-600 text-sm">
                        All Status
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                  </SelectContent>
                </Select>

                {selectedMarriages.length > 1 && (
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

              <Button variant="outline" size={isOpen ? 'icon' : 'default'}>
                <DownloadIcon className="w-5 h-5" />
                {!isOpen && <span className="font-medium text-sm">Export</span>}
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
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
                      Marriage Number
                    </span>
                  </TableHead>
                  <TableHead className="px-6 py-3">
                    <span className="font-medium text-gray-800 text-xs">
                      Couple Name
                    </span>
                  </TableHead>
                  <TableHead className="px-6 py-3">
                    <span className="font-medium text-gray-800 text-xs">
                      Groom Name
                    </span>
                  </TableHead>
                  <TableHead className="px-6 py-3">
                    <span className="font-medium text-gray-800 text-xs">
                      Bride Name
                    </span>
                  </TableHead>

                  <TableHead className="px-6 py-3">Rev. Minister</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marriages.map((marriage) => (
                  <TableRow
                    key={marriage.id}
                    className="border-b border-[#eaecf0]"
                  >
                    <TableCell className="px-6 py-3">
                      <Checkbox
                        checked={selectedMarriages.includes(
                          marriage.id.toString(),
                        )}
                        onCheckedChange={() =>
                          toggleSelect(marriage.id.toString())
                        }
                        className="cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <span className="font-normal text-gray-800 text-xs">
                        {marriage.marriageNumber}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <span className="font-normal text-gray-800 text-xs">
                        {marriage.coupleName}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <span className="font-normal text-gray-800 text-xs">
                        {marriage.groomId}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <span className="font-normal text-gray-800 text-xs">
                        {marriage.brideId}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-[11px]">
                      <span className="font-normal text-gray-800 text-xs">
                        {marriage.revMinister}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-auto w-auto p-0">
                            <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[149px] bg-[#ffffff] rounded-xl border border-solid border-[#ececec] shadow-[0px_24px_48px_-12px_#0f172814] p-3"
                        >
                          <DropdownMenuItem className="h-10 px-2 py-2 bg-gray-100 rounded-lg cursor-pointer">
                            <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                              View Details
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="h-10 px-2 py-2 rounded-lg cursor-pointer">
                            <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                              Edit
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="h-10 px-2 py-2 cursor-pointer">
                            <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-red-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                              Remove
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-start justify-center gap-2.5 px-3 py-2 w-full border-b border-solid border-[#eaecf0]">
            <div className="w-[327px] h-1.5 bg-[#eaecf0] rounded-xl" />
          </div>
        </div>

        <div className="w-full bg-[#ffffff] rounded-lg shadow-[0px_1px_11.7px_1px_#b9b9b914] px-4 py-3">
          <div className="flex items-center justify-between w-full">
            <span className="font-normal text-gray-800 text-xs">
              1-15 of 100 items
            </span>

            <div className="flex items-center gap-6">
              <Button variant="ghost" className="h-auto w-auto p-0">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </Button>

              <div className="flex items-start gap-3">
                {pageNumbers.map((page) => (
                  <button
                    key={page.number}
                    className={`w-[30px] h-7 flex items-center justify-center ${
                      page.active
                        ? 'font-bold text-gray-800 text-xs'
                        : 'font-normal text-gray-800 text-xs'
                    }`}
                  >
                    {page.number}
                  </button>
                ))}
              </div>

              <Button variant="ghost" className="h-auto w-auto p-0">
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              <Select defaultValue="15">
                <SelectTrigger className="w-[51px] h-7 border-0 bg-transparent">
                  <SelectValue>
                    <span className="font-medium text-gray-800 text-xs">
                      15
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="font-normal text-[#1d2838] text-xs">
                Items per page
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

MarriageTable.displayName = 'MarriageTable'
export default MarriageTable
