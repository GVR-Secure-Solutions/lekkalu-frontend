import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Page from '@/components/Page/Page'
import PageTitle from '@/components/DetailPageHeading'
import ScenarioForm from './components/Form'
import { AddScenarioSchemas, addScenarioSchemas } from '@/schema/scenarios'
import { SCENARIOS } from '@/utils/query-keys'
import { editScenario, fetchScenarioById } from '@/queries/scenarios'
import { toast } from '@/components/ui/use-toast'
import { Scenario } from '@/types/scenarios'

const EditScenario = () => {
  const { id } = useParams() as { id: string }
  const scenarioId = Number(id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const queryName = `${SCENARIOS.SCENARIOS}-${scenarioId}`

  const { data: scenario, isLoading: isFetchingScenario } = useQuery([queryName], () => fetchScenarioById(scenarioId), {
    onError() {
      toast({ title: 'Something went wrong' })
    },
  })

  const { mutate } = useMutation((dto: Partial<Scenario>) => editScenario(scenarioId, dto), {
    onSuccess() {
      queryClient.invalidateQueries([queryName])
      toast({ title: 'Scenario Edited Successfully!' })
      navigate('/scenarios')
    },
  })

  const form = useForm<AddScenarioSchemas>({
    resolver: zodResolver(addScenarioSchemas),
  })

  useEffect(() => {
    if (!isFetchingScenario && scenario) {
      form.setValue('name', scenario.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, isFetchingScenario])

  const handleFormSubmit = (values: AddScenarioSchemas) => {
    mutate(values)
  }
  return (
    <Page className='space-y-8'>
      <PageTitle title='Edit this scenario' backUrl='/scenarios' backUrlTitle='Back to Scenarios' />
      <ScenarioForm form={form} isEdit isLoading={false} onSubmit={handleFormSubmit} />
    </Page>
  )
}

export default EditScenario
