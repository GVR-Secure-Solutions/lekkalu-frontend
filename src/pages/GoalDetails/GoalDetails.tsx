import React, { useEffect, useMemo, useState } from 'react'
import { BadgeCheckIcon, GaugeIcon, SplitIcon, TargetIcon } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Page from '@/components/Page/Page'
import { BALANCE_SHEET, GOALS, USER_CUSTOM_KPIS } from '@/utils/query-keys'
import { editGoal, fetchGoalDetails, fetchKPITypes, fetchUserCustomKPIs } from '@/queries/goals'
import GoalTimeline from './components/GoalTimeline'
import BackButton from './components/BackButton'
import { fetchIncomeExpenses } from '@/queries/income-statement'
import { convertDays, goalReachedString } from './utils/dateTime'
import { formatIndianMoneyNotation } from '@/utils/format-money'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Goal as GoalType } from '@/types/goals'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function GoalDetails() {
  const { id } = useParams() as { id: string }
  const qc = useQueryClient()

  const [target, setTarget] = useState<number | string>()
  const [kpi, setKpi] = useState<string>()
  const [source, setSource] = useState<string>()
  const [name, setName] = useState<string>()

  const [allowRename, setAllowRename] = useState(false)
  const [allowEditTarget, setAllowEditTarget] = useState(false)

  const { data: incomeExpenses } = useQuery({ queryKey: [BALANCE_SHEET.INCOME_EXPENSES], queryFn: fetchIncomeExpenses })
  const { data: custom_kpis } = useQuery({ queryKey: [USER_CUSTOM_KPIS.KPIS], queryFn: fetchUserCustomKPIs })

  const { data: getTargetKpi } = useQuery({ queryKey: [GOALS.KPI_TYPES], queryFn: fetchKPITypes })

  const {
    data,
    isLoading,
    isSuccess: goalDetailFetchedSuccess,
  } = useQuery({
    queryKey: [`${GOALS.DETAILS}-${id}`],
    queryFn: () => fetchGoalDetails(Number(id)),
    select: (data) => {
      return {
        ...data,
        target_contribution_source:
          incomeExpenses?.find((each) => each?.id === data?.target_contribution_source)?.name || 'N/A',
        custom_kpi: custom_kpis?.find((each) => each?.id === data?.custom_kpi)?.name,
      }
    },
  })

  useEffect(() => {
    if (goalDetailFetchedSuccess) {
      setTarget(data?.target_value)
      setKpi(data?.track_kpi)
      setSource(data?.target_contribution_source)
      setName(data?.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalDetailFetchedSuccess])

  const goalMutation = useMutation({
    mutationFn: (dto: Partial<GoalType>) => editGoal(Number(id), dto),
    onSuccess: () => {
      toast({ title: 'Goal edited successfully!', variant: 'default' })
      qc.invalidateQueries({ queryKey: [`${GOALS.DETAILS}-${id}`] })
    },
    onError: () => {
      setTarget(data?.target_value)
      setKpi(data?.track_kpi)
      setSource(data?.target_contribution_source)
      toast({ title: 'Something went wrong.', variant: 'destructive' })
    },
  })

  const reachableDaysString = useMemo(
    () => goalReachedString(convertDays(data?.reachable_by_days || 0)),
    [data?.reachable_by_days],
  )

  const getTargetId = (targetName: string) => {
    const id = incomeExpenses?.find(({ name }) => targetName === name)?.id
    if (id === 0) {
      return undefined
    }
    return id
  }

  const editName = () => {
    goalMutation.mutate({ name })
    setAllowRename(false)
  }

  const editTarget = () => {
    goalMutation.mutate({ target_value: Number(target) })
    setAllowEditTarget(false)
  }

  if (isLoading) {
    return (
      <Page>
        <BackButton />
        <div>
          <p>Loading goal details...</p>
        </div>
      </Page>
    )
  }

  if (!data) {
    return (
      <Page>
        <BackButton />
        <p>{`No goal found with id ${id}`}</p>
      </Page>
    )
  }

  return (
    <Page className='space-y-4'>
      <div>
        {allowRename ? (
          <div className='flex lg:w-96 gap-4'>
            <Input
              type='text'
              id='goalname'
              autoFocus
              value={name}
              onChange={(e) => setName(e?.target?.value)}
              onKeyDown={(e) => {
                if (e.code === 'Enter') {
                  editName()
                }
                if (e.code === 'Escape') {
                  setName(data.name)
                  setAllowRename(false)
                }
              }}
            />
            <Button type='button' variant={'ghost'} onClick={editName}>
              Edit
            </Button>
          </div>
        ) : (
          <h1
            className='text-2xl font-bold mb-8 w-fit'
            onClick={() => {
              setAllowRename(true)
            }}
            title='Click to edit'
          >
            {name}
          </h1>
        )}
      </div>
      <BackButton />
      <div className='grid md:grid-cols-2 gap-4 lg:gap-x-20'>
        <div className='flex'>
          <div className='flex gap-2 flex-1 items-center'>
            <TargetIcon className='w-4 h-4' />
            <div>Target</div>
          </div>
          <div className='flex-1 font-medium self-center'>
            {allowEditTarget ? (
              <div className='flex gap-4 w-fit'>
                <Input
                  type='number'
                  autoFocus
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.code === 'Enter') {
                      editTarget()
                    } else if (e.code === 'Escape') {
                      setTarget(data.target_value)
                      setAllowEditTarget(false)
                    }
                  }}
                />
                <Button type='button' variant={'ghost'} onClick={editTarget}>
                  Edit
                </Button>
              </div>
            ) : (
              <p title='Click to edit' onClick={() => setAllowEditTarget(true)}>
                {formatIndianMoneyNotation(data.target_value)}
              </p>
            )}
          </div>
        </div>

        <div className='flex'>
          <div className='flex gap-2 flex-1 items-center'>
            <GaugeIcon className='w-4 h-4' />
            <div>KPI</div>
          </div>
          <div className='flex-1 font-medium'>
            <Select
              value={kpi}
              onValueChange={(data) => {
                setKpi(data)
                goalMutation.mutate({ track_kpi: data })
              }}
            >
              <SelectTrigger>
                <SelectValue>{kpi}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {getTargetKpi?.map((item) => (
                  <SelectItem key={item.id} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex'>
          <div className='flex gap-2 flex-1 items-center'>
            <SplitIcon className='w-4 h-4' />
            <div>Source</div>
          </div>
          <div className='flex-1 font-medium'>
            <Select
              value={source}
              onValueChange={(value) => {
                const target_contribution_source = value === 'N/A' ? null : Number(getTargetId(value))
                setSource(value)
                goalMutation.mutate({ target_contribution_source })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='N/A'>{source}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={'no-source'} value='N/A'>
                  N/A
                </SelectItem>
                {incomeExpenses?.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex'>
          <div className='flex gap-2 flex-1 items-center'>
            <BadgeCheckIcon className='w-4 h-4' />
            <div>
              <p>{data?.reachable_by_days < 0 ? 'Reached' : 'Reachable by'}</p>
            </div>
          </div>
          <div className='flex-1 font-medium self-center'>{reachableDaysString}</div>
        </div>
      </div>

      <GoalTimeline goalId={Number(id)} target={data.target_value} />
    </Page>
  )
}
