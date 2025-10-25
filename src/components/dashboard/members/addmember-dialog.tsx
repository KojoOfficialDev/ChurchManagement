import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createMemberSchema,
  type CreateMember,
} from '@/services/members/members.dto'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm, type FieldPath } from 'react-hook-form'
import {
  AddMemberForm,
  type FormSteps,
} from '@/components/dashboard/members/add-member-form'
import { useMemberForm } from '@/services/members/members.form'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { useSuspenseQueries } from '@tanstack/react-query'
import { getNationalitiesOptions } from '@/services/nationalities/queries'
import { generateMemberIdOptions } from '@/services/members/queries'
import { useMembersMutations } from '@/services/members/mutations'
import { getSocietiesOptions } from '@/services/societies/queries'

const AddmemberDialog = () => {
  const [nationsRes, societiesRes, memberIdRes] = useSuspenseQueries({
    queries: [
      getNationalitiesOptions,
      getSocietiesOptions,
      generateMemberIdOptions,
    ],
  })
  const { createMember } = useMembersMutations()

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
    () => MEMBER_FORM_SECTIONS.map((section) => section.title) as FormSteps[],
    [MEMBER_FORM_SECTIONS],
  )
  const [formStep, setFormStep] = useState<FormSteps>(
    POSSIBLE_FORM_STEPS[0] as FormSteps,
  )
  const handleSave = (data: CreateMember) => {
    createMember.mutateAsync(data)
  }

  const formStepNumber = useMemo(() => {
    return (
      MEMBER_FORM_SECTIONS.findIndex((section) => section.title === formStep) +
      1
    )
  }, [formStep, POSSIBLE_FORM_STEPS])

  const formStepProgress = useMemo(
    () =>
      ((POSSIBLE_FORM_STEPS.indexOf(formStep) + 1) /
        POSSIBLE_FORM_STEPS.length) *
      100,
    [formStep, POSSIBLE_FORM_STEPS],
  )
  const form = useForm<CreateMember>({
    mode: attempedNext ? 'onChange' : undefined,
    resolver: standardSchemaResolver(createMemberSchema),
    defaultValues: {
      membershipNumber: memberIdRes.data ?? '',
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      gender: undefined,
      dob: undefined,
      placeOfBirth: '',
      nationality: '',
      region: '',
      homeTown: '',
      placeOfResidence: '',
      homeAddress: '',
      academicQualification: '',
      occupation: '',
      isActive: false,
      // Discriminated unions - default to false for all
      isBaptized: false,
      isFirstCommunion: false,
      isConfirmed: false,
      employmentStatus: undefined,
      maritalStatus: undefined,
      belongsToSociety: false,
      societyName: [],
    },
  })

  // Update membership number when it becomes available from the query
  useEffect(() => {
    if (memberIdRes.data) {
      form.setValue('membershipNumber', memberIdRes.data)
    }
  }, [memberIdRes.data, form])

  const nextFormStep = useCallback(async () => {
    const section = MEMBER_FORM_SECTIONS.find(
      (section) => section.title === formStep,
    )

    // Get all field names from the current form step
    const fieldNames: FieldPath<CreateMember>[] = [
      ...(section?.fields.map((field) => field.name) ?? []),
    ] as FieldPath<CreateMember>[]

    // Add fields from childSections if they should be visible
    section?.childSections?.forEach((childSection) => {
      if (childSection.dependsOn) {
        const dependsOnValue = form.getValues(
          childSection.dependsOn as FieldPath<CreateMember>,
        )
        if (childSection.dependsOnValue?.includes(dependsOnValue)) {
          childSection.fields.forEach((field) => {
            fieldNames.push(field.name as FieldPath<CreateMember>)
          })
        }
      } else {
        // If no dependsOn, always include
        childSection.fields.forEach((field) => {
          fieldNames.push(field.name as FieldPath<CreateMember>)
        })
      }
    })

    // Add fields from subSections if they should be visible
    section?.subSections?.forEach((subSection) => {
      if (subSection.dependsOn) {
        const dependsOnValue = form.getValues(
          subSection.dependsOn as FieldPath<CreateMember>,
        )
        if (subSection.dependsOnValue?.includes(dependsOnValue)) {
          subSection.fields.forEach((field) => {
            fieldNames.push(field.name as FieldPath<CreateMember>)
          })
        }
      } else {
        // If no dependsOn, always include
        subSection.fields.forEach((field) => {
          fieldNames.push(field.name as FieldPath<CreateMember>)
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
    setFormStep(
      POSSIBLE_FORM_STEPS[
        POSSIBLE_FORM_STEPS.indexOf(formStep) + 1
      ] as FormSteps,
    )
  }, [formStep, POSSIBLE_FORM_STEPS, form])

  const prevFormStep = useCallback(() => {
    if (POSSIBLE_FORM_STEPS.indexOf(formStep) === 0) return
    setFormStep(
      POSSIBLE_FORM_STEPS[
        POSSIBLE_FORM_STEPS.indexOf(formStep) - 1
      ] as FormSteps,
    )
  }, [formStep, POSSIBLE_FORM_STEPS])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'} className="flex items-center gap-2">
          Add New Member <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
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
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription className="sr-only">
              Add a new member to the church
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
                  {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                </span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddmemberDialog
