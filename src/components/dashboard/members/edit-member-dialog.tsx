import { ArrowLeft } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useSuspenseQueries } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { UpdateMember } from '@/services/members/members.dto'
import type { Member } from '@/services/members/types'
import type { FieldPath } from 'react-hook-form'
import type { FormSteps } from '@/components/dashboard/members/add-member-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { updateMemberSchema } from '@/services/members/members.dto'
import { AddMemberForm } from '@/components/dashboard/members/add-member-form'
import { useMemberForm } from '@/services/members/members.form'
import { Progress } from '@/components/ui/progress'
import { getNationalitiesOptions } from '@/services/nationalities/queries'
import { useMembersMutations } from '@/services/members/mutations'
import { getSocietiesOptions } from '@/services/societies/queries'

type EditMemberDialogProps = {
  member: Member
  children: ReactNode
}

const EditMemberDialog = ({ member, children }: EditMemberDialogProps) => {
  const [nationsRes, societiesRes] = useSuspenseQueries({
    queries: [getNationalitiesOptions, getSocietiesOptions],
  })
  const [isOpen, setIsOpen] = useState(false)
  const { updateMember } = useMembersMutations()

  const nationalities = useMemo(
    () =>
      nationsRes.data.map((nation) => {
        return {
          label: nation.name,
          value: nation.id.toString(),
        }
      }),
    [nationsRes.data],
  )
  const societies = useMemo(
    () =>
      societiesRes.data.map((society) => {
        return {
          label: society.name,
          value: society.id.toString(),
        }
      }),
    [societiesRes.data],
  )

  const { MEMBER_FORM_SECTIONS } = useMemberForm({ nationalities, societies })
  const [attempedNext, setAttempedNext] = useState(false)
  const POSSIBLE_FORM_STEPS = useMemo(
    () =>
      MEMBER_FORM_SECTIONS.map((section) => section.title) as Array<FormSteps>,
    [MEMBER_FORM_SECTIONS],
  )
  const [formStep, setFormStep] = useState<FormSteps>(POSSIBLE_FORM_STEPS[0])

  // Transform member data for form defaults
  const getDefaultValues = useCallback(() => {
    return {
      id: member.id,
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      middleName: member.middleName || '',
      email: member.email || '',
      phoneNumber: member.phoneNumber || '',
      gender: member.gender as 'male' | 'female',
      dateOfBirth: member.dateOfBirth
        ? new Date(member.dateOfBirth)
        : (undefined as any),
      placeOfBirth: member.placeOfBirth || '',
      nationality: member.nationality || '',
      region: member.region || '',
      homeDistrict: member.homeDistrict || '',
      placeOfStay: member.placeOfStay || '',
      houseNumber: member.houseNumber || '',
      educationalLevel: member.educationalLevel || '',
      occupation: member.occupation || '',
      isActive: member.isActive || false,
      membershipNumber: member.membershipNumber || '',
      belongsToSociety: member.isBelongToSociety || false,
      societyName: member.societyName.map((id) => Number(id)),
      // Default discriminated union fields - setting valid defaults
      isBaptized: false,
      isFirstCommunion: false,
      isConfirmed: false,
      employmentStatus: 'unemployed' as const,
      maritalStatus: 'single' as const,
    } as unknown as UpdateMember
  }, [member])

  const handleSave = (data: UpdateMember) => {
    updateMember.mutateAsync(data, {
      onSuccess() {
        form.reset()
        setIsOpen(false)
        setFormStep(POSSIBLE_FORM_STEPS[0])
      },
    })
  }

  console.log(form.formState.errors)
  const formStepNumber = useMemo(() => {
    return (
      MEMBER_FORM_SECTIONS.findIndex((section) => section.title === formStep) +
      1
    )
  }, [formStep, MEMBER_FORM_SECTIONS])

  const formStepProgress = useMemo(
    () =>
      ((POSSIBLE_FORM_STEPS.indexOf(formStep) + 1) /
        POSSIBLE_FORM_STEPS.length) *
      100,
    [formStep, POSSIBLE_FORM_STEPS],
  )

  const form = useForm<UpdateMember>({
    mode: attempedNext ? 'onChange' : undefined,
    resolver: standardSchemaResolver(updateMemberSchema),
    defaultValues: getDefaultValues(),
  })

  const nextFormStep = useCallback(async () => {
    const section = MEMBER_FORM_SECTIONS.find((s) => s.title === formStep)

    // Get all field names from the current form step
    const fieldNames: Array<FieldPath<UpdateMember>> = [
      ...(section?.fields.map((field) => field.name) ?? []),
    ] as Array<FieldPath<UpdateMember>>

    // Add fields from childSections if they should be visible
    section?.childSections?.forEach((childSection) => {
      if (childSection.dependsOn) {
        const dependsOnValue = form.getValues(
          childSection.dependsOn as FieldPath<UpdateMember>,
        )
        if (childSection.dependsOnValue?.includes(dependsOnValue)) {
          childSection.fields.forEach((field) => {
            fieldNames.push(field.name as FieldPath<UpdateMember>)
          })
        }
      } else {
        // If no dependsOn, always include
        childSection.fields.forEach((field) => {
          fieldNames.push(field.name as FieldPath<UpdateMember>)
        })
      }
    })

    // Add fields from subSections if they should be visible
    section?.subSections?.forEach((subSection) => {
      if (subSection.dependsOn) {
        const dependsOnValue = form.getValues(
          subSection.dependsOn as FieldPath<UpdateMember>,
        )
        if (subSection.dependsOnValue?.includes(dependsOnValue)) {
          subSection.fields.forEach((field) => {
            fieldNames.push(field.name as FieldPath<UpdateMember>)
          })
        }
      } else {
        // If no dependsOn, always include
        subSection.fields.forEach((field) => {
          fieldNames.push(field.name as FieldPath<UpdateMember>)
        })
      }
    })

    // Validate all field names
    const isValid = await form.trigger(fieldNames)

    if (!isValid) {
      setAttempedNext(true)
      toast.error('Please fill in all the required fields')
      return
    }
    setAttempedNext(false)
    // If valid, set the next form step
    setFormStep(POSSIBLE_FORM_STEPS[POSSIBLE_FORM_STEPS.indexOf(formStep) + 1])
  }, [formStep, POSSIBLE_FORM_STEPS, form, MEMBER_FORM_SECTIONS])

  const prevFormStep = useCallback(() => {
    if (POSSIBLE_FORM_STEPS.indexOf(formStep) === 0) return
    setFormStep(POSSIBLE_FORM_STEPS[POSSIBLE_FORM_STEPS.indexOf(formStep) - 1])
  }, [formStep, POSSIBLE_FORM_STEPS])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-5xl h-fit max-h-[96vh]">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-2">
            {POSSIBLE_FORM_STEPS.indexOf(formStep) > 0 && (
              <Button
                variant="secondary"
                onClick={prevFormStep}
                size="icon-sm"
                className="rounded-full"
              >
                <ArrowLeft className="size-6 text-muted-foreground" />
              </Button>
            )}
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription className="sr-only">
              Edit member information
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <Progress
              value={formStepProgress}
              className="h-2 flex-1 [&>div]:bg-green-500 bg-green-100"
            />{' '}
            <span className="text-sm text-muted-foreground font-medium flex-shrink-0">
              {formStepNumber} of {POSSIBLE_FORM_STEPS.length}
            </span>
          </div>
        </DialogHeader>

        <AddMemberForm
          formStep={formStep}
          // @ts-expect-error we should expect an error since the form intially is for add a member
          form={form}
          MEMBER_FORM_SECTIONS={MEMBER_FORM_SECTIONS}
        />

        <DialogFooter>
          <div className="flex items-center justify-end w-full gap-4">
            {POSSIBLE_FORM_STEPS.indexOf(formStep) > 0 && (
              <Button
                disabled={form.formState.isSubmitting}
                variant="outline"
                onClick={prevFormStep}
                size="lg"
                className="text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary"
              >
                Previous
              </Button>
            )}

            {POSSIBLE_FORM_STEPS.indexOf(formStep) <
              POSSIBLE_FORM_STEPS.length - 1 && (
              <Button
                onClick={nextFormStep}
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                Next
              </Button>
            )}

            {POSSIBLE_FORM_STEPS.indexOf(formStep) ===
              POSSIBLE_FORM_STEPS.length - 1 && (
              <Button
                size="lg"
                onClick={form.handleSubmit(handleSave)}
                disabled={form.formState.isSubmitting}
              >
                <span className="font-medium text-base">
                  {form.formState.isSubmitting ? 'Updating...' : 'Update'}
                </span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditMemberDialog
