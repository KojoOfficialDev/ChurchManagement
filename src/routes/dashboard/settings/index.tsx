import { createFileRoute } from '@tanstack/react-router'
import z from 'zod/v3'
import Settings from '@/components/dashboard/settings/settings'

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
})

function RouteComponent() {
  return <Settings />
}
