import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

export type SidebarContext = {
  isOpen: boolean
  expand: () => void
  collapse: () => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContext | null>(null)

function getInitialSidebarState(): boolean {
  try {
    const savedState =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('dashboard.sidebarOpen')
        : null
    if (savedState === null) return true
    return savedState === 'true'
  } catch {
    return true
  }
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(() => getInitialSidebarState())

  //   useEffect(() => {
  //     try {
  //       window.localStorage.setItem('dashboard.sidebarOpen', String(isOpen))
  //     } catch {}
  //   }, [isOpen])

  const expand = useCallback(() => {
    localStorage.setItem('dashboard.sidebarOpen', 'true')
    setIsOpen(true)
  }, [])

  const collapse = useCallback(() => {
    localStorage.setItem('dashboard.sidebarOpen', 'false')
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    localStorage.setItem('dashboard.sidebarOpen', String(!isOpen))
    setIsOpen(!isOpen)
  }, [])

  const value = useMemo<SidebarContext>(
    () => ({ isOpen, expand, collapse, toggle }),
    [isOpen, expand, collapse, toggle],
  )

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarContext {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return ctx
}
