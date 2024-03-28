/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Page from '@/components/Page/Page'
import PageTitle from './components/PageTitle'
import Scenario from './components/Scenario/EachScenarioInComparison'
import AddNewScenarioButton from './components/Scenario/AddNewScenarioButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/utils'
import { COMPARISON, SCENARIOS } from '@/utils/query-keys'
import { editComparisons, fetchComparisonsById } from '@/queries/comparisons'
import { fetchScenarios } from '@/queries/scenarios'
import { type Scenario as ScenarioType } from '@/types/scenarios'
import { Comparison } from '@/types/comparison'
import { queryClient } from '@/utils/client'

const ComparisonDetail = () => {
  const comparisonId = useParams().id

  const [selectedScenarios, setSelectedScenarios] = useState<Array<number>>([])

  const handleScenarioSelect = (id: number) => {
    const _selectedScenarios = [...selectedScenarios]
    if (_selectedScenarios.includes(id)) {
      _selectedScenarios.splice(_selectedScenarios.indexOf(id), 1)
    } else {
      _selectedScenarios.push(id)
    }
    setSelectedScenarios(_selectedScenarios)
  }

  const { data: comparison, refetch: refetchComparison } = useQuery([`${COMPARISON.COMPARISON}-${comparisonId}`], () =>
    fetchComparisonsById(Number(comparisonId)),
  )

  const { data: scenarios } = useQuery([SCENARIOS.SCENARIOS], fetchScenarios, {
    enabled: Boolean(comparison?.id),
  })

  const { mutate: scenarioMutationInComparison } = useMutation(
    (dto: Partial<Comparison>) => editComparisons(Number(comparisonId), dto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${COMPARISON.COMPARISON}-${comparisonId}`])
        setSelectedScenarios([])
      },
    },
  )

  const scenariosForThisComparison = scenarios?.filter((each: ScenarioType) => comparison?.scenarios.includes(each?.id))
  const remaningScenarios = scenarios?.filter((each) => !comparison?.scenarios.includes(each?.id))

  const handleAddScenariosToComparison = () => {
    const _scenarios = comparison?.scenarios as Array<number>
    const _selectedScenarios = [..._scenarios, ...selectedScenarios]
    scenarioMutationInComparison({ scenarios: _selectedScenarios })
  }

  const isSecenarioAlreadySelected = (id: number) => {
    return selectedScenarios.includes(id)
  }

  const handleRemoveScenarioFromComparison = (id: number) => {
    const remainingScenarios = comparison?.scenarios.filter((each) => each !== id)
    scenarioMutationInComparison({ scenarios: remainingScenarios })
  }

  return (
    <Page className='space-y-8'>
      <PageTitle
        backUrl='/comparisons'
        backUrlTitle='Back to comparisons'
        title={comparison?.name || ''}
        key={comparisonId}
      />
      <h2 className='font-bold'>
        {scenariosForThisComparison?.length
          ? 'List of Scenarios in this comparison.'
          : 'No Scenario in this comparison'}
      </h2>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-10'>
        {scenariosForThisComparison?.map(({ id, name, imag_username }) => (
          <Scenario
            key={id}
            id={id}
            name={name}
            username={imag_username}
            comparisonId={Number(comparisonId)}
            handleRemoveScenario={handleRemoveScenarioFromComparison}
          />
        ))}
        <AddNewScenarioButton
          handleAddScenariosToComparison={handleAddScenariosToComparison}
          scenarios={remaningScenarios || []}
          isSelected={isSecenarioAlreadySelected}
          comparisonName={comparison?.name || ''}
          handleScenarioSelect={handleScenarioSelect}
        />
      </div>

      <div>
        <Card className={cn('h-[600px] sm:h-96 pb-20 sm:pb-0 shadow-sm')}>
          <CardHeader className='flex flex-start flex-col sm:flex-row'>
            <CardTitle>Graph</CardTitle>
          </CardHeader>
          <CardContent className='w-full h-full'>
            <ResponsiveContainer width='100%' height='75%'>
              <LineChart
                data={[
                  { time: '2022-01-11', scenario1: 16, scenario2: 22, value: 44 },
                  { time: '2022-02-11', scenario1: 29, scenario2: 22, value: 44 },
                  { time: '2022-03-11', scenario1: 8, scenario2: 22, value: 44 },
                  { time: '2022-04-11', scenario1: 39, scenario2: 22, value: 44 },
                ]}
                width={730}
                height={250}
                margin={{ top: 5, right: 0, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 1' />
                <XAxis dataKey='time' tickFormatter={(date) => dayjs(date).format('MMM YYYY')} />
                <YAxis dataKey={'value'} />
                <Tooltip labelFormatter={(date) => dayjs(date).format('DD MMM YYYY')} />
                <Line type='monotone' dataKey={'scenario1'} name='Scenario 1' strokeWidth={1} dot={false} />
                <Line
                  type='monotone'
                  dataKey={'scenario2'}
                  name='Scenario 2'
                  stroke='red'
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}

export default ComparisonDetail
