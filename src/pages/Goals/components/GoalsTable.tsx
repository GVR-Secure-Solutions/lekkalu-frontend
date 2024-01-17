import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { LoaderIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { GOALS } from '@/utils/query-keys'
import { fetchGoals } from '@/queries/goals'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import When from '@/components/When/When'
import Pagination from '@/components/Pagination/Pagination'
import AddOrEditGoal from './AddOrEditGoal'
import { Button } from '@/components/ui/button'
import DeleteGoal from './DeleteGoal'
import { formatIndianMoneyNotation } from '@/utils/format-money'

export default function GoalsTable() {
  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  const { data: goals, isFetching } = useQuery([GOALS.GOALS, page, rowsPerPage], () =>
    fetchGoals({ page, per_page: rowsPerPage }),
  )

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Pagination
            showSkipButtons
            disablePrevious={page === 0}
            disableNext={page === 6}
            onSkipPrevious={() => {
              setPage((prevPage) => Math.max(prevPage - 3, 0))
            }}
            onPrevious={() => {
              setPage((prevPage) => Math.max(prevPage - 1, 0))
            }}
            onNext={() => {
              setPage((prevPage) => Math.min(prevPage + 1, 6))
            }}
            onSkipNext={() => {
              setPage((prevPage) => Math.min(prevPage + 3, 6))
            }}
          />

          <div>
            {page * 10 + 1} - {page * 10 + 10}
          </div>
        </div>

        <AddOrEditGoal
          trigger={
            <Button>
              <PlusIcon className='w-4 h-4 mr-2' />
              <span>Add Goal</span>
            </Button>
          }
        />
      </div>
      <Table className='border rounded'>
        <TableCaption className='text-center'>A list of all your financial goals</TableCaption>
        <TableHeader className='bg-gray-100/50'>
          <TableRow>
            <TableHead>Goal</TableHead>
            <TableHead>Target Metric</TableHead>
            <TableHead>Current Metric</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Reachability in Months</TableHead>
            <TableHead>Reachability in Years</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Finished</TableHead>
            <TableHead>Planned Start</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <When truthy={isFetching}>
            <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
              <LoaderIcon className='animate-spin w-4 h-4' />
            </div>
          </When>

          {goals?.map((goal) => (
            <TableRow key={goal.id}>
              <TableCell>{goal.goal}</TableCell>
              <TableCell>{formatIndianMoneyNotation(parseFloat(goal.target_metric))}</TableCell>
              <TableCell>{formatIndianMoneyNotation(goal.current_metric)}</TableCell>
              <TableCell>{formatIndianMoneyNotation(goal.balance)}</TableCell>
              <TableCell>{goal.reachability_in_months}</TableCell>
              <TableCell>{goal.reachability_in_years}</TableCell>
              <TableCell>{goal.started}</TableCell>
              <TableCell>{goal.finished}</TableCell>
              <TableCell>{goal.planned_start}</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell className='flex items-center gap-1'>
                <DeleteGoal id={goal.id} />

                <AddOrEditGoal
                  goal={goal}
                  trigger={
                    <Button size='sm' variant='outline'>
                      <PencilIcon className='w-4 h-4' />
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
