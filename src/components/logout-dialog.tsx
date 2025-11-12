import { useNavigate } from '@tanstack/react-router'
import { useAuthMutations } from '../services/auth/mutations'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface LogoutDialogProps {
  children: React.ReactNode
}

export function LogoutDialog({ children }: LogoutDialogProps) {
  const {
    logout: { mutateAsync },
  } = useAuthMutations()
  const navigate = useNavigate()

  const handleLogout = () => {
    mutateAsync(undefined, {
      onSuccess: () => {
        navigate({
          to: '/login',
        })
      },
    })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[300px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-semibold">Log out</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-6 text-center">
          <p className="text-muted-foreground text-sm">
            Are you sure you want to Log out? You can login anytime
          </p>
        </div>
        <DialogFooter className="px-6 py-4 flex justify-between gap-3">
          <DialogClose asChild>
            <button
              type="button"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
            onClick={handleLogout}
          >
            Log out
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
