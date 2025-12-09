import { MoreVertical, PlusIcon } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import AddTemplateDialog from './add-template-dialog'
import EditTemplateDialog from './edit-template-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { alertTemplatesOptions } from '@/services/alerts/queries'
import AddAlert from '@/components/dashboard/alert-center/add-alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAlertsMutations } from '@/services/alerts/mutations'
import { AlertDialogComponent } from '@/components/alert-dialog'

export const AlertTemplates = () => {
  const { data: templates } = useSuspenseQuery(alertTemplatesOptions)
  const {
    deleteAlertTemplate: { mutateAsync: deleteTemplate },
  } = useAlertsMutations()
  return (
    <section className="flex flex-col w-full items-start gap-6 relative">
      <header className="flex items-center justify-between w-full">
        <h1 className="font-[number:var(--text-xl-bold-font-weight)] text-gray-800 text-[length:var(--text-xl-bold-font-size)] leading-[var(--text-xl-bold-line-height)] font-text-xl-bold tracking-[var(--text-xl-bold-letter-spacing)] [font-style:var(--text-xl-bold-font-style)]">
          Alert centre
        </h1>

        <div className="flex items-center gap-3">
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

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="hover:bg-transparent"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-800 cursor-pointer" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#fff6e9]">
                        <EditTemplateDialog
                          template={{
                            id: template.id,
                            active: template.active,
                            isActive: template.isActive,
                            message: template.message,
                            name: template.name,
                          }}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            Edit
                          </DropdownMenuItem>
                        </EditTemplateDialog>
                        <AlertDialogComponent
                          title="Delete Alert Template"
                          description="Are you sure you want to delete this alert template?"
                          onConfirm={() =>
                            deleteTemplate(template.id.toString())
                          }
                          confirmText="Delete"
                          cancelText="Cancel"
                          variant="destructive"
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-red-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                              Delete
                            </span>
                          </DropdownMenuItem>
                        </AlertDialogComponent>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
