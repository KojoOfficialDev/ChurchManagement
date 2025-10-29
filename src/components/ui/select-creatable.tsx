import * as React from 'react'
import { PlusCircle } from 'lucide-react'

import type { SelectCreatableConfig, SelectType } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Props for SelectCreatable component
 */
export interface SelectCreatableProps {
  config: SelectCreatableConfig
  onValueCreated?: (value: SelectType) => void
}

/**
 * SelectCreatable - A component that appears at the bottom of select items
 * allowing users to create new options via a dialog
 */
export function SelectCreatable({
  config,
  onValueCreated,
}: SelectCreatableProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [isCreating, setIsCreating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)


  // Destructure config with defaults
  const {
    buttonText = 'Create new...',
    dialogTitle = 'Create New Item',
    dialogDescription = 'Enter the details for the new item',
    inputLabel = 'Name',
    inputPlaceholder = 'Enter name...',
    submitButtonText = 'Create',
    cancelButtonText = 'Cancel',
    onCreate,
    customContent,
    hideDefaultLabels = false,
  } = config

  // // Auto-focus input when dialog opens
  // React.useEffect(() => {
  //   if (isDialogOpen && inputRef.current && !customContent) {
  //     // Small delay to ensure dialog is fully rendered
  //     const timer = setTimeout(() => {
  //       inputRef.current?.focus()
  //     }, 100)
  //     return () => clearTimeout(timer)
  //   }
  // }, [isDialogOpen, customContent])

  // Clear input and error when dialog closes
  React.useEffect(() => {
    if (!isDialogOpen) {
      setInputValue('')
      setError(null)
    }
  }, [isDialogOpen])

  const handleOpenDialog = (e: React.MouseEvent) => {
    // Prevent the select from closing
    e.preventDefault()
    e.stopPropagation()
    setIsDialogOpen(true)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setInputValue('')
    setError(null)
  }

  const handleSuccess = async (value: SelectType) => {
    if (!value.value.trim()) {
      setError('This field is required')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const createdValue = await onCreate(value.value.trim())

      // Close dialog
      setIsDialogOpen(false)

      // Notify parent with the created value
      onValueCreated?.(createdValue)

      // Reset state
      setInputValue('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item')
    } finally {
      setIsCreating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSuccess({ value: inputValue.trim(), label: inputValue.trim() })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSuccess({ value: inputValue.trim(), label: inputValue.trim() })
    }
  }

  // Determine if we should show title/description with sr-only
  const showTitleWithSrOnly = !dialogTitle || hideDefaultLabels
  const showDescriptionWithSrOnly = !dialogDescription || hideDefaultLabels

  return (
    <>
      {/* Create Button - styled to match SelectItem */}
      <div
        data-slot="select-creatable"
        role="button"
        tabIndex={0}
        onClick={handleOpenDialog}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleOpenDialog(e as any)
          }
        }}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none italic border-t border-border mt-1 pt-2",
          'hover:bg-accent hover:text-accent-foreground transition-colors',
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        )}
        aria-label={buttonText}
      >
        <PlusCircle className="size-4" />
        <span>{buttonText}</span>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={showTitleWithSrOnly ? 'sr-only' : ''}>
              {dialogTitle}
            </DialogTitle>
            <DialogDescription
              className={showDescriptionWithSrOnly ? 'sr-only' : ''}
            >
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>

          {/* Custom Content or Default Form */}
          {customContent ? (
            customContent({
              onSuccess: handleSuccess,
              onCancel: handleCancel,
            })
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-input">{inputLabel}</Label>
                <Input
                  id="create-input"
                  type="text"
                  placeholder={inputPlaceholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'create-error' : undefined}
                  disabled={isCreating}
                />
                {error && (
                  <p
                    id="create-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isCreating}
                >
                  {cancelButtonText}
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : submitButtonText}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
