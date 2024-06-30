import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { cloneElement, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { addCashSchema } from '@/schema/balance-sheet'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { getErrorMessage } from '@/utils/utils'
import { addCashAsset, editCashAsset } from '@/queries/balance-sheet'
import { AddCashType } from '@/types/balance-sheet'
import { useStepper } from '@/components/ui/stepper'

type Props = {
  trigger: React.ReactElement
  asset?: AddCashType
  closeModal?: () => void
  isSteeper?: boolean
}

export default function AddOrEditAssetsCash({ trigger, asset, closeModal, isSteeper }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { prevStep } = useStepper()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)
  const form = useForm<AddCashType>({
    resolver: zodResolver(addCashSchema),
    defaultValues: {
      balance: Number(asset?.balance) ?? undefined,
      name: asset?.name ?? undefined,
    },
  })

  const addCashMutation = useMutation({
    mutationFn: addCashAsset,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.CASH] })
      toast({ title: 'Cash added successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const editCashMutation = useMutation({
    mutationFn: (dto: AddCashType) => editCashAsset(asset?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.CASH] })
      toast({ title: 'Cash updated successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const handleAddOrEditCashAsset = (values: AddCashType) => {
    if (isEdit) {
      editCashMutation.mutate(values)
    } else {
      addCashMutation.mutate(values)
    }
  }

  const assetsInputOptionsCash: InputField[] = useMemo(
    () => [
      {
        id: 'name',
        label: 'Name',
        type: 'text',
        helpText: 'Enter the name of the cash asset.',
      },
      {
        id: 'balance',
        label: 'Amount',
        type: 'number',
        helpText: 'Enter the total amount of cash available',
      },
    ],
    [],
  )

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddOrEditCashAsset)} className='gap-4'>
        <div className='md:col-span-2 space-y-2'>
          <div className='flex flex-col my-5 gap-2 w-full'>
            <InputFieldsRenderer control={form.control} inputs={assetsInputOptionsCash} />
          </div>
        </div>

        <DialogFooter className='gap-2 md:col-span-2'>
          <Button
            loading={addCashMutation.isPending || editCashMutation.isPending}
            type='button'
            variant='outline'
            onClick={() => {
              isSteeper ? prevStep() : setIsDialogOpen(false)
            }}
          >
            {isSteeper ? 'Prev' : 'Cancel'}
          </Button>
          <Button type='submit' loading={addCashMutation.isPending || editCashMutation.isPending}>
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
        {trigger && cloneElement(trigger)}
      </DialogTrigger>
      <DialogContent className='max-h-[800px] overflow-auto'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Cash</DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  )
}
