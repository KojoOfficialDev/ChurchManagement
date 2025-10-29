import {
  
  Controller
  
  
} from 'react-hook-form'
import { useCallback } from 'react'
import ImageUpload from './image-upload'
import type {Control, FieldValues, Path} from 'react-hook-form';
import { cn } from '@/lib/utils'

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
          <div className="space-y-3">
            {label && (
              <label
                htmlFor={name}
                className={cn('font-medium', labelClassName)}
              >
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
