import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Events } from '@/components/dashboard/events/events'

export const Route = createFileRoute('/dashboard/events/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading events...</div>
        </div>
      }
    >
      <Events />
    </Suspense>
  )
}
