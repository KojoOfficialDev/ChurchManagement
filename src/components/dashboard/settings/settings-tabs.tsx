import { useState, useTransition } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { RenderSettingsSection } from './render-settings-section'
import type { SettingsTabValue } from '@/lib/types/settings'
import { SETTINGS_TABS } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function SettingsTabs() {
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

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="flex w-full gap-2 text-sm bg-transparent border-b-[1px] rounded-none">
        {SETTINGS_TABS.map((tabItem) => (
          <TabsTrigger
            key={tabItem.value}
            value={tabItem.value}
            className="border-0 pb-2 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent rounded-none data-[state=active]:text-foreground text-gray-600 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-[-4px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[#6838ee]"
          >
            {tabItem.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {SETTINGS_TABS.map((tabItem) => (
        <TabsContent key={tabItem.value} value={tabItem.value}>
          <RenderSettingsSection tab={activeTab} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default SettingsTabs
