import { CalendarIcon } from 'lucide-react'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/utils/utils'
import { Calendar, CalendarProps } from '../ui/calendar'

export type DatePickerProps = Omit<CalendarProps, 'onSelect'> & {
  className?: string
  style?: React.CSSProperties
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  value?: Date
}

export default function DatePicker({ className, style, onChange, placeholder, value, ...props }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)

  useEffect(() => {
    setDate(value)
  }, [value])

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  useEffect(() => {
    setDate(value)
  }, [value])
  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn('justify-start text-left font-normal w-full', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? dayjs(date).format('MMM DD, YYYY') : <span>{placeholder ?? 'Pick a date'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', className)} style={style}>
        <Calendar
          {...props}
          mode='single'
          captionLayout='dropdown-buttons'
          selected={date}
          onSelect={(selectedDate) => {
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
