import { useState } from 'react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

type ColumnMapping<T> = {
  header: string
  accessor: (item: T) => string | number | boolean | null | undefined
}

type UseExcelExportOptions<T> = {
  fetchData: () => Promise<Array<T>>
  columns: Array<ColumnMapping<T>>
  filename: string
}

type UseExcelExportReturn = {
  exportToExcel: () => Promise<void>
  isExporting: boolean
}

export function useExcelExport<T>({
  fetchData,
  columns,
  filename,
}: UseExcelExportOptions<T>): UseExcelExportReturn {
  const [isExporting, setIsExporting] = useState(false)

  const exportToExcel = async () => {
    try {
      setIsExporting(true)

      // Fetch all data
      const data = await fetchData()

      if (!data || data.length === 0) {
        toast.error('No data to export')
        return
      }

      // Transform data according to column mappings
      const transformedData = data.map((item) => {
        const row: Record<
          string,
          string | number | boolean | null | undefined
        > = {}
        columns.forEach((col) => {
          row[col.header] = col.accessor(item)
        })
        return row
      })

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(transformedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0]
      const fullFilename = `${filename}-export-${date}.xlsx`

      // Write and download the file
      XLSX.writeFile(workbook, fullFilename)

      toast.success('Data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  return {
    exportToExcel,
    isExporting,
  }
}
