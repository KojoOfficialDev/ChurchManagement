import { DownloadIcon, MoreVerticalIcon } from 'lucide-react'
import { memo, useMemo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import AddCountryDialog from './add-country-dialog'
import EditCountryDialog from './edit-country-dialog'
import type { Nationalities } from '@/services/nationalities/types'
import { Button } from '@/components/ui/button'
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
import { AlertDialogComponent } from '@/components/alert-dialog'
import { useSidebar } from '@/lib/contexts/sidebar.context'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { getNationalitiesOptions } from '@/services/nationalities/queries'
import { NationalitiesService } from '@/services/nationalities/nationalities.service'
import { useNationalitiesMutations } from '@/services/nationalities/mutations'

const CountriesTable = memo(() => {
  const { isOpen } = useSidebar()
  const { data: countries = [] } = useSuspenseQuery(getNationalitiesOptions)
  const {
    deleteNationality: { mutateAsync, isPending },
  } = useNationalitiesMutations()

  const activeCountries = useMemo(
    () => countries.filter((country) => country.isActive && country.active),
    [countries],
  )

  const { exportToExcel, isExporting } = useExcelExport<Nationalities>({
    fetchData: NationalitiesService.getNationalities,
    columns: [
      { header: 'ID', accessor: (item) => item.id },
      { header: 'Country Name', accessor: (item) => item.name },
      { header: 'Active', accessor: (item) => (item.active ? 'Yes' : 'No') },
    ],
    filename: 'countries',
  })

  return (
    <section className="flex flex-col w-full items-start gap-6 p-6">
      <header className="flex items-center justify-between w-full gap-10">
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
          Countries
        </h1>
        <AddCountryDialog>
          <Button>Add Country</Button>
        </AddCountryDialog>
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">All Countries</h2>

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

          <div className="w-full overflow-x-auto">
            {activeCountries.length > 0 ? (
              <Table className="p-5">
                <TableHeader>
                  <TableRow className="bg-[#fbfcfc] border-b border-[#eaecf0] hover:bg-[#fbfcfc]">
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Country Name
                      </span>
                    </TableHead>
                    <TableHead className="w-[58px]">
                      <span className="font-medium text-[#667084] text-xs">
                        Actions
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCountries.map((country) => (
                    <TableRow
                      key={country.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-sm">
                          {country.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-lg">
                              <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[149px] bg-[#ffffff] rounded-xl border border-solid border-[#ececec] shadow-[0px_24px_48px_-12px_#0f172814] p-3"
                          >
                            <EditCountryDialog country={country}>
                              <DropdownMenuItem
                                className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                  Edit
                                </span>
                              </DropdownMenuItem>
                            </EditCountryDialog>
                            <AlertDialogComponent
                              title="Remove Country"
                              description="Are you sure you want to remove this country?"
                              onConfirm={() => mutateAsync(country.id)}
                              disabled={isPending}
                              variant="destructive"
                              confirmText="Remove"
                              cancelText="Cancel"
                            >
                              <DropdownMenuItem
                                className="h-10 px-2 py-2 cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <span className="font-normal text-sm">
                                  Remove
                                </span>
                              </DropdownMenuItem>
                            </AlertDialogComponent>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-16 gap-2 text-center">
                <p className="text-gray-800 font-semibold text-base">
                  No countries yet
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Add your first country to start organizing member
                  nationalities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})

CountriesTable.displayName = 'CountriesTable'
export default CountriesTable
