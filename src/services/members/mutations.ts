import { useMutation } from '@tanstack/react-query'
import { MembersService } from './members.service'
import { toast } from 'sonner'

export const useMembersMutations = () => {
  const createMember = useMutation({
    mutationKey: ['createMember'],
    mutationFn: MembersService.createMember,
    onSuccess: () => {
      toast.success('Member created successfully')
    },
    onError: () => {
      toast.error('Failed to create member')
    },
  })

  return {
    createMember,
  }
}
