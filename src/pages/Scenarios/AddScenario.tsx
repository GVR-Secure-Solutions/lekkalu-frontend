import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Page from '@/components/Page/Page'
import PageTitle from '@/components/DetailPageHeading'
import { AddScenarioSchemas, addScenarioSchemas } from '@/schema/scenarios'
import ScenarioForm from './components/Form'
import { createScenarios } from '@/queries/scenarios'
import { toast } from '@/components/ui/use-toast'

const AddScenario = () => {
  const navigate = useNavigate()
  const form = useForm<AddScenarioSchemas>({
    resolver: zodResolver(addScenarioSchemas),
  })

  const { mutate: addScenario, isLoading } = useMutation(createScenarios, {
    onSuccess: (data) => {
      toast({ title: 'Scenario created successfully!' })
      navigate(`/scenarios/${data.id}`)
    },
    onError: (response: any) => {
      const message = response?.response?.data?.message
      message && toast({ title: message })
    },
  })

  const handleFormSubmit = (values: AddScenarioSchemas) => {
    addScenario(values)
  }

  return (
    <Page className='space-y-8'>
      <PageTitle title='Create a scenario' backUrl='/scenarios' backUrlTitle='Back to Scenarios' />
      <ScenarioForm form={form} isLoading={isLoading} onSubmit={handleFormSubmit} />
    </Page>
  )
}

export default AddScenario
