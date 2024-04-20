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
import { AUTH, BALANCE_SHEET } from '@/utils/query-keys'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ASSET_INPUTS_FOR_SCENARIO, ASSET_INPUTS_FOR_SCENARIO_ADVANCE } from '@/utils/balance-sheet'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { PhysicalAsset } from '@/types/balance-sheet'
import { getErrorMessage } from '@/utils/utils'
import { useAuthContext } from '@/hooks/use-auth'
import { ImaginaryUser } from '../../context/use-imaginaryAuth'
import { CollapsibleTrigger, Collapsible, CollapsibleContent } from '@/components/ui/collapsible'

type Props = {
  trigger: React.ReactElement
  asset?: PhysicalAsset & { depreciation_percent_per_year?: string }
  editAsset: (id: number, dto: Partial<AddPhysicalAssetSchemaForScenario>) => Promise<PhysicalAsset[]>
  addAsset: (dto: AddPhysicalAssetSchemaForScenario) => Promise<PhysicalAsset[]>
}

export default function AddOrEditAssetsForScenario({ trigger, asset, addAsset, editAsset }: Props) {
  const { userData } = useAuthContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: imag_users } = useQuery<ImaginaryUser>({ queryKey: [AUTH.IMAGINARY_CLIENT] })
  const { data: current_imag_user } = useQuery<string>({ queryKey: [AUTH.CURRENT_IMAGINARY_USER] })
  const user_id = imag_users?.[current_imag_user as string].id
  const { toast } = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)

  const form = useForm<AddPhysicalAssetSchemaForScenario & { depreciation_percent_per_year: number }>({
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
      depreciation_percent: Math.abs(Number(asset?.depreciation_percent_per_year)) ?? 1,
    },
  })

  const addPhysicalAssetMutation = useMutation({
    mutationFn: addAsset,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`${BALANCE_SHEET.ASSETS}-${current_imag_user}`] })
      toast({ title: 'Asset created successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const editPhysicalAssetMutation = useMutation({
    mutationFn: (dto: AddPhysicalAssetSchemaForScenario) => editAsset(asset?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [`${BALANCE_SHEET.ASSETS}-${current_imag_user}`] })
      toast({ title: 'Asset updated successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const handleAddOrEditPhysicalAsset = (values: AddPhysicalAssetSchemaForScenario) => {
    const valuesToSubmit: any = {
      ...values,
      purchase_date: dayjs(values.purchase_date).format(SERVER_DATE_FORMAT),
      sell_date: dayjs(values.sell_date).format(SERVER_DATE_FORMAT),
      depreciation_percent_per_year: -values.depreciation_percent,
      //   depreciation_frequency: monthsToSeconds(values.months) + yearsToSeconds(values.years),
    }

    delete valuesToSubmit.depreciation_percent

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Asset</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddOrEditPhysicalAsset)}>
            <div className='grid md:grid-cols-2 gap-4'>
              <InputFieldsRenderer control={form.control} inputs={ASSET_INPUTS_FOR_SCENARIO} />
            </div>
            <Collapsible>
              <CollapsibleTrigger>
                <p className='my-5'>Advance Options</p>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='grid md:grid-cols-2 gap-4'>
                  <InputFieldsRenderer control={form.control} inputs={ASSET_INPUTS_FOR_SCENARIO_ADVANCE} />
                </div>
              </CollapsibleContent>
            </Collapsible>
            <DialogFooter className='gap-2 md:col-span-2 mt-5'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type='submit' loading={addPhysicalAssetMutation.isPending || editPhysicalAssetMutation.isPending}>
                {isEdit ? 'Edit' : 'Add'} Asset
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
