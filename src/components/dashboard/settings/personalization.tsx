import { useCallback, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ChurchNotificationSettings } from '@/services/setup/types'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { churchProfileQuery } from '@/services/setup/queries'
import { useSetupMutations } from '@/services/setup/mutations'

export function Personalization() {
  const { data: churchProfile } = useSuspenseQuery(churchProfileQuery)

  const [smsEnabled, setSmsEnabled] = useState(churchProfile?.sendSms)
  const [eventsAlert, setEventsAlert] = useState(
    churchProfile?.sendAnnouncements,
  )
  const [birthdayAlert, setBirthdayAlert] = useState(
    churchProfile?.sendBirthdayAlerts,
  )
  const {
    updateChurchNotificationSettings: { mutateAsync },
  } = useSetupMutations()

  const handleUpdateNotificationSettings = async (
    data: ChurchNotificationSettings,
    rollback: () => void,
  ) => {
    await mutateAsync(
      { ...churchProfile, ...data },
      {
        onError: () => {
          // rollback the state changes
          rollback()
        },
      },
    )
  }

  const handleSmsChange = useCallback(
    (checked: boolean) => {
      setSmsEnabled(checked)
      handleUpdateNotificationSettings(
        {
          sendSms: checked,
          sendAnnouncements: eventsAlert,
          sendBirthdayAlerts: birthdayAlert,
        },
        () => setSmsEnabled(!checked),
      )
    },
    [mutateAsync],
  )
  const handleEventsAlertChange = useCallback(
    (checked: boolean) => {
      setEventsAlert(checked)
      handleUpdateNotificationSettings(
        {
          sendSms: smsEnabled,
          sendAnnouncements: checked,
          sendBirthdayAlerts: birthdayAlert,
        },
        () => setEventsAlert(!checked),
      )
    },
    [mutateAsync],
  )
  const handleBirthdayAlertChange = useCallback(
    (checked: boolean) => {
      setBirthdayAlert(checked)
      handleUpdateNotificationSettings(
        {
          sendSms: smsEnabled,
          sendAnnouncements: eventsAlert,
          sendBirthdayAlerts: checked,
        },
        () => setBirthdayAlert(!checked),
      )
    },
    [mutateAsync],
  )
  return (
    <div className="space-y-6">
      {/* SMS Notification Toggle Card */}
      <div className="border border-border rounded-lg p-5 max-w-md">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">
              Allow SMS notification
            </h3>
            <p className="text-sm text-muted-foreground">
              Member will received important announcement through SMS
            </p>
          </div>
          <Switch
            checked={smsEnabled}
            onCheckedChange={handleSmsChange}
            className="data-[state=checked]:bg-violet-600"
          />
        </div>
      </div>

      {/* Alert Checkboxes */}
      <div className="space-y-4 pl-1">
        <div className="flex items-center gap-3">
          <Checkbox
            id="events-alert"
            checked={eventsAlert}
            onCheckedChange={handleEventsAlertChange}
            className="border-muted-foreground/40 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
          />
          <Label
            htmlFor="events-alert"
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            Events Alert
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="birthday-alert"
            checked={birthdayAlert}
            onCheckedChange={handleBirthdayAlertChange}
            className="border-muted-foreground/40 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
          />
          <Label
            htmlFor="birthday-alert"
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            Birthday Alert
          </Label>
        </div>
      </div>
    </div>
  )
}
