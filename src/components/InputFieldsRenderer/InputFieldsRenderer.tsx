import React, { useCallback } from 'react'
import { Control, ControllerRenderProps, FieldValues } from 'react-hook-form'
import { InfoIcon } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Slider } from '../ui/slider'
import When from '../When/When'
import DatePicker from '../DatePicker/DatePicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

// @TODO: Add extraContent prop
type BaseInput = {
  id: string
  label: string
  className?: string
  style?: React.CSSProperties
  value?: any
  helpText?: string
}

type NumberInput = BaseInput & {
  type: 'number'
  hasRange?: boolean
  range?: {
    min: number
    max: number
    step: number
  }
}

type DateInput = BaseInput & {
  type: 'date'
  defaultDate?: Date
}

type Option = {
  id: string
  label: string | number
}

type MultiSelectInput = BaseInput & {
  type: 'multi-select'
  options: Option[]
  valueFormatter?: (value: string | number) => string | number
}

type SelectInput = BaseInput & {
  type: 'select'
  options: Option[]
  valueFormatter?: (value: string | number) => string | number
}

type TextInput = BaseInput & {
  type: 'text'
}

type RadioInput = BaseInput & {
  type: 'radio'
  options: Option[]
}

export type InputField = NumberInput | DateInput | MultiSelectInput | TextInput | SelectInput | RadioInput

type Props = {
  control: Control<any>
  inputs: InputField[]
}

export default function InputFieldsRenderer({ inputs, control }: Props) {
  const getFieldInput = useCallback((input: InputField, field: ControllerRenderProps<FieldValues, string>) => {
    switch (input.type) {
      case 'number': {
        return (
          <div className='space-y-2'>
            {
              (input.helpText && input.helpText !== '') ? <div
                className={'flex rounded-md items-center gap-2 border px-3 border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring'}
              >
                <Input
                  type='number'
                  placeholder={input.label}
                  {...field}
                  className='!border-none !outline-none p-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                  onChange={(e) => {
                    field.onChange(isNaN(e.target?.valueAsNumber) ? 0 : e.target?.valueAsNumber)
                  }}
                />
                <Popover>
                  <PopoverTrigger>
                    <div className='cursor-pointer'>
                      <InfoIcon className='w-4 h-4' />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="Text">
                      {input.helpText}
                    </div>
                  </PopoverContent>
                </Popover>
              </div> : <Input
                type='number'
                placeholder={input.label}
                {...field}
                onChange={(e) => {
                  field.onChange(e.target?.valueAsNumber)
                }}
              />}
            <When truthy={Boolean(input.hasRange)}>
              <Slider
                defaultValue={[field.value]}
                value={[Number(field.value) || 0]}
                min={input?.range?.min}
                max={input?.range?.max}
                step={input?.range?.step}
                onValueChange={(value) => {
                  field.onChange(value[0])
                }}
                data-testid={input.id}
              />
            </When>
          </div>
        )
      }
      case 'text': {
        return (<React.Fragment>
          {(input.helpText && input.helpText !== '') ? <div
            className={'flex rounded-md items-center gap-2 border px-3 border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring'}
          >
            <Input type='text' placeholder={input.label} data-testid={input.id} {...field} />
            <Popover>
              <PopoverTrigger>
                <div className='cursor-pointer'>
                  <InfoIcon className='w-4 h-4' />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="Text">
                  {input.helpText}
                </div>
              </PopoverContent>
            </Popover>
          </div> : <Input type='text' placeholder={input.label} data-testid={input.id} {...field} />}
        </React.Fragment>)
      }

      case 'date': {
        return (<DatePicker placeholder={input.label} data-testid={input.id} {...field} />)
      }

      // @TODO: Create multi select input
      case 'multi-select': {
        return (
          <Select
            onValueChange={(value) => {
              if (typeof input.valueFormatter === 'function') {
                const _value = input.valueFormatter(value)
                field.onChange(_value)
              } else {
                field.onChange(value)
              }
            }}
            data-testid={input.id}
            {...field}
          >
            <SelectTrigger>
              <SelectValue placeholder={input.label} />
            </SelectTrigger>
            <SelectContent className='max-h-72'>
              {input.options.map(({ id, label }) => (
                <SelectItem value={id} key={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      case 'select': {
        return (
          <Select
            data-testid={input.id}
            onValueChange={(value) => {
              if (typeof input.valueFormatter === 'function') {
                const _value = input.valueFormatter(value)
                field.onChange(_value)
              } else {
                field.onChange(value)
              }
            }}
            {...field}
          >
            <SelectTrigger>
              <SelectValue placeholder={input.label} />
            </SelectTrigger>
            <SelectContent className='max-h-72'>
              {input.options.map(({ id, label }) => (
                <SelectItem value={id} key={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      case 'radio': {
        return (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className={input.className}
            data-testid={input.id}
          >
            {input.options.map((option) => (
              <FormItem key={option.id} className='flex items-center space-x-3 space-y-0'>
                <FormControl>
                  <RadioGroupItem value={option.id} />
                </FormControl>
                <FormLabel>{option.label}</FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        )
      }

      default: {
        return null
      }
    }
  }, [])

  return inputs.map((input) => (
    <FormField
      key={input.id}
      control={control}
      name={input.id}
      render={({ field }) => (
        <FormItem className={input.className} style={input.style}>
          <FormLabel className='flex items-center'>
            {input.label}
            <span className='pl-2'>
              {input.helpText && input.helpText !== '' && input.type === 'date' &&
                <Popover>
                  <PopoverTrigger>
                    <div className='cursor-pointer'>
                      <InfoIcon className='w-4 h-4' />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="Text">
                      {input.helpText}
                    </div>
                  </PopoverContent>
                </Popover>}
            </span>
          </FormLabel>
          <FormControl>{getFieldInput(input, field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ))
}
