export interface SelectCreatableConfig {
  /** Button text at bottom of select */
  buttonText?: string
  /** Dialog title */
  dialogTitle?: string
  /** Dialog description */
  dialogDescription?: string
  /** Input label for default form */
  inputLabel?: string
  /** Input placeholder for default form */
  inputPlaceholder?: string
  /** Submit button text */
  submitButtonText?: string
  /** Cancel button text */
  cancelButtonText?: string
  /** Callback when creating - receives input value, returns value to select */
  onCreate: (value: string) => SelectType | Promise<SelectType>
  /** Optional custom dialog content - replaces default form */
  customContent?: (props: {
    onSuccess: (value: SelectType) => void
    onCancel: () => void
  }) => React.ReactNode
  /** Show generic title/description with sr-only when not provided */
  hideDefaultLabels?: boolean
}

export type Church = {
  id: number
  name: string
  code: string
  active: boolean
  sendSms: boolean
  sendBirthdayAlerts: boolean
  sendAnnouncements: boolean
  churchContact: string
  churchEmail: string
  parentChurch?: string
  isAnOutStation?: boolean
  clientType: string
  smsTotal: number
  smsBalance: number
  lastSubscriptionDate: string
  logoUrl: string
}

export type FormFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'file'
  | 'multi-select'
  | 'member-search'
export type FormField = {
  name: string
  label: string
  type: FormFieldType
  placeholder?: string
  rows?: number
  options?: Array<{ label: string; value: string | number }>
  disabled?: boolean | ((value?: string | Date) => boolean)
  dependsOn?: FormField['name']
  dependsOnValue?: Array<string | boolean | number | Date>
  autoFills?: Array<string> // Field names to auto-check when this field is checked
  autoClearsFrom?: Array<string> // Field names that should auto-uncheck when this is unchecked
  allowCreate?: boolean
  createConfig?: SelectCreatableConfig
  onUpload?: (file: File) => string | Promise<string>
  onUploadComplete?: (url: string) => void
  onMemberSelect?: (member: any) => void // Callback when a member is selected
}
export type FormSection = {
  title: string
  fields: Array<FormField>
  subSections?: Array<FormSection>
  dependsOn?: FormField['name']
  dependsOnValue?: Array<string | boolean | number | Date>
  childSections?: Array<FormSection>
}

export type SelectType = {
  value: string
  label: string
}

export type Pagination = {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}
