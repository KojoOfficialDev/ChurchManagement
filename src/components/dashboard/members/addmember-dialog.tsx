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
import { ArrowLeft } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import {
  createMemberSchema,
  type CreateMember,
  type EmploymentStatus,
  type Gender,
  type MaritalStatus,
} from '@/services/members/members.dto'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm, type FieldPath } from 'react-hook-form'
import {
  AddMemberForm,
  type FormSteps,
} from '@/components/dashboard/members/add-member-form'
import { MEMBER_FORM_SECTIONS } from '@/lib/constants'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

const AddmemberDialog = () => {
  const [attempedNext, setAttempedNext] = useState(false)
  const POSSIBLE_FORM_STEPS = useMemo(
    () => MEMBER_FORM_SECTIONS.map((section) => section.title) as FormSteps[],
    [MEMBER_FORM_SECTIONS],
  )
  const [formStep, setFormStep] = useState<FormSteps>(
    POSSIBLE_FORM_STEPS[2] as FormSteps,
  )

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
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      whatsapp: '',
      ghanaCardNumber: '',
      gender: undefined as unknown as Gender,
      dob: undefined,
      placeOfBirth: '',
      nationality: '',
      region: '',
      homeTown: '',
      placeOfResidence: '',
      homeAddress: '',
      maritalStatus: undefined as unknown as MaritalStatus,
      spouseName: '',
      numberOfChildren: 0,
      namesOfChildren: '',
      academicQualification: '',
      employmentStatus: undefined as unknown as EmploymentStatus,
      occupation: '',
      placeOfWork: '',
      activeMembership: false,
      baptismStatus: false,
      communicantStatus: false,
      confirmationStatus: false,
      societiesStatus: false,
      societies: [],
      membershipNumber: '',
      baptismDate: undefined,
      placeOfBaptism: '',
      dateOfConfirmation: undefined,
      placeOfConfirmation: '',
      dateOfCommunion: undefined,
      placeOfCommunion: '',
    },
  })

  const nextFormStep = useCallback(async () => {
    // get all the field names in the current form step
    const fieldNames = (MEMBER_FORM_SECTIONS.find(
      (section) => section.title === formStep,
    )?.fields.map((field) => field.name) ?? []) as FieldPath<CreateMember>[]

    // validate these field names
    const isValid = await form.trigger(fieldNames)

    if (!isValid) {
      setAttempedNext(true)
      toast.error('Please fill in all the required fields')
      return
    }
    setAttempedNext(false)
    // if valid, set the next form step
    setFormStep(
      POSSIBLE_FORM_STEPS[
        POSSIBLE_FORM_STEPS.indexOf(formStep) + 1
      ] as FormSteps,
    )
  }, [formStep, POSSIBLE_FORM_STEPS])

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
        <Button size={'lg'}>
          <span className="font-medium text-base">Add New Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl h-[90vh]">
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
              className="h-2 flex-1 [&>div]:bg-green-500"
            />{' '}
            <span className="text-sm text-muted-foreground font-medium flex-shrink-0">
              {formStepNumber} of {POSSIBLE_FORM_STEPS.length}
            </span>
          </div>
        </DialogHeader>

        <AddMemberForm formStep={formStep} form={form} />
        <DialogFooter>
          <div className="flex items-center justify-end w-full gap-4">
            {POSSIBLE_FORM_STEPS.indexOf(formStep) > 0 && (
              <Button
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
              <Button onClick={nextFormStep} size="lg">
                Next
              </Button>
            )}

            {POSSIBLE_FORM_STEPS.indexOf(formStep) ===
              POSSIBLE_FORM_STEPS.length - 1 && (
              <Button size="lg">
                <span className="font-medium text-base">Save</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddmemberDialog
