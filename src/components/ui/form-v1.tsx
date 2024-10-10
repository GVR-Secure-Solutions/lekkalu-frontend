import React from 'react'
import { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form'

type DetailFieldProps = {
  label: string
  children: React.ReactNode
  error?: FieldError
  field_name?: string
}

// Define the props for the generic field component
interface GenericFieldProps<T extends FieldValues> {
  name: Path<T>
  type?: string
  register: UseFormRegister<T>
  className?: string // Accept custom className as a prop
  placeholder?: string
  valueAsNumber?: boolean
}

// Generic component for rendering a field
const GenericFormField = <T extends FieldValues>({
  name,
  type = 'text', // default input type
  register,
  className = '', // default to an empty string for className
  placeholder = '', // default to an empty string for placeholder
  valueAsNumber = false, // default to false for valueAsNumber
}: GenericFieldProps<T>) => {
  return (
    <input
      placeholder={placeholder}
      {...register(name, { valueAsNumber: valueAsNumber })}
      type={type}
      className={className} // Apply custom styles
    />
  )
}

export const DetailField: React.FC<DetailFieldProps> = ({ label, children, error }) => (
  // Field component that takes the field body as child, text as label to render a field
  <div className='flex flex-col h-full w-full'>
    <div className='flex justify-between w-full gap-10'>
      <div className='self-stretch text-black/50 text-base leading-snug whitespace-nowrap flex items-center justify-center'>
        <p className='font-normal font-["Charter"]'>{label}</p>
      </div>
      <div className='justify-start items-center gap-[5px] inline-flex'>{children}</div>
    </div>
    {error && <p className='text-destructive text-md text-right'>{error.message}</p>}
  </div>
)

interface FieldProps {
  error?: FieldError
  children: React.ReactNode
}

export const Field: React.FC<FieldProps> = ({ error, children }) => (
  <div>
    {children}
    {error && <p className='text-destructive text-md text-right'>{error.message}</p>}
  </div>
)

export const FieldContainer = ({ children }: { children: React.ReactNode }) => (
  // Field Container component that takes children fields and renders them in a row
  <div className='w-full p-[5px] bg-[#154181]/20 rounded-[5px] justify-start items-start flex-col inline-flex'>
    {children}
  </div>
)
export default GenericFormField
