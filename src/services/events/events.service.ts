import { sessionOptions } from '../auth/queries'
import type { Event, UpdateEvent } from './events.dto'
import type { EventData, EventResponse } from './types'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { protectedApi } from '@/server/protected-api'

export class EventsService {
  private static getChurchId = async () => {
    const queryClient = getContext().queryClient
    const churchId = await queryClient
      .ensureQueryData(sessionOptions)
      .then((data) => data.churchId)
      .catch(() => null)
    if (!churchId) {
      throw new Error('Church ID not found')
    }
    return churchId.toString()
  }

  static getEvents = async ({
    page,
    pageSize,
    search,
  }: {
    page: number
    pageSize: number
    search?: string
  }) => {
    const churchId = await this.getChurchId()
    const searchParams = new URLSearchParams()
    searchParams.append('page', page.toString())
    searchParams.append('pageSize', pageSize.toString())
    searchParams.append('id', churchId)
    if (search) {
      searchParams.append('search', search)
    }
    const response = await protectedApi.get<EventResponse>(
      '/events/GetAllEvents',
      {
        params: searchParams,
      },
    )
    return response.data
  }

  static createEvent = async (event: Event) => {
    const churchId = await this.getChurchId()
    const { societyId, ...rest } = event
    const response = await protectedApi.post<EventData>('/events/Save', {
      ...rest,
      churchId: Number(churchId),
    })
    return response.data
  }

  static updateEvent = async (event: UpdateEvent) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post('/events/Update', {
      ...event,
      id: Number(event.id),
      churchId: Number(churchId),
    })
    return response.data
  }

  static removeEvent = async (eventId: string) => {
    const response = await protectedApi.delete(`/events/${eventId}`)
    return response.data
  }

  static getUpcomingEvents = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Array<EventData>>(
      '/events/upcoming',
      {
        params: {
          id: churchId,
        },
      },
    )
    return response.data
  }

  static getAllEvents = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Array<EventData>>(
      '/events/getAll',
      {
        params: {
          id: churchId,
        },
      },
    )
    return response.data
  }
}
