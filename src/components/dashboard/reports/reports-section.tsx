import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useReportsMutations } from '@/services/reports/mutations'

const possibleReportTypes = [
  {
    value: 'income',
    label: 'Income',
  },
  {
    value: 'expense',
    label: 'Expense',
  },
  {
    value: 'contribution',
    label: 'Contribution',
  },
]

const possibleReportDurations = [
  {
    value: 'daily',
    label: 'Daily',
  },
  {
    value: 'monthly',
    label: 'Monthly',
  },
  {
    value: 'quarterly',
    label: 'Quarterly',
  },
  {
    value: 'yearly',
    label: 'Yearly',
  },
]

type ReportType = 'income' | 'expense' | 'contribution'
type ReportDuration = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export function ReportSection() {
  const [reportType, setReportType] = useState<ReportType>('income')
  const [reportDuration, setReportDuration] =
    useState<ReportDuration>('monthly')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [dateError, setDateError] = useState<string | null>(null)
  const {
    generateReport: { mutateAsync, isPending },
  } = useReportsMutations()

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    if (date && endDate && date > endDate) {
      setDateError('End date cannot be before start date')
    } else {
      setDateError(null)
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    if (startDate && date && date < startDate) {
      setDateError('End date cannot be before start date')
    } else {
      setDateError(null)
    }
  }

  const handleGenerateReport = async () => {
    if (dateError) return
    const blob = await mutateAsync({
      type: reportType,
      duration: reportDuration,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    })
    if (blob) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${reportType}_${reportDuration}_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-foreground mb-6">Report</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Report Type */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Report type</Label>
          <Select
            value={reportType}
            onValueChange={(value) => setReportType(value as ReportType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {possibleReportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Report Duration */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Report Duration
          </Label>
          <Select
            value={reportDuration}
            onValueChange={(value) =>
              setReportDuration(value as ReportDuration)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {possibleReportDurations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Start date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-between text-left font-normal',
                  !startDate && 'text-muted-foreground',
                )}
              >
                {startDate ? format(startDate, 'PPP') : 'Select date'}
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">End date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-between text-left font-normal',
                  !endDate && 'text-muted-foreground',
                  dateError && 'border-red-500',
                )}
              >
                {endDate ? format(endDate, 'PPP') : 'Select date'}
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                disabled={startDate ? { before: startDate } : undefined}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          {dateError && <p className="text-sm text-red-500">{dateError}</p>}
        </div>
      </div>

      {/* Generate Report Button */}
      <Button
        onClick={handleGenerateReport}
        disabled={!!dateError || isPending}
        className="bg-[#5B4DC3] hover:bg-[#4A3DB0] text-white disabled:opacity-50"
      >
        {isPending ? 'Generating...' : 'Generate Report'}
      </Button>
    </div>
  )
}
