import { cn } from '@/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'
import { memo, useMemo } from 'react'

type NavItemProps = {
  item: {
    icon: React.ElementType
    label: string
    link: string
  }
  exact?: boolean
}
const NavItem = memo<NavItemProps>(({ item, exact = false }) => {
  const { pathname } = useLocation()

  const active = useMemo(() => {
    return exact
      ? pathname === item.link
      : pathname === item.link || pathname.startsWith(item.link + '/')
  }, [pathname, item.link])

  const Icon = item.icon
  return (
    <Link
      to={item.link}
      className={`w-full flex h-[38px] items-center gap-3 px-8 py-2.5 ${
        active
          ? 'bg-[#4a1fb71f] border-l-4 border-solid border-[#4a1fb7]'
          : 'rounded-[10px]'
      }`}
    >
      <Icon
        className={cn(
          'w-5 h-5 text-muted-foreground',
          active && 'text-purple-800',
        )}
      />
      <div
        className={cn(
          "w-fit [font-family:'Inter',Helvetica] font-normal text-sm tracking-[0.14px] leading-[22px] whitespace-nowrap text-gray-600",
          active && 'text-purple-800',
        )}
      >
        {item.label}
      </div>
    </Link>
  )
})

export default NavItem
