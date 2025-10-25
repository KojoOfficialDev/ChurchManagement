import { useMutation } from '@tanstack/react-query'
import { SocietiesService } from '@/services/societies/societies.service'

export const useSocietiesMutations = () => {
  const createSociety = useMutation({
    mutationKey: ['createSociety'],
    mutationFn: SocietiesService.createSociety,
  })

  return {
    createSociety,
  }
}
