import { memo } from 'react'
import { UserIcon } from 'lucide-react'
import { useLoaderData } from '@tanstack/react-router'

const DashboardHeader = memo(() => {
  const session = useLoaderData({
    from: '/dashboard',
  })

  return (
    <header className="py-4 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="md:flex hidden items-center gap-2">
        <h1 className="text-2xl font-bold">{session.churchName}</h1>
      </div>
      <div className="items-center gap-4 lg:flex hidden">
        <div className="flex items-center gap-2 bg-muted-foreground/10 px-2  pr-6 py-1 rounded-full">
          <div className="relative w-8 h-8 rounded-full bg-primary-accent flex items-center justify-center">
            <UserIcon size={16} className="text-primary-accent-foreground" />
            <span className="w-2 h-2 absolute bg-green-600 rounded-full bottom-0 right-0 border-2 border-white" />
          </div>
          <div>
            <p className="text-sm font-medium">{session.name}</p>
          </div>
        </div>
      </div>
      {/* Mobile sidebar toggle */}
    </header>
  )
})
export default DashboardHeader
