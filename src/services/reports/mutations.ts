import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ReportsService } from './reports.service'

export const useReportsMutations = () => {
  const generateReport = useMutation({
    mutationKey: ['generateReport'],
    mutationFn: ReportsService.generateReport,
    onSuccess: () => {
      toast.success('Report generated successfully')
    },
    onError: () => {
      toast.error('Failed to generate report')
    },
  })

  return {
    generateReport,
  }
}
