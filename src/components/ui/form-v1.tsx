import React from 'react'
import { FieldValues, UseFormRegister, Path } from 'react-hook-form'

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

export default GenericFormField
