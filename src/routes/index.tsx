import { createFileRoute, redirect } from '@tanstack/react-router'
import Loader from '@/components/loader'
import { sessionOptions } from '@/services/auth/queries'

export const Route = createFileRoute('/')({
  pendingComponent: () => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  },
  component: App,
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient
      .fetchQuery(sessionOptions)
      .catch(() => null)
    if (session && session.accessToken) {
      throw redirect({
        to: '/dashboard',
        replace: true,
      })
    }
    throw redirect({
      to: '/login',
      replace: true,
    })
  },
})

function App() {
  return <div className="text-center">lilttle tings</div>
}
