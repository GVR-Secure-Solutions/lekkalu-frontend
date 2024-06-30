import React, { cloneElement, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { addPhysicalAssetSchema } from '@/schema/balance-sheet'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { addPhysicalAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AddPhysicalAssetSchema, AddPhysicalAssetType, PhysicalAsset } from '@/types/balance-sheet'
import { getErrorMessage } from '@/utils/utils'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { useStepper } from '@/components/ui/stepper'

type Props = {
  trigger: React.ReactElement
  asset?: PhysicalAsset
  closeModal?: () => void
  isSteeper?: boolean
}

export default function AddOrEditAssetsPhysical({ trigger, asset, closeModal, isSteeper }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { prevStep } = useStepper()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)

  const form = useForm<AddPhysicalAssetType>({
    resolver: zodResolver(addPhysicalAssetSchema),
    mode: 'onChange',
    defaultValues: {
      name: asset?.name ?? undefined,
      purchase_date: asset?.purchase_date ? new Date(asset?.purchase_date) : new Date(),
      purchase_value: Number(asset?.purchase_value) ?? undefined,
      percentage_value: Math.abs(Number(asset?.depreciation_percent_per_year)) ?? undefined,
      type: Number(asset?.depreciation_percent) < 0 ? 'apprecitaion' : 'depreciation',
    },
  })

  const addPhysicalAssetMutation = useMutation({
    mutationFn: addPhysicalAsset,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ASSETS] })
      toast({ title: 'Asset created successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const editPhysicalAssetMutation = useMutation({
    mutationFn: (dto: AddPhysicalAssetSchema) => editPhysicalAsset(asset?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ASSETS] })
      toast({ title: 'Asset updated successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const handleAddOrEditPhysicalAsset = (values: AddPhysicalAssetType) => {
    const type = values.type
    const { name, purchase_value, purchase_date, percentage_value } = values
    const depreciation_percent_per_year = type === 'depreciation' ? percentage_value : -percentage_value
    const payLoad = {
      name,
      purchase_value,
      purchase_date: dayjs(purchase_date).format(SERVER_DATE_FORMAT),
      depreciation_percent_per_year,
      type: 1,
    }
    if (isEdit) {
      editPhysicalAssetMutation.mutate(payLoad)
      return
    }
    addPhysicalAssetMutation.mutate(payLoad)
  }

  const assetsInputOptionsCash = useMemo(
    () =>
      [
        {
          id: 'name',
          label: 'Name',
          type: 'text',
          helpText: 'Enter the name of the physical asset. This could be vehicle, or equipment.',
        },
        {
          id: 'purchase_date',
          label: 'Purchase Date',
          type: 'date',
          helpText: 'Select the date when the asset was purchased.',
        },
        {
          id: 'purchase_value',
          label: 'Purchase Value',
          type: 'number',
          helpText: 'Enter the value of the asset at the time of purchase.',
        },
        {
          id: 'type',
          type: 'select',
          label: 'Type',
          options: [
            {
              label: 'Depreciation',
              id: 'depreciation',
              value: 'Depreciation',
            },
            {
              label: 'Apprecitaion',
              id: 'apprecitaion',
              value: 'Apprecitaion',
            },
          ],
          helpText: 'Select whether the asset is subject to depreciation or appreciation.',
        },
        {
          id: 'percentage_value',
          label: 'Annual % value (year)',
          type: 'number',
          helpText: 'Enter the annual percentage rate of depreciation or appreciation for the asset.',
        },
      ] as InputField[],
    [],
  )

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddOrEditPhysicalAsset)} className='gap-4'>
        <div className='md:col-span-2 space-y-2'>
          <div className='flex flex-col my-5 gap-2 w-full'>
            <InputFieldsRenderer control={form.control} inputs={assetsInputOptionsCash} />
          </div>
        </div>

        <DialogFooter className='gap-2 md:col-span-2'>
          <Button
            loading={addPhysicalAssetMutation.isPending || editPhysicalAssetMutation.isPending}
            type='button'
            variant='outline'
            onClick={() => {
              isSteeper ? prevStep() : setIsDialogOpen(false)
            }}
          >
            {isSteeper ? 'Prev' : 'Cancel'}
          </Button>
          <Button type='submit' loading={addPhysicalAssetMutation.isPending || editPhysicalAssetMutation.isPending}>
            {isEdit ? 'Edit' : 'Add'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )

  return (
    <>
      {isSteeper ? (
        FormContent
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            asChild
            onClick={() => {
              setIsDialogOpen(true)
            }}
          >
            {trigger && cloneElement(trigger)}
          </DialogTrigger>
          <DialogContent style={{ maxWidth: '800px !important' }} className='max-h-[800px] overflow-auto'>
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit' : 'Add'} Physical Asset</DialogTitle>
            </DialogHeader>
            {FormContent}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
