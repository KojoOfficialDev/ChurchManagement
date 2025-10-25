import { cn } from '@/lib/utils'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import ImageUpload from './image-upload'
import { useCallback } from 'react'

type ImageInputProps<TFieldValues extends FieldValues> = {
  label: string
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  error?: string
  placeholder?: string
  labelClassName?: string
  onUpload?: (file: File) => string | Promise<string>
}
const ImageInputComponent = <TFieldValues extends FieldValues>({
  label,
  name,
  control,
  error,
  labelClassName,
  onUpload,
}: ImageInputProps<TFieldValues>) => {
  const onUploadComplete = useCallback(
    (url: string, onChange: (value: string) => void) => {
      onChange(url)
    },
    [],
  )
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className="col-span-2">
          <div className="space-y-2">
            {label && (
              <label htmlFor={name} className={cn(labelClassName)}>
                {label}
              </label>
            )}
            <ImageUpload
              onUpload={onUpload}
              onUploadComplete={(url) => onUploadComplete(url, onChange)}
              value={value}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive px-2 -mt-2">{error}</p>
          )}
        </div>
      )}
    />
  )
}

const ImageInput = ImageInputComponent as <TFieldValues extends FieldValues>(
  props: ImageInputProps<TFieldValues>,
) => React.JSX.Element

export { ImageInput }
