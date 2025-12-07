import { createFileRoute } from '@tanstack/react-router'
import { ReportSection } from '@/components/dashboard/reports/reports-section'

export const Route = createFileRoute('/dashboard/reports/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <ReportSection />
    </main>
  )
}
