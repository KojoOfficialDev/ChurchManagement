import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { MembersService } from './members.service'

export const generateMemberIdOptions = queryOptions({
  queryKey: ['MemberId'],
  queryFn: MembersService.generateMemberId,
})

export const getAllMembersOptions = ({
  page,
  pageSize,
  search,
}: {
  page: number
  pageSize: number
  search?: string
}) => {
  return queryOptions({
    queryKey: ['members', page, pageSize, search],
    queryFn: () => MembersService.getAllMembers({ page, pageSize, search }),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}

export const getMemberStatisticsOptions = queryOptions({
  queryKey: ['memberStatistics'],
  queryFn: async () => await MembersService.getMemberStatistics(),
  staleTime: 30 * 60 * 1000,
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
})
