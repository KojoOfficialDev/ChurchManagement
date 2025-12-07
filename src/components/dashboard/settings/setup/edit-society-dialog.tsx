import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Society } from '@/services/societies/societies.service'
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
import { useSocietiesMutations } from '@/services/societies/mutations'
import { Label } from '@/components/ui/label'

type EditSocietyDialogProps = {
  society: Society
  children: ReactNode
}

const EditSocietyDialog = ({ society, children }: EditSocietyDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(society.name)
  const [error, setError] = useState<string | null>(null)
  const {
    editSociety: { mutateAsync, isPending },
  } = useSocietiesMutations()

  useEffect(() => {
    if (isOpen) {
      setName(society.name)
      setError(null)
    }
  }, [isOpen, society.name])

  const handleSave = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Name is required')
      return
    }

    try {
      await mutateAsync({ id: society.id, name: trimmedName })
      setIsOpen(false)
    } catch {
      // toast handled inside mutation hook
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm space-y-4">
        <DialogHeader>
          <DialogTitle>Edit Society</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label>Society Name</Label>
          <Input
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (error) {
                setError(null)
              }
            }}
            placeholder="Society name"
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
            disabled={
              isPending || !name.trim() || name.trim() === society.name.trim()
            }
          >
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditSocietyDialog
