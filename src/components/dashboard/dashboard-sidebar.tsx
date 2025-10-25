import { ChevronLeftIcon, PowerOff, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FINANCE_ITEMS, MENU_ITEMS, SYSTEM_ITEMS } from '@/lib/constants'
import NavItem from '@/components/nav-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/lib/contexts/sidebar.context'
import { useLoaderData } from '@tanstack/react-router'

export const DashboardSidebar = () => {
  const session = useLoaderData({
    from: '/dashboard',
  })
  const { isOpen, collapse } = useSidebar()
  return (
    <nav
      className={cn(
        'flex flex-col items-center justify-between px-4 py-6 z-50 bg-white border-r border-solid h-screen transition-all duration-300 sticky top-0',
        isOpen
          ? 'w-[265px] border-[#cfd4dc] '
          : 'w-0 px-0 overflow-hidden border-transparent',
      )}
    >
      {isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-7 z-50 left-[245px] w-8 h-8 bg-white rounded-[32px] border border-solid border-[#cfd4dc] shadow-shadow-sm"
          onClick={collapse}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>
      )}

      <div className="flex flex-col items-center gap-[60px] w-full ">
        <header className="flex flex-col w-full items-start gap-4 pt-0 pb-[9px] px-0 border-b border-solid border-[#cfd4dc]">
          <div className="flex flex-col items-start gap-2 pt-0 pb-3 px-0 w-full">
            <div className="flex flex-col items-start gap-1 w-full">
              <div className="w-[232px] rounded-[10px] flex h-[38px] items-center gap-2 px-8 py-2.5">
                <img
                  className="w-[120px] h-[103px] mt-[-34.00px] mb-[-51.00px] object-cover"
                  alt="Logo"
                  src={session.churchLogoUrl}
                />
              </div>
            </div>
          </div>
        </header>

        {isOpen && (
          <ScrollArea className="pr-2">
            <div className="h-[calc(100vh-180px)]">
              <div>
                <div className="flex flex-col items-start gap-4 w-full">
                  <section className="flex flex-col items-start gap-2 w-full">
                    <div className="flex items-center justify-center gap-2.5 pl-8 pr-[23px] py-0 w-full">
                      <div className="flex-1 [font-family:'Inter',Helvetica] font-medium text-gray-400 text-xs tracking-[0.12px] leading-[22px]">
                        MENU
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1 w-full">
                      {MENU_ITEMS.map((item, index) => (
                        <NavItem
                          key={index}
                          item={item}
                          exact={item.link === '/dashboard'}
                        />
                      ))}
                    </div>
                  </section>

                  <section className="flex flex-col items-start gap-2 w-full">
                    <div className="flex items-center justify-center gap-2.5 pl-8 pr-[23px] py-0 w-full">
                      <div className="flex-1 [font-family:'Inter',Helvetica] font-medium text-gray-400 text-xs tracking-[0.12px] leading-[22px]">
                        FINANCE
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1 w-full">
                      {FINANCE_ITEMS.map((item, index) => (
                        <NavItem key={index} item={item} />
                      ))}
                    </div>
                  </section>

                  <section className="flex flex-col w-[233px] items-start gap-2">
                    <div className="flex items-center justify-center gap-2.5 pl-8 pr-[23px] py-0 w-full">
                      <div className="flex-1 [font-family:'Inter',Helvetica] font-medium text-gray-400 text-xs tracking-[0.12px] leading-[22px]">
                        SYSTEM
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1 w-full">
                      {SYSTEM_ITEMS.map((item, index) => (
                        <NavItem key={index} item={item} />
                      ))}
                      <button className="w-full rounded-[10px] flex h-[38px] items-center gap-2 px-8 py-2.5">
                        <PowerOff className="w-5 h-5" />
                        <div className="w-fit [font-family:'Inter',Helvetica] font-normal text-gray-600 text-sm tracking-[0.14px] leading-[22px] whitespace-nowrap">
                          Log out
                        </div>
                      </button>
                    </div>
                  </section>
                </div>
              </div>

              <div className="mx-3 mt-10">
                <Card className="w-full bg-gray-50 border-[0.74px] border-solid border-[#eaecf0] py-4">
                  <CardContent className="flex flex-col items-start gap-[16px] p-[14.83px] py-2">
                    <div className="relative  h-[23.72px]">
                      <div className="relative  h-[29px] -top-1.5">
                        <div className="absolute w-8 h-8 top-[3px] left-[3px] rounded-[4.45px] rotate-[15deg] [background:radial-gradient(50%_50%_at_-20%_50%,rgba(237,233,254,1)_0%,rgba(109,40,217,1)_20%,rgba(167,139,250,1)_100%)]" />
                        <div className="absolute flex justify-center items-center w-8 h-8 top-1.5 left-0 bg-[#ffffff99] rounded-[4.45px] border-[0.56px] border-solid backdrop-blur-[5.93px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(5.93px)_brightness(100%)]">
                          <Zap size={16} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Reach out to our support team
                    </p>
                    <Button className="w-full h-[32.62px] text-white text-[8.9px] font-semibold ">
                      Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </nav>
  )
}
