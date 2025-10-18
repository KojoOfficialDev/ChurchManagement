import MembersTable from '@/components/dashboard/members/members-table'
import MembersStatsCards from '@/components/dashboard/members/stat-cards'
import { createFileRoute } from '@tanstack/react-router'
import { memo } from 'react'

export const Route = createFileRoute('/dashboard/members/')({
  component: memo(RouteComponent),
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <MembersStatsCards />
      <MembersTable />
    </div>
  )
}
