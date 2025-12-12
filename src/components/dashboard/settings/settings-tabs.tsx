import { useMemo, useState, useTransition } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { RenderSettingsSection } from './render-settings-section'
import type { SettingsTabValue } from '@/lib/types/settings'
import { SETTINGS_TABS } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSuspenseQuery } from '@tanstack/react-query'
import { sessionOptions } from '@/services/auth/queries'
import { useEffect } from 'react'

function SettingsTabs() {
  const { data } = useSuspenseQuery(sessionOptions)
  const { tab } = useSearch({
    from: '/dashboard/settings/',
  })
  const [activeTab, setActiveTab] = useState<SettingsTabValue>(tab)
  const [_isPending, startTransition] = useTransition()
  const navigate = useNavigate()

  const handleTabChange = (newTab: string) => {
    startTransition(() => {
      setActiveTab(newTab as SettingsTabValue)
      navigate({
        to: '/dashboard/settings',
        search: { tab: newTab as SettingsTabValue },
      })
    })
  }

  const filteredTabs = useMemo(() => {
    return SETTINGS_TABS.filter((tabItem) => {
      // If tab has no roles requirement, it's accessible to all
      if (!tabItem.roles || tabItem.roles.length === 0) {
        return true
      }
      // Check if user has any of the required roles
      return tabItem.roles.some((role) => data.roles.includes(role))
    })
  }, [data.roles])

  // Ensure the active tab is one the user can access. If not, fall back to the
  // first accessible tab and update the URL so navigation stays in sync.
  useEffect(() => {
    const hasAccess = filteredTabs.some((t) => t.value === activeTab)
    if (!hasAccess && filteredTabs.length > 0) {
      const fallbackTab = filteredTabs[0].value
      setActiveTab(fallbackTab)
      navigate({
        to: '/dashboard/settings',
        search: { tab: fallbackTab },
        replace: true,
      })
    }
  }, [activeTab, filteredTabs, navigate])

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="flex w-full gap-2 text-sm bg-transparent border-b-[1px] rounded-none">
        {filteredTabs.map((tabItem) => (
          <TabsTrigger
            key={tabItem.value}
            value={tabItem.value}
            className="border-0 pb-2 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent rounded-none data-[state=active]:text-foreground text-gray-600 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-[-4px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[#6838ee]"
          >
            {tabItem.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {filteredTabs.map((tabItem) => (
        <TabsContent key={tabItem.value} value={tabItem.value}>
          <RenderSettingsSection tab={activeTab} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default SettingsTabs
