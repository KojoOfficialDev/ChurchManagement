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
  secondaryButtonText?: string
  secondaryButtonOnClick?: (() => void) | React.ReactElement
  secondaryButtonVariant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link'
  secondaryButtonSize?: 'default' | 'sm' | 'lg'
  media?: React.ReactNode
}
export function EmptyComponent({
  title,
  description,
  buttonText,
  buttonOnClick,
  media,
  secondaryButtonText,
  secondaryButtonOnClick,
  secondaryButtonVariant = 'secondary',
  secondaryButtonSize = 'sm',
}: EmptyComponentProps) {
  return (
    <Empty>
      <EmptyHeader>
        {media && <EmptyMedia variant="default">{media}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex flex-row justify-center items-center gap-2">
        {typeof buttonOnClick === 'function' ? (
          <Button size="sm" onClick={() => buttonOnClick()}>
            {buttonText}
          </Button>
        ) : (
          buttonOnClick
        )}

        {secondaryButtonText &&
          secondaryButtonOnClick &&
          (typeof secondaryButtonOnClick === 'function' ? (
            <Button
              size={secondaryButtonSize}
              variant={secondaryButtonVariant}
              onClick={() => secondaryButtonOnClick()}
              className="bg-[#4a1fb71f] hover:bg-[#4a1fb71f] "
            >
              {secondaryButtonText}
            </Button>
          ) : (
            secondaryButtonOnClick
          ))}
      </EmptyContent>
    </Empty>
  )
}
