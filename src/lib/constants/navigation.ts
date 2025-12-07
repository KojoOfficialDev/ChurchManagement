import {
  AlertCircle,
  Banknote,
  Crown,
  FileText,
  LayoutDashboard,
  ListChecks,
  Martini,
  PawPrint,
  Settings,
  UserStar,
  Users,
  Wallet,
} from 'lucide-react'

const MENU_ITEMS = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    link: '/dashboard',
  },
  {
    icon: Users,
    label: 'Members',
    link: '/dashboard/members',
  },
  {
    icon: UserStar,
    label: 'Marriage',
    link: '/dashboard/marriage',
  },
  {
    icon: PawPrint,
    label: 'Baptism',
    link: '/dashboard/baptism',
  },
  {
    icon: Martini,
    label: 'Communion',
    link: '/dashboard/communion',
  },
  {
    icon: Crown,
    label: 'Confirmation',
    link: '/dashboard/confirmation',
  },
  {
    icon: ListChecks,
    label: 'Events',
    link: '/dashboard/events',
  },
  {
    icon: AlertCircle,
    label: 'Alert  Center',
    link: '/dashboard/alert-center',
  },
]

const FINANCE_ITEMS = [
  {
    icon: Wallet,
    label: 'Contribution',
    link: '/dashboard/contribution',
  },
  {
    icon: Banknote,
    label: 'Expenses',
    link: '/dashboard/expenses',
  },
  {
    icon: FileText,
    label: 'Reports',
    link: '/dashboard/reports',
  },
]

const SYSTEM_ITEMS = [
  {
    icon: Settings,
    label: 'Settings',
    link: '/dashboard/settings',
  },
]

export { MENU_ITEMS, FINANCE_ITEMS, SYSTEM_ITEMS }
