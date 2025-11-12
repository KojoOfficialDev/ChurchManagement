import { format, isValid, parseISO } from 'date-fns'

type InfoItem = {
  label: string
  value: string | number | boolean | Array<string>
}

type MemberInfoSectionProps = {
  title: string
  data: Array<InfoItem>
}

export const MemberInfoSection = ({ title, data }: MemberInfoSectionProps) => {
  const formatValue = (
    value: string | number | boolean | Array<string> | Date,
  ) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'N/A'
    }
    if (value instanceof Date) {
      return format(value, 'dd/MM/yyyy')
    }
    if (typeof value === 'string') {
      const parsed = parseISO(value)
      if (isValid(parsed)) {
        return format(parsed, 'dd/MM/yyyy')
      }
    }
    return value || 'N/A'
  }

  return (
    <main className="flex-1 flex flex-col gap-3">
      <h2 className="font-text-md-medium font-[number:var(--text-md-medium-font-weight)] text-gray-600 text-[length:var(--text-md-medium-font-size)] tracking-[var(--text-md-medium-letter-spacing)] leading-[var(--text-md-medium-line-height)] [font-style:var(--text-md-medium-font-style)]">
        {title}
      </h2>

      <div className="flex flex-col gap-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-[#cfd4dc]"
          >
            <span className="font-semibold text-sm">{item.label}</span>
            <span className="font-text-md-medium font-[number:var(--text-md-medium-font-weight)] text-gray-600 text-[length:var(--text-md-medium-font-size)] tracking-[var(--text-md-medium-letter-spacing)] leading-[var(--text-md-medium-line-height)] [font-style:var(--text-md-medium-font-style)]">
              {formatValue(item.value)}
            </span>
          </div>
        ))}
      </div>
    </main>
  )
}
