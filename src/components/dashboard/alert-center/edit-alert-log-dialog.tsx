import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAlertsMutations } from '@/services/alerts/mutations'

type EditAlertLogDialogProps = {
  message: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditAlertLogDialog = ({
  message,
  open,
  onOpenChange,
}: EditAlertLogDialogProps) => {
  const [formData, setFormData] = useState({
    id: message.id,
    recipientName: message.recipientName || '',
    phoneNumber: message.phoneNumber || '',
    message: message.message || '',
    messageType: message.messageType || '',
    status: message.status || '',
    deliveryStatus: message.deliveryStatus || '',
  })

  const { updateAlertMessage } = useAlertsMutations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateAlertMessage.mutateAsync(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Alert Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="messageType">Message Type</Label>
              <Input
                id="messageType"
                value={formData.messageType}
                onChange={(e) =>
                  setFormData({ ...formData, messageType: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryStatus">Delivery Status</Label>
              <Input
                id="deliveryStatus"
                value={formData.deliveryStatus}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryStatus: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateAlertMessage.isPending}>
              {updateAlertMessage.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditAlertLogDialog
