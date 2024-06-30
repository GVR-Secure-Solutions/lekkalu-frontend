import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { cloneElement, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { addAccountSchema } from '@/schema/balance-sheet'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { addAccountAsset, editAccountAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AddAccountSchema, AccountSchema } from '@/types/balance-sheet'
import { getErrorMessage } from '@/utils/utils'
import { useStepper } from '@/components/ui/stepper'

type Props = {
  trigger: React.ReactElement
  asset?: AccountSchema
  closeModal?: () => void
  isSteeper?: boolean
}

export default function AddOrEditAssetsAccount({ trigger, asset, closeModal, isSteeper }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const qc = useQueryClient()
  const { prevStep } = useStepper()
  const isEdit = Boolean(asset)
  const form = useForm<AddAccountSchema>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      balance: Number(asset?.balance) ?? undefined,
      name: asset?.name ?? '',
      // rate_return: undefined,
    },
  })

  const addAccountAssetMutation = useMutation({
    mutationFn: addAccountAsset,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ACCOUNT] })
      toast({ title: 'Asset created successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const editAccountAssetMutation = useMutation({
    mutationFn: (dto: AddAccountSchema) => editAccountAsset(asset?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ACCOUNT] })
      toast({ title: 'Asset updated successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const handleAddOrEditAccountAsset = (values: AddAccountSchema) => {
    if (isEdit) {
      editAccountAssetMutation.mutate(values)
    } else {
      addAccountAssetMutation.mutate(values)
    }
    closeModal?.()
  }

  const assetsInputOptionsCash = useMemo(
    () =>
      [
        {
          id: 'name',
          label: 'Account Name',
          type: 'text',
          helpText:
            'Enter the name of the account. This could be a savings account, checking account, or any other type of financial account.',
        },
        {
          id: 'balance',
          label: 'Amount',
          type: 'number',
          helpText: 'Enter the total amount of money currently held in the account.',
        },
        // {
        //   id: 'rate_return',
        //   label: 'Rate Return',
        //   type: 'number',
        //   helpText:
        //     'Enter the annual rate of return for the account. This is the percentage of interest or growth expected per year.',
        // },
      ] as InputField[],
    [],
  )

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddOrEditAccountAsset)} className='gap-4'>
        <div className='md:col-span-2 space-y-2'>
          <div className='flex flex-col my-5 gap-2 w-full'>
            <InputFieldsRenderer control={form.control} inputs={assetsInputOptionsCash} />
          </div>
        </div>

        <DialogFooter className='gap-2 md:col-span-2'>
          <Button
            loading={addAccountAssetMutation.isPending || editAccountAssetMutation.isPending}
            type='button'
            variant='outline'
            onClick={() => {
              isSteeper ? prevStep() : setIsDialogOpen(false)
            }}
          >
            {isSteeper ? 'Prev' : 'Cancel'}
          </Button>
          <Button type='submit' loading={addAccountAssetMutation.isPending || editAccountAssetMutation.isPending}>
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
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Account</DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  )
}
