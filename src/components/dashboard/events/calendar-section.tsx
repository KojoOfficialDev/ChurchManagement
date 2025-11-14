import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'

export const CalendarSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <Card className="p-0">
      <CardContent>
        <Calendar
          mode="single"
          className="[--cell-size:--spacing(10)] w-full"
          onSelect={(newDate) => setDate(newDate)}
          selected={date}
        />
      </CardContent>
    </Card>
  )
}
