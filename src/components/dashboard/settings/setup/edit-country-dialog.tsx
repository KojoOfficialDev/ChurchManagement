import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Nationalities } from '@/services/nationalities/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNationalitiesMutations } from '@/services/nationalities/mutations'

type EditCountryDialogProps = {
  country: Nationalities
  children: ReactNode
}

const EditCountryDialog = ({ country, children }: EditCountryDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(country.name)
  const [error, setError] = useState<string | null>(null)
  const {
    updateNationality: { mutateAsync, isPending },
  } = useNationalitiesMutations()

  useEffect(() => {
    if (isOpen) {
      setName(country.name)
      setError(null)
    }
  }, [isOpen, country.name])

  const handleSave = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name is required')
      return
    }

    try {
      await mutateAsync({ id: country.id, name: trimmed })
      setIsOpen(false)
    } catch {
      // errors handled by mutation hook
    }
  }

  const hasChanges = name.trim() !== country.name.trim()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm space-y-4">
        <DialogHeader>
          <DialogTitle>Edit Country</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="edit-country-name">Country Name</Label>
          <Input
            id="edit-country-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (error) {
                setError(null)
              }
            }}
            placeholder="Country name"
            disabled={isPending}
          />
          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={isPending || !name.trim() || !hasChanges}
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditCountryDialog


