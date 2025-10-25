import { queryOptions } from '@tanstack/react-query'
import { MembersService } from './members.service'

export const generateMemberIdOptions = queryOptions({
  queryKey: ['MemberId'],
  queryFn: MembersService.generateMemberId,
})

export const getAllMembersOptions = ({
  page,
  pageSize,
}: {
  page: number
  pageSize: number
}) => {
  return queryOptions({
    queryKey: ['Members'],
    queryFn: () => MembersService.getAllMembers({ page, pageSize }),
    staleTime: 30 * 60 * 1000,
  })
}
