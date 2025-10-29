import React, { useCallback, useState } from 'react'
import { Controller } from 'react-hook-form'
import { CheckIcon, Loader2, Search, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import type { Control, FieldValues, Path } from 'react-hook-form'
import type { Member } from '@/services/members/types'
import { cn } from '@/lib/utils'
import { MembersService } from '@/services/members/members.service'
import { useDebounce } from '@/lib/hooks/use-debounce'

type MemberSearchInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  onMemberSelect?: (member?: Member) => void
}

const MemberSearchInputComponent = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
  placeholder = 'Search for a member...',
  disabled = false,
  onMemberSelect,
}: MemberSearchInputProps<TFieldValues>) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ['members-search', debouncedSearch],
    queryFn: () =>
      MembersService.getAllMembers({
        page: 1,
        pageSize: 20,
        search: debouncedSearch || undefined,
      }),
    enabled: open,
  })

  const handleMemberSelect = useCallback(
    (member: Member, onChange: (value: string) => void) => {
      onChange(member.membershipNumber)
      setOpen(false)
      onMemberSelect?.(member)
    },
    [onMemberSelect],
  )

  const handleClear = useCallback((onChange: (value: string) => void) => {
    setSearch('')
    onChange('')
    onMemberSelect?.(undefined)
  }, [])

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
                className="block text-sm font-medium text-foreground"
              >
                {label}
              </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    aria-invalid={!!error}
                    type="text"
                    onBlur={onBlur}
                    value={value || ''}
                    id={name}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly
                    className={cn(
                      'h-12 bg-white border-[#dadada] text-[#1d2939] placeholder:text-[#b0b0b0] px-12 cursor-pointer',
                    )}
                  />
                  <X
                    className="absolute right-4 top-4 h-4 w-4 text-muted-foreground cursor-pointer"
                    onClick={() => handleClear(onChange)}
                  />
                  <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                  <div>
                    <CommandInput
                      placeholder="Search by name or membership ID..."
                      value={search}
                      onValueChange={setSearch}
                    />
                  </div>
                  <CommandList>
                    {isLoading && (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {!isLoading && data?.data && data.data.length === 0 && (
                      <CommandEmpty>No members found.</CommandEmpty>
                    )}
                    {!isLoading && data?.data && data.data.length > 0 && (
                      <CommandGroup heading="Members">
                        {data.data.map((member) => {
                          const isSelected = value === member.membershipNumber
                          return (
                            <CommandItem
                              key={member.id}
                              value={member.id}
                              onSelect={() =>
                                handleMemberSelect(member, onChange)
                              }
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  isSelected ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {member.firstName} {member.middleName}{' '}
                                  {member.lastName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ID: {member.membershipNumber}
                                </span>
                              </div>
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
          )}
        </div>
      )}
    />
  )
}

MemberSearchInputComponent.displayName = 'MemberSearchInput'

const MemberSearchInput = MemberSearchInputComponent as <
  TFieldValues extends FieldValues,
>(
  props: MemberSearchInputProps<TFieldValues>,
) => React.JSX.Element

export { MemberSearchInput }
