import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { cloneElement, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { addMutualFundSchema } from '@/schema/balance-sheet'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import {
  addSecurityTransaction,
  editAssetsPropertiesById,
  editSecurityTransaction,
  fetchAssetsPropertiesById,
  fetchMutualFunds,
} from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { getErrorMessage } from '@/utils/utils'
import { AddAssetsPropertiesType, AddMutualFundType, MutualFundSchema } from '@/types/balance-sheet'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { useStepper } from '@/components/ui/stepper'

type Props = {
  trigger: React.ReactElement
  asset?: MutualFundSchema
  closeModal?: () => void
  isSteeper?: boolean
}

export default function AddOrEditAssetsMutualFund({ trigger, asset, closeModal, isSteeper }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(asset)
  const { prevStep } = useStepper()

  const form = useForm<AddMutualFundType>({
    resolver: zodResolver(addMutualFundSchema),
    defaultValues: {
      expected_return: undefined,
      invested_amount: Number(asset?.value) ?? undefined,
      name: undefined,
      purchase_date: asset?.transaction_date ? new Date(asset?.transaction_date) : new Date(),
      quantity: Number(asset?.quantity) ?? 1,
    },
  })

  const { data: mutualFunds, status: isMutualFundsSuccess } = useQuery({
    queryKey: [BALANCE_SHEET.MUTUAL_FUNDS],
    queryFn: fetchMutualFunds,
    enabled: isDialogOpen || isSteeper,
  })

  useEffect(() => {
    if (isMutualFundsSuccess === 'success') {
      const fund = mutualFunds.find((fund) => fund.id === asset?.security_object_id)
      form.setValue('name', fund?.id?.toString() as any)
    }
  }, [isMutualFundsSuccess, mutualFunds, asset?.security_object_id, form])

  const { data: assetProperties, status: isAssetPropertiesSuccess } = useQuery({
    queryKey: [BALANCE_SHEET.ASSETS_PROPERTIES],
    queryFn: () => fetchAssetsPropertiesById(asset ? asset?.security_object_id : Number(form.watch('name'))),
    enabled: !!form.watch('name'),
  })

  useEffect(() => {
    if (isAssetPropertiesSuccess === 'success') {
      form.setValue('expected_return', Number(assetProperties?.expected_rate_of_return))
    } else if (isAssetPropertiesSuccess === 'error') {
      form.setValue('expected_return', 0)
    }
  }, [isAssetPropertiesSuccess, assetProperties, form])

  const mutualFundsOptions = useMemo(() => {
    return (
      mutualFunds?.map((acc) => ({
        id: acc.id?.toString(),
        label: acc.name,
        value: acc.id,
      })) ?? []
    )
  }, [mutualFunds])

  const addMutualFundMutation = useMutation({
    mutationFn: addSecurityTransaction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.SECURITIES_TRANSACTIONS] })
      toast({ title: 'Mutual fund created successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const editMutualFundMutation = useMutation({
    mutationFn: (dto: MutualFundSchema) => editSecurityTransaction(asset?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.SECURITIES_TRANSACTIONS] })
      toast({ title: 'Mutual fund updated successfully!' })
      setIsDialogOpen(false)
      closeModal?.()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const editAssetPropertiesMutation = useMutation({
    mutationFn: (dto: AddAssetsPropertiesType) => editAssetsPropertiesById(dto.security_object_id, dto),
  })

  const handleAddOrEditMutualFundAsset = (values: AddMutualFundType) => {
    const { quantity, invested_amount, purchase_date } = values
    const fund = mutualFunds?.find((fund) => fund.id?.toString() === form.getValues('name'))
    const expectedRate = parseFloat(assetProperties?.expected_rate_of_return || '0')
    const expected_return = form.getValues('expected_return')
    const payLoad = {
      type: 'Buy',
      value: invested_amount,
      quantity,
      security_object_id: 1,
      transaction_date: dayjs(purchase_date).format(SERVER_DATE_FORMAT),
      security_type: 'MutualFund',
    }
    // checking weather expected return value is changed or not
    if (expectedRate !== expected_return) {
      editAssetPropertiesMutation.mutate(
        {
          expected_rate_of_return: expected_return?.toString(),
          security_type: 'MutualFund',
          security_object_id: fund?.id ?? 1,
        },
        {
          onSuccess: () => {
            if (asset) {
              editMutualFundMutation.mutate(payLoad)
            } else {
              addMutualFundMutation.mutate(payLoad)
            }
          },
        },
      )
    } else {
      if (asset) {
        editMutualFundMutation.mutate(payLoad)
      } else {
        addMutualFundMutation.mutate(payLoad)
      }
    }
  }

  const assetsInputOptionsCash = useMemo(
    () =>
      [
        {
          id: 'name',
          label: 'Name',
          type: 'select',
          options: mutualFundsOptions,
          helpText: 'Select the name of the mutual fund from the available options.',
        },
        {
          id: 'invested_amount',
          label: 'Invested Amount',
          type: 'number',
          helpText: 'Enter the amount of money you have invested in this mutual fund.',
        },
        {
          id: 'expected_return',
          label: 'Expected Return',
          type: 'number',
          helpText: 'Enter the expected return on investment as a percentage.',
        },
        {
          id: 'quantity',
          label: 'Quantity',
          type: 'number',
          helpText: 'Enter the quantity of mutual fund units purchased.',
        },
        {
          id: 'purchase_date',
          label: 'Purchase Date',
          type: 'date',
          helpText: 'Select the date when the mutual fund units were purchased.',
        },
      ] as InputField[],
    [mutualFundsOptions],
  )

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddOrEditMutualFundAsset)} className='gap-4'>
        <div className='md:col-span-2 space-y-2'>
          <div className='flex flex-col my-5 gap-2 w-full'>
            <InputFieldsRenderer control={form.control} inputs={assetsInputOptionsCash} />
          </div>
        </div>

        <DialogFooter className='gap-2 md:col-span-2'>
          <Button
            loading={addMutualFundMutation.isPending || editMutualFundMutation.isPending}
            type='button'
            variant='outline'
            onClick={() => {
              isSteeper ? prevStep() : setIsDialogOpen(false)
            }}
          >
            {isSteeper ? 'Prev' : 'Cancel'}
          </Button>
          <Button type='submit' loading={addMutualFundMutation.isPending || editMutualFundMutation.isPending}>
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
          <DialogContent className='max-h-[800px] overflow-auto'>
            <DialogHeader>
              <DialogTitle>{isEdit ? 'Edit' : 'Add'} Mutual Fund Transaction</DialogTitle>
            </DialogHeader>
            {FormContent}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
