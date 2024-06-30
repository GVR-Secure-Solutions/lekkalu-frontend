import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { cloneElement, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { addAccountTransactionSchema } from '@/schema/balance-sheet'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { addAccountTransactionAsset, editAccountTransactionAsset, fetchAccountAssets } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AccountTransactionSchema, AddAccountTransactionSchema } from '@/types/balance-sheet'
import { getErrorMessage } from '@/utils/utils'
import { useStepper } from '@/components/ui/stepper'

type Props = {
  trigger: React.ReactElement
  asset?: AccountTransactionSchema
  closeModal?: () => void
  isSteeper?: boolean
}

export default function AddOrEditAssetsAccountTransaction({ trigger, asset, closeModal, isSteeper }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const qc = useQueryClient()
  const { prevStep } = useStepper()
  const isEdit = Boolean(asset)
  const { data: accounts } = useQuery({
    queryKey: [BALANCE_SHEET.ACCOUNT],
    queryFn: fetchAccountAssets,
    enabled: isDialogOpen || isSteeper,
  })
  const form = useForm<AddAccountTransactionSchema>({
    resolver: zodResolver(addAccountTransactionSchema),
    defaultValues: {
      amount: Number(asset?.amount) ?? undefined,
      account: asset ? asset.account.toString() : undefined,
      time: asset ? asset?.time : new Date(),
    },
  })
  const addAccountTransactionMutation = useMutation({
    mutationFn: addAccountTransactionAsset,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ACCOUNT_TRANSACTIONS] })
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ACCOUNT] })
      toast({ title: 'Transaction created successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
      form.reset()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const editAccountAssetMutation = useMutation({
    mutationFn: (dto: AddAccountTransactionSchema) => editAccountTransactionAsset(asset?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ACCOUNT_TRANSACTIONS] })
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ACCOUNT] })
      toast({ title: 'Transaction updated successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const handleAddOrEditAccountAsset = (values: AddAccountTransactionSchema) => {
    const newData = {
      ...values,
      account: Number(values.account),
      type: 1,
    }
    if (isEdit) {
      editAccountAssetMutation.mutate(newData)
      return
    }
    addAccountTransactionMutation.mutate(newData)
    closeModal?.()
  }

  const accountOptions = useMemo(() => {
    return (
      accounts?.map((acc) => ({
        id: acc.id?.toString(),
        label: acc.name,
        value: acc.name,
      })) ?? []
    )
  }, [accounts])
  const assetsInputOptionsCash = useMemo(
    () =>
      [
        {
          id: 'account',
          label: 'Account Name',
          type: 'select',
          options: accountOptions,
          maxSelection: 1,
          helpText: 'A account is where your transactions will be recorded.',
          closeOnSelect: true,
        },
        {
          id: 'amount',
          label: 'Amount',
          type: 'number',
          helpText: 'Enter the total amount of money currently held in the account.',
        },
        {
          id: 'time',
          label: 'Date',
          type: 'date',
          helpText: 'Enter the date on which the transaction created.',
          defaultDate: new Date(),
        },
      ] as InputField[],
    [accountOptions],
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
            loading={addAccountTransactionMutation.isPending || editAccountAssetMutation.isPending}
            type='button'
            variant='outline'
            onClick={() => {
              isSteeper ? prevStep() : setIsDialogOpen(false)
            }}
          >
            {isSteeper ? 'Prev' : 'Cancel'}
          </Button>
          <Button type='submit' loading={addAccountTransactionMutation.isPending || editAccountAssetMutation.isPending}>
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
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Account Transaction</DialogTitle>
        </DialogHeader>
        {FormContent}
      </DialogContent>
    </Dialog>
  )
}
