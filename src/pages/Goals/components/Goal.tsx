import React, { useEffect, useMemo, useRef, useState } from 'react'
import Chart from 'react-apexcharts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { round } from 'lodash'
import colors from 'tailwindcss/colors'
import { cn } from '@/utils/utils'
import { GOALS } from '@/utils/query-keys'
import { editGoal, getGoalProgress } from '@/queries/goals'
import GoalOptions from './Options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Goal as GoalType } from '@/types/goals'
import { convertDays, goalReachedString } from '@/pages/GoalDetails/utils/dateTime'

dayjs.extend(relativeTime)

type Props = {
  className?: string
  style?: React.CSSProperties
  id: number
  goalTitle: string
  category: string
  createdAt: string
  color: string
  reachable_by_days: number
}

const circleSize = 160

export default function Goal({
  className,
  style,
  id,
  goalTitle,
  category,
  createdAt,
  color,
  reachable_by_days,
}: Props) {
  const { data: progressQuery } = useQuery([`${GOALS.PROGRESS}_${id}`], () => getGoalProgress(id), { suspense: true })
  const qc = useQueryClient()
  const [allowRename, setAllowRename] = useState(false)
  const [goalName, setGoalName] = useState(goalTitle)

  const goalMutation = useMutation((dto: Partial<GoalType>) => editGoal(id, dto), {
    onSuccess: () => {
      setAllowRename(false)
      qc.invalidateQueries([GOALS.GOALS])
    },
  })

  const handleAllowRename = () => {
    setAllowRename(true)
  }

  const goalNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (allowRename) {
      goalNameRef.current?.focus()
    }
  }, [allowRename])

  const handleRename = () => {
    goalMutation.mutate({ name: goalName })
  }

  const handleRenameCancel = () => {
    setAllowRename(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handleRename()
    } else if (e.code === 'Escape') {
      handleRenameCancel()
    }
  }

  const remainingDays = useMemo(() => goalReachedString(convertDays(reachable_by_days)), [reachable_by_days])

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: 200,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            formatter: function (val) {
              return val.toString() + '%'
            },
            color: '#111',
            fontSize: '14px',
            show: true,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            offsetY: 4,
          },
        },
      },
    },
    fill: {
      type: 'solid',
      colors: [colors.violet['500']],
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      lineCap: 'round',
    },
  }
  const chartSeries: ApexAxisChartSeries | ApexNonAxisChartSeries = [round(progressQuery?.progress_percent ?? 0, 2)]

  return (
    <div
      className={cn('flex flex-col border-t-4 rounded-lg p-4 shadow-md hover:cursor-pointer', className)}
      style={{ ...style, borderColor: color }}
    >
      <GoalOptions id={id} handleAllowRename={handleAllowRename} />
      <Link
        title='Click to view detail'
        to={!allowRename ? `/goals/${id}` : ''}
        className='flex items-center justify-center gap-4 flex-col h-full'
      >
        <Chart options={chartOptions} series={chartSeries} type='radialBar' height={circleSize} />

        {allowRename ? (
          <>
            <Input
              ref={goalNameRef}
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              onKeyDown={handleKeyPress}
              type='textarea'
            />
            <div className='flex gap-2'>
              <Button onClick={handleRename} loading={goalMutation.isLoading}>
                Rename
              </Button>
              <Button onClick={handleRenameCancel} variant={'secondary'}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className='text-xl font-bold text-center'>{goalTitle}</div>
        )}
        <div className='text-sm text-muted-foreground text-center'>{category}</div>
        <div className='text-muted-foreground text-sm text-center'>
          <p>{dayjs(createdAt).fromNow()}</p>
        </div>
        <div className='mt-auto'>
          <p className='text-xs text-center text-muted-foreground'>
            {reachable_by_days > 0
              ? `This goal will be reached in ${remainingDays}`
              : `This goal was reached ${remainingDays}`}
          </p>
        </div>
      </Link>
    </div>
  )
}
