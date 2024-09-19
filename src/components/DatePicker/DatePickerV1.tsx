import { CalendarDays } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/utils/utils'
import { Calendar, CalendarProps } from '../ui/calendar'

export type DatePickerProps = Omit<CalendarProps, 'onSelect'> & {
  className?: string
  style?: React.CSSProperties
  onChange?: (date: Date | undefined) => void
  value?: Date
}

export default function DatePickerV1({ className, style, onChange, value, ...props }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  useEffect(() => {
    setDate(value)
  }, [value])

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='icon'
          size='icon'
          className={cn('justify-start text-left font-normal w-auto', !date && 'text-muted-foreground')}
        >
          <CalendarDays className='mr-2 h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', className)} style={style}>
        <Calendar
          {...props}
          mode='single'
          captionLayout='dropdown-buttons'
          selected={date}
          onDayClick={(selectedDate) => {
            setDate(selectedDate)
            onChange?.(selectedDate)
            setIsCalendarOpen(false)
          }}
          initialFocus
          fromYear={1960}
          toYear={2035}
        />
      </PopoverContent>
    </Popover>
  )
}
