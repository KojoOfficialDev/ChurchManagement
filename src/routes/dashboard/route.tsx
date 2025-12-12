import {
  HeadContent,
  Outlet,
  createFileRoute,
  redirect,
} from '@tanstack/react-router'
import { toast } from 'sonner'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
// import DashboardHeader from '@/components/dashboard-header'
import Loader from '@/components/loader'
import { sessionOptions } from '@/services/auth/queries'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import { SidebarProvider } from '@/lib/contexts/sidebar.context'

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <>
      <HeadContent />
      <DashboardLayout />
    </>
  ),
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const session = await queryClient
      .ensureQueryData(sessionOptions)
      .catch(() => null)

    /**
     ** if the user user is coming from the login page, the session is not refetched since it is already in the query client and is returned from cache
     **if the user is coming is reloading the dashboard, the session is refetched since it is not in the query client and is not returned from cache
     */

    // if the user is not logged in, redirect to the login page
    if (!session || !session.accessToken) {
      toast.error('Session expired, please login again')
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
        replace: true,
      })
    }
  },
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(sessionOptions),

  pendingComponent: () => {
    return (
      <div className="flex items-2center justify-center min-h-screen">
        <Loader />
      </div>
    )
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          title: `${loaderData?.churchName}`,
        },
        {
          property: 'og:title',
          content: 'parish Desk',
        },
        {
          property: 'og:description',
          content: 'A comprehensive church mamangement system',
        },
      ],
    }
  },
})

function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-2 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
