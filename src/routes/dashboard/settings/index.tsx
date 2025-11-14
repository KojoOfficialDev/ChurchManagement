import { createFileRoute } from '@tanstack/react-router'
import z from 'zod/v3'
import Settings from '@/components/dashboard/settings/settings'
import { churchProfileQuery } from '@/services/setup/queries'

const settingsSearchSchema = z.object({
  tab: z
    .enum([
      'church-profile',
      'setup',
      'user-management',
      'subscriptions',
      'sms-credit',
      'personalization',
    ])
    .catch('church-profile'),
})
export const Route = createFileRoute('/dashboard/settings/')({
  component: RouteComponent,
  validateSearch: (search) => {
    return settingsSearchSchema.parse(search)
  },
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(churchProfileQuery),
})

function RouteComponent() {
  return <Settings />
}
