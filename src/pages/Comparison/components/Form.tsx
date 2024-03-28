import React, { useEffect, useState } from 'react'
import { PlusCircle, XCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { UseFormReturn } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import AddNewScenarioButton from './Scenario/AddNewScenarioButton'
import { SCENARIOS } from '@/utils/query-keys'
import { fetchScenarios } from '@/queries/scenarios'
import { Scenario } from '@/types/scenarios'
import { AddComaprisonSchema } from '@/schema/comparisons'
import { Button } from '@/components/ui/button'

type ComparisonFormType = {
  form: UseFormReturn<AddComaprisonSchema>
  onSubmit: (values: AddComaprisonSchema) => void
  isLoading: boolean
  isEdit?: boolean
}

const ComparisonForm = ({ form, onSubmit, isLoading, isEdit }: ComparisonFormType) => {
  const [selectedScenarios, setSelectedScenarios] = useState<Array<Scenario>>([])
  const [addedSenarios, setAddedScenarios] = useState<Array<Scenario>>([])
  const [remaningScenarios, setRemainingScenarios] = useState<Array<Scenario>>([])

  const { data: scenarios } = useQuery([SCENARIOS.SCENARIOS], fetchScenarios)

  useEffect(() => {
    if (isEdit && form.getValues('scenarios')?.length) {
      const _existingScenariosInComparison = scenarios?.filter((each) => form.getValues('scenarios').includes(each?.id))
      setAddedScenarios(_existingScenariosInComparison || [])
    }
  }, [isEdit, scenarios, form.getValues().scenarios])

  useEffect(() => {
    const _remainingScenarios: Array<Scenario> = []
    scenarios?.forEach((scenario) => {
      if (!addedSenarios.some((addedScenario) => addedScenario.id === scenario.id)) {
        _remainingScenarios.push(scenario)
      }
    })
    setRemainingScenarios(_remainingScenarios)
  }, [addedSenarios])

  const inputs = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      id: 'access',
      label: 'Access',
      type: 'radio',
      options: [
        { id: 'Public', label: 'Public' },
        { id: 'Private', label: 'Private' },
      ],
    },
  ] as InputField[]

  const handleScenarioSelect = (id: number) => {
    const _selectedScenarios = [...selectedScenarios].map((each) => each?.id)
    if (_selectedScenarios.includes(id)) {
      _selectedScenarios.splice(_selectedScenarios.indexOf(id), 1)
    } else {
      _selectedScenarios.push(id)
    }
    const scenariosObject = scenarios?.filter((each) => _selectedScenarios.includes(each.id))
    setSelectedScenarios(scenariosObject || [])
  }

  const handleAddScenariosToComparison = () => {
    const scenarios_id = [...addedSenarios, ...selectedScenarios].map((each) => each?.id)
    setAddedScenarios([...addedSenarios, ...selectedScenarios])
    setSelectedScenarios([])
    form.setValue('scenarios', scenarios_id)
  }

  const isSecenarioAlreadySelected = (id: number) => {
    return selectedScenarios.map((each) => each?.id).includes(id)
  }

  const handleRemoveAddedScenario = (id: number) => {
    const _filteredScenarios = addedSenarios.filter((each) => each.id !== id)
    const _filteredScenariosIds = _filteredScenarios?.map((each) => each?.id)
    form.setValue('scenarios', _filteredScenariosIds)
    setAddedScenarios(_filteredScenarios)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-y-5'>
          <InputFieldsRenderer control={form.control} inputs={inputs} />
          <div>
            <p>Add some scenarios to this comparison.</p>
          </div>
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-10'>
            {addedSenarios?.map(({ name, id }) => {
              return (
                <div key={id} className='flex flex-col border rounded h-auto shadow-sm hover:shadow-md min-h-[150px]'>
                  <div className='flex justify-end mr-2 mt-2'>
                    <XCircle className='hover:cursor-pointer' onClick={() => handleRemoveAddedScenario(id)} />
                  </div>
                  <div className='mt-auto mb-5'>
                    <p className='text-center px-2'>{name}</p>
                  </div>
                </div>
              )
            })}
            <AddNewScenarioButton
              comparisonName='this comparison'
              scenarios={remaningScenarios}
              handleAddScenariosToComparison={handleAddScenariosToComparison}
              handleScenarioSelect={handleScenarioSelect}
              isSelected={isSecenarioAlreadySelected}
            />
          </div>
        </div>
        <div className='mt-8'>
          <Button type='submit' className='col-span-full w-max' loading={isLoading}>
            <PlusCircle className='w-4 h-4 mr-2' />
            <span>{isEdit ? 'Edit Comparison' : 'Add Comparison'}</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ComparisonForm
