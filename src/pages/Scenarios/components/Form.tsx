import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { PlusCircle } from 'lucide-react'
import { AddScenarioSchemas } from '@/schema/scenarios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type ScenarioFormType = {
  form: UseFormReturn<AddScenarioSchemas>
  onSubmit: (values: AddScenarioSchemas) => void
  isLoading: boolean
  isEdit?: boolean
}

const ScenarioForm = ({ form, onSubmit, isLoading, isEdit = false }: ScenarioFormType) => {
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='col-span-full w-max' loading={isLoading}>
            <PlusCircle className='w-4 h-4 mr-2' />
            <span>{isEdit ? 'Edit Scenario' : 'Add Scenario'}</span>
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ScenarioForm
