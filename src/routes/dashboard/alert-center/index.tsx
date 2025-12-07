import { createFileRoute } from '@tanstack/react-router'
import { AlertCenter } from '@/components/dashboard/alert-center/alert-center'

export const Route = createFileRoute('/dashboard/alert-center/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AlertCenter />
}
