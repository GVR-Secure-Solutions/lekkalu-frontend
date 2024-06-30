import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { cloneElement, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { addGoldSchema } from '@/schema/balance-sheet'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { addPhysicalAsset, editPhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AddPhysicalAssetSchema, AddGoldType, PhysicalAsset } from '@/types/balance-sheet'
import { getErrorMessage } from '@/utils/utils'
import { useStepper } from '@/components/ui/stepper'

type Props = {
  trigger: React.ReactElement
  asset?: PhysicalAsset
  closeModal?: () => void
  isSteeper?: boolean
}

export default function AddOrEditAssetsGold({ trigger, asset, closeModal, isSteeper }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { prevStep } = useStepper()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)

  const form = useForm<AddGoldType>({
    resolver: zodResolver(addGoldSchema),
    defaultValues: {
      weight: undefined,
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

  const handleAddOrEditGoldAsset = () => {}
  // const handleAddOrEditGoldAsset = (values: AddGoldType) => {
  //   console.log('Submitting Values', values)
  // }

  const assetsInputOptionsCash = useMemo(
    () =>
      [
        {
          id: 'weight',
          label: 'Weight',
          type: 'number',
        },
      ] as InputField[],
    [],
  )

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddOrEditGoldAsset)} className='gap-4'>
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

  return isSteeper ? (
    FormContent
  ) : (
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
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Gold</DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  )
}
