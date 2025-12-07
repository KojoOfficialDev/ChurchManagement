import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { NationalitiesService } from './nationalities.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { getNationalitiesOptions } from '@/services/nationalities/queries'

export const useNationalitiesMutations = () => {
  const { queryClient } = getContext()

  const invalidateList = async () => {
    await queryClient.invalidateQueries({
      queryKey: getNationalitiesOptions.queryKey,
    })
  }

  const handleError = (error: unknown, message: string) => {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message || message)
    } else {
      toast.error(message)
    }
  }

  const createNationality = useMutation({
    mutationKey: ['createNationality'],
    mutationFn: NationalitiesService.createNationality,
    onSuccess: async () => {
      await invalidateList()
      toast.success('Nationality created successfully')
    },
    onError: (error) => handleError(error, 'Failed to create nationality'),
  })

  const updateNationality = useMutation({
    mutationKey: ['updateNationality'],
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      NationalitiesService.updateNationality(id, name),
    onSuccess: async () => {
      await invalidateList()
      toast.success('Nationality updated successfully')
    },
    onError: (error) => handleError(error, 'Failed to update nationality'),
  })

  const deleteNationality = useMutation({
    mutationKey: ['deleteNationality'],
    mutationFn: (id: string) => NationalitiesService.deleteNationality(id),
    onSuccess: async () => {
      await invalidateList()
      toast.success('Nationality removed successfully')
    },
    onError: (error) => handleError(error, 'Failed to delete nationality'),
  })

  return {
    createNationality,
    updateNationality,
    deleteNationality,
  }
}
