import { MoreVertical, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSuspenseQuery } from '@tanstack/react-query'
import { alertTemplatesOptions } from '@/services/alerts/queries'
import { format } from 'date-fns'
import AddTemplateDialog from './add-template-dialog'
import AddAlert from '@/components/dashboard/alert-center/add-alert'

export const AlertTemplates = () => {
  const { data: templates } = useSuspenseQuery(alertTemplatesOptions)
  return (
    <section className="flex flex-col w-full items-start gap-6 relative">
      <header className="flex items-center justify-between w-full">
        <h1 className="font-[number:var(--text-xl-bold-font-weight)] text-gray-800 text-[length:var(--text-xl-bold-font-size)] leading-[var(--text-xl-bold-line-height)] font-text-xl-bold tracking-[var(--text-xl-bold-letter-spacing)] [font-style:var(--text-xl-bold-font-style)]">
          Alert centre
        </h1>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="h-11 bg-[#4a1fb71f] hover:bg-[#4a1fb71f]/80 text-[#4a1fb7] font-medium text-base rounded-lg"
          >
            Alert log
          </Button>

          <AddAlert>
            <Button className="h-11 bg-[#4a1fb7] hover:bg-[#4a1fb7]/90 text-white font-medium text-base rounded-lg px-5">
              Add Alert
            </Button>
          </AddAlert>
        </div>
      </header>

      <div className="flex flex-col items-start gap-3 w-full">
        <h2 className="font-[number:var(--text-md-regular-font-weight)] text-gray-800 text-[length:var(--text-md-regular-font-size)] leading-[var(--text-md-regular-line-height)] font-text-md-regular tracking-[var(--text-md-regular-letter-spacing)] [font-style:var(--text-md-regular-font-style)]">
          Templates
        </h2>

        {templates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
            {templates.map((template, index) => (
              <Card
                key={index}
                className="bg-[#fff6e9] border-[#ffd79f] rounded-lg"
              >
                <CardContent className="flex flex-col gap-3 p-3">
                  <h3 className="font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-gray-800 text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
                    {template.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="[font-family:'Inter',Helvetica] font-medium text-gray-800 text-xs tracking-[0] leading-[18px]">
                      Last updated:{' '}
                      {format(new Date(template.modifiedDate), 'MMM dd, yyyy')}
                    </span>

                    <MoreVertical className="w-4 h-4 text-gray-800 cursor-pointer" />
                  </div>
                </CardContent>
              </Card>
            ))}

            <AddTemplateDialog>
              <button className="w-[50px] bg-[#fff9f2] rounded-lg border border-solid border-[#ffdeb0] flex items-center justify-center hover:bg-[#fff6e9] transition-colors">
                <PlusIcon className="w-6 h-6 text-gray-800" />
              </button>
            </AddTemplateDialog>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-xs">
            <p className="flex items-center justify-center gap-2">
              No templates found
              <AddTemplateDialog>
                <button className="text-primary underline cursor-pointer">
                  Add Template
                </button>
              </AddTemplateDialog>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
