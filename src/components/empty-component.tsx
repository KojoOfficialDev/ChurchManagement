import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type EmptyComponentProps = {
  title: string
  description: string
  buttonText: string
  buttonOnClick: (() => void) | React.ReactElement
  media?: React.ReactNode
}
export function EmptyComponent({
  title,
  description,
  buttonText,
  buttonOnClick,
  media,
}: EmptyComponentProps) {
  return (
    <Empty>
      <EmptyHeader>
        {media && <EmptyMedia variant="default">{media}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {typeof buttonOnClick === 'function' ? (
          <Button size="sm" onClick={() => buttonOnClick()}>
            {buttonText}
          </Button>
        ) : (
          buttonOnClick
        )}
      </EmptyContent>
    </Empty>
  )
}
