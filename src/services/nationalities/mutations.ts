import { useMutation } from '@tanstack/react-query'
import { NationalitiesService } from './nationalities.service'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { getNationalitiesOptions } from '@/services/nationalities/queries'

export const useNationalitiesMutations = () => {
  const { queryClient } = getContext()

  const createNationality = useMutation({
    mutationKey: ['createNationality'],
    mutationFn: NationalitiesService.createNationality,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getNationalitiesOptions.queryKey,
      })
      toast.success('Nationality created successfully')
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Failed to create nationality',
        )
      } else {
        toast.error('Failed to create nationality')
      }
    },
  })

  return {
    createNationality,
  }
}
