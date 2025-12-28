import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { MembersService } from './members.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const useMembersMutations = () => {
  const createMember = useMutation({
    mutationKey: ['createMember'],
    mutationFn: MembersService.createMember,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['members'] })
      toast.success('Member created successfully')
    },
    onError: () => {
      toast.error('Failed to create member')
    },
  })

  const removeMember = useMutation({
    mutationKey: ['removeMember'],
    mutationFn: MembersService.removeMember,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['members'] })
      toast.success('Member removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove member')
    },
  })

  const updateMember = useMutation({
    mutationKey: ['updateMember'],
    mutationFn: MembersService.updateMember,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['members'] })
      toast.success('Member updated successfully')
    },
    onError: () => {
      toast.error('Failed to update member')
    },
  })

  const bulkUpload = useMutation({
    mutationKey: ['bulkUploadMembers'],
    mutationFn: MembersService.bulkUpload,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['members'] })
      toast.success('Members uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to upload members')
    },
  })

  return {
    createMember,
    removeMember,
    updateMember,
    bulkUpload,
  }
}
