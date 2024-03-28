/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { cloneElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { omit } from 'lodash'
import { useToast } from '@/components/ui/use-toast'
import { AddPhysicalAssetSchemaForScenario, addPhysicalAssetSchemaForScenario } from '@/schema/balance-sheet'
import InputFieldsRenderer from '@/components/InputFieldsRenderer/InputFieldsRenderer'
// import { addPhysicalAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { AUTH, BALANCE_SHEET } from '@/utils/query-keys'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  // FormControl,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage
} from '@/components/ui/form'
import {
  ASSET_INPUTS,
  // ASSET_MONTHS,
  //  ASSET_YEARS
} from '@/utils/balance-sheet'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { PhysicalAsset } from '@/types/balance-sheet'
// import { monthsToSeconds, yearsToSeconds } from '@/utils/time'
// import { useAuthContext } from '@/hooks/use-auth'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getErrorMessage } from '@/utils/utils'
import { useAuthContext } from '@/hooks/use-auth'
import { ImaginaryUser } from '../../context/use-imaginaryAuth'

type Props = {
  trigger: React.ReactElement
  asset?: PhysicalAsset
  editAsset: (id: number, dto: Partial<AddPhysicalAssetSchemaForScenario>) => Promise<PhysicalAsset[]>
  addAsset: (dto: AddPhysicalAssetSchemaForScenario) => Promise<PhysicalAsset[]>
}

export default function AddOrEditAssetsForScenario({ trigger, asset, addAsset, editAsset }: Props) {
  const { userData } = useAuthContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: imag_users } = useQuery<ImaginaryUser>([AUTH.IMAGINARY_CLIENT])
  const { data: current_imag_user } = useQuery<string>([AUTH.CURRENT_IMAGINARY_USER])
  const user_id = imag_users?.[current_imag_user as string].id
  const { toast } = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)

  const form = useForm<AddPhysicalAssetSchemaForScenario>({
    resolver: zodResolver(addPhysicalAssetSchemaForScenario),
    defaultValues: {
      ...omit(asset, 'id'),
      // @ts-expect-error
      purchase_date: asset?.purchase_date ? dayjs(asset.purchase_date).toDate() : undefined,
      // @ts-expect-error
      sell_date: asset?.sell_date ? dayjs(asset.sell_date).toDate() : undefined,
      tags: [],
      type: 1,
      user: user_id ?? -1,
      init_dep: asset?.depreciation_percent ? Number(asset?.depreciation_percent) : 1,
    },
  })

  const addPhysicalAssetMutation = useMutation(addAsset, {
    onSuccess: () => {
      qc.invalidateQueries([BALANCE_SHEET.ASSETS])
      toast({ title: 'Asset created successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const editPhysicalAssetMutation = useMutation(
    (dto: AddPhysicalAssetSchemaForScenario) => editAsset(asset?.id!, dto),
    {
      onSuccess: () => {
        qc.invalidateQueries([BALANCE_SHEET.ASSETS])
        toast({ title: 'Asset updated successfully!' })
        setIsDialogOpen(false)
      },
      onError: (err) => toast(getErrorMessage(err)),
    },
  )

  const handleAddOrEditPhysicalAsset = (values: AddPhysicalAssetSchemaForScenario) => {
    const valuesToSubmit = {
      ...values,
      purchase_date: dayjs(values.purchase_date).format(SERVER_DATE_FORMAT),
      sell_date: dayjs(values.sell_date).format(SERVER_DATE_FORMAT),
      //   depreciation_frequency: monthsToSeconds(values.months) + yearsToSeconds(values.years),
    }

    if (typeof asset !== 'undefined') {
      editPhysicalAssetMutation.mutate(valuesToSubmit)
      return
    }

    addPhysicalAssetMutation.mutate(valuesToSubmit)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        asChild
        onClick={() => {
          setIsDialogOpen(true)
        }}
      >
        {cloneElement(trigger)}
      </DialogTrigger>
      <DialogContent className='max-h-[800px] overflow-auto'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Asset</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddOrEditPhysicalAsset)} className='grid md:grid-cols-2 gap-4'>
            <InputFieldsRenderer control={form.control} inputs={ASSET_INPUTS} />

            {/* <div className='md:col-span-2 space-y-2'>
              <FormLabel>Depreciation Frequency</FormLabel>
              <div className='flex gap-2 w-full'>
                <FormField
                  control={form.control}
                  name='months'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Months</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} {...field} value={field.value?.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder='Select Months' />
                          </SelectTrigger>
                          <SelectContent className='max-h-72'>
                            {ASSET_MONTHS.map(({ id, label }) => (
                              <SelectItem value={id} key={id}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='years'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Years</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} {...field} value={field.value?.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder='Select Years' />
                          </SelectTrigger>
                          <SelectContent className='max-h-72'>
                            {ASSET_YEARS.map(({ id, label }) => (
                              <SelectItem value={id} key={id}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div> */}

            <DialogFooter className='gap-2 md:col-span-2'>
              <Button
                loading={addPhysicalAssetMutation.isLoading || editPhysicalAssetMutation.isLoading}
                type='button'
                variant='outline'
                onClick={() => {
                  setIsDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type='submit' loading={addPhysicalAssetMutation.isLoading || editPhysicalAssetMutation.isLoading}>
                {isEdit ? 'Edit' : 'Add'} Asset
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
