import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import type { Notification } from '@/services/notifications/types'
import { notificationsQueryOptions } from '@/services/notifications/queries'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface NotificationPopoverProps {
  open: boolean
  onClose: () => void
}

export function NotificationPopover({
  open,
  onClose,
}: NotificationPopoverProps) {
  if (!open) return null

  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useQuery(notificationsQueryOptions())
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="fixed right-4 top-4 w-full max-w-md bg-background rounded-xl shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Notifications
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[calc(100dvh_-_100px)] overflow-y-auto">
          {isLoading ? (
            <NotificationSkeleton />
          ) : error ? (
            <NotificationErrorState error={error} onRetry={() => refetch()} />
          ) : !notifications || notifications.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function NotificationItem({ notification }: { notification: Notification }) {
  // use first 2 letters of the createdBy
  const initials = useMemo(
    () => notification.createdBy?.slice(0, 2).toUpperCase() || '',
    [notification.id],
  )
  return (
    <div className="flex items-start gap-3 px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border last:border-b-0">
      {/* Avatar with unread indicator */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium text-gray-800 bg-gray-100',
          )}
        >
          {initials}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm">{notification.createdBy}</p>
        <p className="text-xs">
          <span className="font-normal text-sm text-muted-foreground">
            {notification.action}
          </span>
        </p>
      </div>

      {/* Time */}
      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
        {formatDistanceToNow(new Date(notification.modifiedDate), {
          addSuffix: true,
        })}
      </span>
    </div>
  )
}

function NotificationSkeleton() {
  return (
    <div className="px-6 py-4 space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 border-b border-border last:border-b-0 pb-4 last:pb-0"
        >
          {/* Avatar skeleton */}
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          {/* Content skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          {/* Time skeleton */}
          <Skeleton className="h-3 w-20 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

function NotificationErrorState({
  error,
  onRetry,
}: {
  error: unknown
  onRetry: () => void
}) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'An error occurred while loading notifications.'

  return (
    <div className="px-6 py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load notifications</AlertTitle>
        <AlertDescription className="mt-2 space-y-3">
          <p className="text-sm">{errorMessage}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

function NotificationEmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <X className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No notifications</p>
        <p className="text-xs text-muted-foreground">
          You're all caught up! Check back later for new updates.
        </p>
      </div>
    </div>
  )
}
