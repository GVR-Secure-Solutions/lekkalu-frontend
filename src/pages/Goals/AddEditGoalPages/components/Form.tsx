/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { UseFormReturn } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Step, StepItem, Stepper } from '@/components/ui/stepper'
import DatePicker from '@/components/DatePicker/DatePicker'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import useGetSelectOptionsForGoal from '../hooks/useGetSelectOptionsForGoal'
import { AddGoalSchema } from '@/schema/goals'
import { StepFooter } from './StepperFooter'
import { FormLabelForGoalForm } from '../../components/FormLabel'
import { Button } from '@/components/ui/button'
import { CustomKPI } from '@/types/goals'

type GoalFormType = {
  form: UseFormReturn<AddGoalSchema>
  onSubmit: (values: AddGoalSchema) => void
  isLoading: boolean
  isEdit?: boolean
  isError: boolean
}

const steps = [{ id: '1' }, { id: '2' }, { id: '3' }] satisfies StepItem[]

export default function GoalForm({ form, onSubmit, isLoading, isError, isEdit = false }: GoalFormType) {
  const {
    incomeExpenses,
    goalProportionality,
    getTargetKpi,
    isFetchingOptions,
    totalExpenses,
    custom_kpis,
    user_custom_kpis,
  } = useGetSelectOptionsForGoal()

  const kpi_value = form.watch('track_kpi')

  const [multiplyTargetBy, setMultiplyTargetBy] = useState(6)

  useEffect(() => {
    if (!isEdit && kpi_value === 'Cash' && totalExpenses) {
      form.setValue('target_value', totalExpenses * multiplyTargetBy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalExpenses, kpi_value])

  useEffect(() => {
    if (kpi_value === 'Cash') {
      form.setValue('target_value', Number(totalExpenses) * multiplyTargetBy)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiplyTargetBy])

  const mergedKpis: CustomKPI[] = [
    ...(custom_kpis ?? []).map((item) => ({ ...item })),
    ...(user_custom_kpis ?? []).map((item) => ({ ...item })),
  ]

  if (isFetchingOptions) {
    return (
      <div>
        <p>Loading, please wait...</p>
      </div>
    )
  }

  return (
    <div>
      <Form {...form}>
        <form>
          <Stepper initialStep={0} steps={steps}>
            {steps.map((props) => {
              switch (props.id) {
                case '1':
                  return (
                    <Step>
                      <div>
                        <p className='mt-5'>Step 1: Basic Information about goal.</p>
                      </div>
                      <div className='grid sm:grid-cols-1 gap-4 px-2 my-5'>
                        <FormField
                          control={form.control}
                          name='name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabelForGoalForm
                                required
                                label='Name'
                                info="Think of a name that really captures what you're aiming for. This should sum up your goal in a nutshell."
                                example='Slash That Debt!'
                              />
                              <FormControl>
                                <Input value={field.value} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='target_date'
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabelForGoalForm
                                  required
                                  label='Target Date'
                                  info='Pick a date when you want to have this goal wrapped up. It’s like setting a personal deadline—helps keep you focused.'
                                  example='By the end of the year, December 31, 2024'
                                />
                                <FormControl>
                                  <DatePicker
                                    onChange={(value) => field.onChange(value?.toString())}
                                    value={dayjs(field.value).toDate()}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )
                          }}
                        />
                        <FormField
                          control={form.control}
                          name='goal_proportionality'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabelForGoalForm
                                required
                                label='Goal Proportionality'
                                info="Decide if you’re trying to increase or decrease something. It's like choosing which way you want the scales to tip."
                                example='Lower the Better — let’s cut down that liability percentage!'
                              />
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={Boolean(!goalProportionality?.length)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='Goal Propotionality' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {goalProportionality?.map((item) => (
                                      <SelectItem key={item.id} value={item.value}>
                                        {item.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <div>
                                {!goalProportionality?.length ? (
                                  <p className='text-red-500 text-xs'>No goal propotionality found.</p>
                                ) : (
                                  <></>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Step>
                  )
                case '2':
                  return (
                    <Step>
                      <div>
                        <p className='mt-5'>Step 2: Select KPI.</p>
                        <small className='text-gray-500'>
                          Please select <span className='font-semibold'>either</span> Existing KPI or Custom KPI.
                        </small>
                      </div>
                      <div className='grid sm:grid-cols-1 gap-4 px-2 my-5'>
                        <FormField
                          control={form.control}
                          name='track_kpi'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabelForGoalForm
                                required
                                label='KPI'
                                info='Choose a way to measure your progress. Think of it as your scoreboard showing how close you are to your goal.'
                                example='Liability Percentage'
                                tooltipSide='top'
                              />
                              <div className='flex gap-4'>
                                <FormControl>
                                  <Select
                                    value={String(form.watch().track_kpi) || undefined}
                                    onValueChange={(value) => {
                                      form.setValue('track_kpi', value || null)
                                    }}
                                    disabled={!!form.watch().custom_kpi}
                                  >
                                    <SelectTrigger placeholder='KPI'>
                                      <SelectValue placeholder='KPI' />
                                    </SelectTrigger>
                                    <SelectContent placeholder='KPI'>
                                      {getTargetKpi?.map((item) => (
                                        <SelectItem key={item.id} value={item.value}>
                                          {item.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <Button
                                  type='button'
                                  disabled={!form.watch().track_kpi}
                                  onClick={() => {
                                    form.setValue('track_kpi', null)
                                  }}
                                >
                                  Clear
                                </Button>
                              </div>
                              <div>
                                {!getTargetKpi?.length ? (
                                  <p className='text-red-500 text-xs'>No Target KPI found.</p>
                                ) : (
                                  <></>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='custom_kpi'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabelForGoalForm
                                label='Custom KPI'
                                info='Select a KPI that you created which helps you measure your progress in accordance with your criteria.'
                                example={mergedKpis.length ? String(mergedKpis[0].description) : 'Cash'}
                                tooltipSide='top'
                              />
                              <div className='flex gap-4'>
                                <FormControl>
                                  <Select
                                    disabled={!!form.watch().track_kpi}
                                    value={String(form.watch().custom_kpi) || undefined}
                                    onValueChange={(value) => {
                                      form.setValue('custom_kpi', value ? Number(value) : null)
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select a KPI' />
                                    </SelectTrigger>
                                    <SelectContent placeholder='Select a KPI'>
                                      {mergedKpis.map((item: { id: number; name: string }) => (
                                        <SelectItem key={item.id} value={item.id.toString()}>
                                          {item.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <Button
                                  type='button'
                                  disabled={!form.watch().custom_kpi}
                                  onClick={() => {
                                    form.setValue('custom_kpi', null)
                                  }}
                                >
                                  Clear
                                </Button>
                              </div>
                              <div>
                                {!mergedKpis.length ? (
                                  <Link to='/income-statement' className='text-gray-500 text-xs hover:underline'>
                                    No KPIs found. Click here to add.
                                  </Link>
                                ) : (
                                  <></>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Step>
                  )
                case '3':
                  return (
                    <Step>
                      <div>
                        <p className='mt-5'>Step 3: Set target for this goal.</p>
                      </div>
                      <div className='grid sm:grid-cols-1 gap-4 p-5'>
                        <FormField
                          control={form.control}
                          name='target_value'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabelForGoalForm
                                required
                                label='Target'
                                info='Set a clear mark to hit. It’s like putting a flag on the top of the hill you want to climb.'
                                example='Aim to cut your liability percentage by 15%'
                              />
                              <FormControl>
                                <Input
                                  type='number'
                                  min={1}
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormItem>
                          <FormLabelForGoalForm
                            required={false}
                            label='Source'
                            info='Pinpoint which part of your spending is going to help knock down that liability. Think of it as identifying the tools in your toolkit that are really doing the work.'
                            example='Interest Expense Reductions'
                            tooltipSide='top'
                          />
                          <FormControl>
                            <div className='flex gap-5'>
                              <Select
                                value={String(form.watch().target_contribution_source) || undefined}
                                onValueChange={(value) => {
                                  form.setValue('target_contribution_source', value ? Number(value) : null)
                                }}
                                disabled={Boolean(!incomeExpenses?.length)}
                              >
                                <SelectTrigger placeholder='Source'>
                                  <SelectValue placeholder='Source' />
                                </SelectTrigger>
                                <SelectContent>
                                  {incomeExpenses?.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                type='button'
                                disabled={!form.watch().target_contribution_source}
                                onClick={() => {
                                  form.setValue('target_contribution_source', null)
                                }}
                              >
                                Clear
                              </Button>
                            </div>
                          </FormControl>
                          <div>
                            {!incomeExpenses?.length ? (
                              <Link to='/income-statement' className='text-gray-500 text-xs hover:underline'>
                                No Income Expense found. Click here to add.
                              </Link>
                            ) : (
                              <></>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>

                        {kpi_value === 'Cash' ? (
                          <>
                            <div>
                              <div className='flex justify-start'>
                                <FormLabelForGoalForm
                                  label='x months of expenses'
                                  info='Set your cash goal target to meet 3-6 months of living expenses'
                                />
                              </div>
                              <div className='flex gap-x-5 mt-3'>
                                <Input
                                  type='number'
                                  className='w-20 self-center'
                                  value={multiplyTargetBy}
                                  onChange={(event) => {
                                    const value = Number(event?.target?.value)
                                    setMultiplyTargetBy(value)
                                  }}
                                  min={1}
                                />
                              </div>
                              <div className='flex mt-2 justify-between lg:justify-start'>
                                <p className='text-xs text-gray-500 self-center'>
                                  Set a cash target to meet x months of expenses
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Step>
                  )
                default:
                  return <></>
              }
            })}
            <StepFooter
              isEdit={isEdit}
              values={form.watch()}
              handleCreate={form.handleSubmit(onSubmit)}
              isLoading={isLoading}
              isError={isError}
            />
          </Stepper>
        </form>
      </Form>
    </div>
  )
}
