import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { EventsService } from './events.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const eventsMutations = () => {
  const createEvent = useMutation({
    mutationFn: EventsService.createEvent,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({
        queryKey: ['events'],
      })
      await queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] })
      toast.success('Event created successfully')
    },
    onError: () => {
      toast.error('Failed to create event')
    },
  })

  const updateEvent = useMutation({
    mutationFn: EventsService.updateEvent,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      await queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] })
      toast.success('Event updated successfully')
    },
    onError: () => {
      toast.error('Failed to update event')
    },
  })

  const removeEvent = useMutation({
    mutationKey: ['removeEvent'],
    mutationFn: EventsService.removeEvent,
    onSuccess: async () => {
      toast.success('Event removed successfully')
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      await queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] })
    },
    onError: () => {
      toast.error('Failed to remove event')
    },
  })

  return {
    createEvent,
    updateEvent,
    removeEvent,
  }
}
