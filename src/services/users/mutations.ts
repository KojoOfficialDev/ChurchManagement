import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from './users.service'
import type { CreateUser, UpdateUser } from './users.dto'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const useUsersMutations = () => {
  const createUser = useMutation({
    mutationFn: (user: CreateUser) => usersService.createUser(user),
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: () => {
      toast.error('Failed to create user')
    },
  })
  const updateUser = useMutation({
    mutationFn: async (user: UpdateUser) => await usersService.updateUser(user),
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: () => {
      toast.error('Failed to update user')
    },
  })
  const removeUser = useMutation({
    mutationFn: async (id: string) => await usersService.removeUser(id),
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove user')
    },
  })
  return {
    createUser,
    updateUser,
    removeUser,
  }
}
