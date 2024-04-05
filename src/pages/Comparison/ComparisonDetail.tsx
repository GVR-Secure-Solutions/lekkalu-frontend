/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import { queryClient, tokenClient } from '@/utils/client'
import { Button } from '@/components/ui/button'
import { Goal, Timeline } from '@/types/goals'
import { useImaginaryAuth } from '../Scenarios/context/use-imaginaryAuth'
import { useAuth } from '@/hooks/use-auth'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatIndianMoneyNotation } from '@/utils/format-money'

const ComparisonDetail = () => {
  const comparisonId = useParams().id
  const IS_FOR_FEATURE_PAGE = useLocation().pathname.includes('feature')
  const { getAPIClientForImaginaryUser } = useImaginaryAuth()
  const { userData } = useAuth()
  const { preferences } = useUserPreferences()
  const IS_AUTHENTICATED_USER = useMemo(() => Boolean(userData), [userData])
  const [selectedScenarios, setSelectedScenarios] = useState<Array<number>>([])
  const [timelineData, setTimelineData] = useState<any>()

  const handleScenarioSelect = (id: number) => {
    const _selectedScenarios = [...selectedScenarios]
    if (_selectedScenarios.includes(id)) {
      _selectedScenarios.splice(_selectedScenarios.indexOf(id), 1)
    } else {
      _selectedScenarios.push(id)
    }
    setSelectedScenarios(_selectedScenarios)
  }

  const {
    data: comparison,
    isError,
    isLoading: isFetchingComparison,
  } = useQuery([`${COMPARISON.COMPARISON}-${comparisonId}`], () =>
    fetchComparisonsById(Number(comparisonId), IS_FOR_FEATURE_PAGE),
  )

  const { data: scenarios } = useQuery([SCENARIOS.SCENARIOS], fetchScenarios, {
    enabled: Boolean(comparison?.id) && IS_AUTHENTICATED_USER,
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

  const timelineDataAPICall = async (dto: { username: string; password: string; scenarioName: string }) => {
    const loginResponse = await tokenClient.post<{ access: string; refresh: string }>('/', dto)
    const apiClient = getAPIClientForImaginaryUser(loginResponse.data.access, 'v2')
    const goalData = await apiClient.get<Goal[]>('financial_goal/')
    const timelineData = await apiClient.get<Timeline[]>(`financial_goal/timeline/${goalData?.data[0]?.id}`)
    return { [dto.scenarioName]: timelineData.data }
  }

  const { mutate: login, isLoading } = useMutation(
    async ({ password, username, scenarioName }: any) => {
      const results = await timelineDataAPICall({ password, username, scenarioName })
      return results
    },
    {
      onSuccess: (data) => {
        setTimelineData((prevData: any) => {
          return { ...prevData, ...data }
        })
      },
    },
  )

  const handleSimulate = () => {
    setTimelineData({})
    if (IS_AUTHENTICATED_USER) {
      scenariosForThisComparison?.forEach((each) => {
        login({ password: each?.imag_password, username: each?.imag_username, scenarioName: each?.name })
      })
    } else {
      comparison?.scenarios_objects?.forEach((each) => {
        login({ password: each?.imag_password, username: each?.imag_username, scenarioName: each?.name })
      })
    }
  }

  const handleAddScenariosToComparison = () => {
    const _scenarios = comparison?.scenarios as Array<number>
    if (_scenarios?.length) {
      const _selectedScenarios = [..._scenarios, ...selectedScenarios]
      scenarioMutationInComparison({ scenarios: _selectedScenarios })
    }
  }

  const isSecenarioAlreadySelected = (id: number) => {
    return selectedScenarios.includes(id)
  }

  const handleRemoveScenarioFromComparison = (id: number) => {
    const remainingScenarios = comparison?.scenarios.filter((each) => each !== id)
    scenarioMutationInComparison({ scenarios: remainingScenarios })
  }

  if (isFetchingComparison) {
    return (
      <Page>
        <div>Loading...</div>
      </Page>
    )
  }

  if (isError) {
    return (
      <Page>
        <h3>This comparison is set to private</h3>
      </Page>
    )
  }

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        autoScaleYaxis: true,
      },
      foreColor: '#000',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'MMM yyyy',
          hour: 'HH:mm',
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${preferences.currencyUnit} ${formatIndianMoneyNotation(value, 1)}`,
      },
    },
  }

  const chartSeries: ApexAxisChartSeries =
    timelineData &&
    Object.keys(timelineData).map((scenarioName) => ({
      name: scenarioName,
      data: timelineData[scenarioName].map((dataItem: any) => ({
        x: new Date(dataItem.time).getTime(),
        y: dataItem.kpi_value,
      })),
    }))

  return (
    <Page className='space-y-8'>
      <div className='flex justify-between'>
        {IS_AUTHENTICATED_USER ? (
          <PageTitle
            backUrl={IS_AUTHENTICATED_USER ? '/comparisons' : '/feature/comparisons'}
            backUrlTitle='Back to comparisons'
            title={comparison?.name || ''}
            key={comparisonId}
          />
        ) : (
          <div />
        )}
        <div>
          <Button
            variant={'default'}
            onClick={handleSimulate}
            loading={isLoading}
            disabled={!comparison?.scenarios_objects.length}
          >
            Simulate
          </Button>
        </div>
      </div>
      <h2 className='font-bold'>
        {comparison?.scenarios_objects?.length ? (
          'List of Scenarios in this comparison.'
        ) : (
          <div>
            <p>No Scenario in this comparison</p>
          </div>
        )}
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
        {!IS_AUTHENTICATED_USER && !scenariosForThisComparison ? (
          comparison?.scenarios_objects?.map(({ id, name, imag_username }) => (
            <Link key={id} to={'/feature/scenarios/' + id}>
              <Scenario
                id={id}
                name={name}
                username={imag_username}
                comparisonId={Number(comparisonId)}
                handleRemoveScenario={() => {}}
              />
            </Link>
          ))
        ) : (
          <></>
        )}
        {IS_AUTHENTICATED_USER ? (
          <AddNewScenarioButton
            handleAddScenariosToComparison={handleAddScenariosToComparison}
            scenarios={remaningScenarios || []}
            isSelected={isSecenarioAlreadySelected}
            comparisonName={comparison?.name || ''}
            handleScenarioSelect={handleScenarioSelect}
          />
        ) : (
          <></>
        )}
      </div>

      {timelineData ? (
        <div>
          <Card className={cn('h-[600px] sm:h-[400px] pb-20 sm:pb-0 shadow-sm')}>
            <CardHeader className='flex flex-start flex-col sm:flex-row'>
              <CardTitle>Graph</CardTitle>
            </CardHeader>
            {
              <CardContent className='w-full h-full'>
                {isLoading ? <p>Loading...</p> : <ChartWrapper chartOptions={chartOptions} chartSeries={chartSeries} />}
              </CardContent>
            }
          </Card>
        </div>
      ) : (
        <></>
      )}
    </Page>
  )
}

// ChartWrapper component with error handling
const ChartWrapper: React.FC<{ chartOptions: ApexCharts.ApexOptions; chartSeries: ApexAxisChartSeries }> = ({
  chartOptions,
  chartSeries,
}) => {
  try {
    return <Chart options={chartOptions} series={chartSeries} type='line' height={320} />
  } catch (error) {
    return <div>Sorry, there was an error rendering the chart.</div>
  }
}

export default ComparisonDetail
