import { useState, useTransition } from 'react'
import { RenderSetupSection } from './render-setup-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const SETUP_TABS: Array<SetupTabType> = [
  {
    label: 'Countries',
    value: 'countries',
  },
  {
    label: 'Societies',
    value: 'societies',
  },
]

type SetupTabValue = 'countries' | 'societies'
type SetupTabLabel = 'Countries' | 'Societies'
type SetupTabType = {
  label: SetupTabLabel
  value: SetupTabValue
}
function SetupTabs() {
  const [activeTab, setActiveTab] = useState<SetupTabValue>('countries')
  const [_isPending, startTransition] = useTransition()

  const handleTabChange = (newTab: string) => {
    startTransition(() => {
      setActiveTab(newTab as SetupTabValue)
    })
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="px-8">
      <TabsList className="flex gap-8 text-sm bg-transparent border-b-[1px] rounded-none mt-3">
        {SETUP_TABS.map((tabItem) => (
          <TabsTrigger
            key={tabItem.value}
            value={tabItem.value}
            className="border-0 pb-2 data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent rounded-none data-[state=active]:text-foreground text-gray-600 relative data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-[-4px] data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-[#6838ee]"
          >
            {tabItem.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {SETUP_TABS.map((tabItem) => (
        <TabsContent key={tabItem.value} value={tabItem.value}>
          <RenderSetupSection tab={activeTab} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default SetupTabs
