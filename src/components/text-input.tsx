import React, { memo, useState } from 'react'
import { CheckIcon, CopyIcon, Eye, EyeOff } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { Input } from './ui/input'
import { TooltipBuilder } from './tooltip-builder'
import type { Control, FieldValues, Path } from 'react-hook-form'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type TextInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  type?: 'text' | 'password' | 'email' | 'tel' | 'number' | 'time'
  placeholder?: string
  allowCopy?: boolean
  required?: boolean
  label?: string
  error?: string
  name: Path<TFieldValues>
  labelClassName?: string
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'name'
  | 'required'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'id'
  | 'placeholder'
>

const TextInputComponent = <TFieldValues extends FieldValues>({
  control,
  type = 'text',
  placeholder,
  error,
  name,
  required = false,
  label,
  labelClassName,
  allowCopy = false,
  ...rest
}: TextInputProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const inputType = () => {
    if (type === 'password' && showPassword) return 'text'
    return type
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: unknown) => void,
  ) => {
    if (type === 'number') {
      const value = e.target.value === '' ? undefined : Number(e.target.value)
      onChange(value)
    } else {
      onChange(e.target.value)
    }
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
        <div>
          <div className="space-y-2">
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  `block text-sm font-medium text-foreground `,
                  labelClassName,
                )}
              >
                {label}
              </label>
            )}

            <div className="relative">
              <Input
                aria-invalid={!!error}
                type={inputType()}
                onBlur={onBlur}
                onChange={(e) => handleChange(e, onChange)}
                {...rest}
                value={value}
                id={name}
                placeholder={placeholder}
                className={cn(
                  'h-12 bg-white border-[#dadada] text-[#1d2939] placeholder:text-[#b0b0b0]',
                  rest.className,
                )}
                required={required}
              />
              {allowCopy && typeof value === 'string' && <Copy value={value} />}
              {type === 'password' && (
                <WhichEye
                  showPassword={showPassword}
                  togglePassword={togglePassword}
                />
              )}
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
          )}
        </div>
      )}
    />
  )
}

TextInputComponent.displayName = 'TextInput'

const TextInput = TextInputComponent as <TFieldValues extends FieldValues>(
  props: TextInputProps<TFieldValues>,
) => React.JSX.Element

type WhichEyeProps = {
  showPassword: boolean
  togglePassword: () => void
}
const WhichEye = memo(
  ({ showPassword, togglePassword }: WhichEyeProps) => {
    if (showPassword)
      return (
        <EyeOff
          className="absolute top-3 right-4"
          onClick={() => togglePassword()}
        />
      )
    return (
      <Eye
        className="absolute top-3 right-4"
        onClick={() => togglePassword()}
      />
    )
  },
  (prevProps, nextProps) => {
    return prevProps.showPassword === nextProps.showPassword
  },
)

const Copy = memo(
  ({ value }: { value: string }) => {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
      if (copied) return
      navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
    return (
      <TooltipBuilder content={copied ? 'Copied' : 'Copy provisional password'}>
        <div
          onClick={handleCopy}
          className={cn('absolute right-16 top-3 h-4 w-4', {
            'cursor-pointer': !copied,
          })}
        >
          <CheckIcon
            className={cn(
              'absolute transition-all duration-300 ease-in-out',
              copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
            )}
          />
          <CopyIcon
            className={cn(
              'absolute transition-all duration-300 ease-in-out text-muted-foreground',
              copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
            )}
          />
        </div>
      </TooltipBuilder>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.value === nextProps.value
  },
)

WhichEye.displayName = 'WhichEye'
Copy.displayName = 'Copy'
export { TextInput }
