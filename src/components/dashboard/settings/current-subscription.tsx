import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const CurrentSubscriptionSection = () => {
  return (
    <section className="flex flex-col items-start gap-6 w-full py-8">
      <div className="flex flex-col items-start gap-[18px] w-full">
        <h2 className="w-full mt-[-1.00px] font-[number:var(--text-xl-bold-font-weight)] text-gray-800 text-[length:var(--text-xl-bold-font-size)] leading-[var(--text-xl-bold-line-height)] flex items-center justify-start font-text-xl-bold tracking-[var(--text-xl-bold-letter-spacing)] [font-style:var(--text-xl-bold-font-style)]">
          Current Subscription
        </h2>

        <Card className="w-full bg-white rounded-3xl border-solid border-[#cfd4dc] shadow-none border-0">
          <CardContent className="flex items-start gap-12 p-10">
            <div className="flex flex-col items-start gap-[23px] flex-1">
              <Badge className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#f7900914] rounded-full hover:bg-[#f7900914] h-auto">
                <span className="w-fit font-medium text-[#f79009] text-xl text-center leading-8 whitespace-nowrap [font-family:'Inter',Helvetica] tracking-[0]">
                  Standard
                </span>
              </Badge>

              <div className="flex items-center justify-between w-full">
                <div className="relative w-[308px] h-[101.24px]">
                  <div className="absolute top-0 left-0 w-[304px] h-20 flex items-center justify-center [font-family:'Inter',Helvetica] font-bold text-[#1e1e1e] text-5xl tracking-[0] leading-[80px]">
                    GH₵1,400
                  </div>

                  <div className="absolute top-[73px] left-[229px] h-7 font-[number:var(--text-lg-medium-font-weight)] text-[#667084] text-[length:var(--text-lg-medium-font-size)] leading-[var(--text-lg-medium-line-height)] whitespace-nowrap flex items-center justify-center font-text-lg-medium tracking-[var(--text-lg-medium-letter-spacing)] [font-style:var(--text-lg-medium-font-style)]">
                    /Month
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-[99px] h-[38px] gap-[2.97px] px-[14.83px] py-3 rounded-[100px] border-[0.74px] border-solid border-[#4a1fb7] bg-transparent hover:bg-transparent"
                >
                  <span className="[font-family:'Inter',Helvetica] font-semibold text-[#4a1fb7] text-base tracking-[0] leading-6 whitespace-nowrap">
                    Change
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
