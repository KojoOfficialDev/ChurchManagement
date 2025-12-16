import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNationalitiesMutations } from '@/services/nationalities/mutations'

type AddCountryDialogProps = {
  children: ReactNode
}

const AddCountryDialog = ({ children }: AddCountryDialogProps) => {
  const [name, setName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    createNationality: { mutateAsync, isPending },
  } = useNationalitiesMutations()

  const resetForm = () => {
    setName('')
    setError(null)
  }

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name is required')
      return
    }
    try {
      await mutateAsync(trimmed)
      resetForm()
      setIsOpen(false)
    } catch {
      // errors handled inside mutation hook
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm space-y-4">
        <DialogHeader>
          <DialogTitle>Add Country</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="country-name">Country Name</Label>
          <Input
            id="country-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (error) {
                setError(null)
              }
            }}
            placeholder="Enter country name"
            disabled={isPending}
          />
          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !name.trim()}
          type="button"
        >
          {isPending ? 'Adding...' : 'Add Country'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default AddCountryDialog

