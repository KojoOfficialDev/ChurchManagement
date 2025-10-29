import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { BaptismService } from './baptism.service'


export const useBaptismsMutations = () => {
  const createBaptism = useMutation({
    mutationFn: BaptismService.createBaptism,
    onSuccess: () => {
      toast.error('Failed to create baptism record')
    },
  })
  return {
    createBaptism,
  }
}
