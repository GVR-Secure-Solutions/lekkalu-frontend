import React, { cloneElement, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { Form } from '@/components/ui/form'
import { LENDING } from '@/utils/query-keys'
import { AddTransactionSchema } from '@/types/lending'
import { useToast } from '@/components/ui/use-toast'
import { getErrorMessage } from '@/utils/utils'
import { addTransactionSchema } from '@/schema/lending'
import {
  addLendingAccount,
  addLendingTransaction,
  fetchLendingAccounts,
  updateLendingTransaction,
} from '@/queries/lending'
import { PAYMENT_METHODS, TRANSACTION_TYPES, calculateTransactionAmount } from '@/utils/lending'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

type Props = {
  trigger: React.ReactElement
  transaction?: AddTransactionSchema
}

export default function AddOrEditTransaction({ transaction, trigger }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data: lendingAccounts } = useQuery({ queryKey: [LENDING.ACCOUNTS], queryFn: fetchLendingAccounts })
  const form = useForm<AddTransactionSchema>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      lending_account: transaction?.lending_account?.toString() || undefined,
      amount: Math.abs(
        typeof transaction?.amount === 'number' ? transaction.amount : parseFloat(transaction?.amount as string) || 0,
      ),
      time: transaction?.time ? new Date(transaction.time) : new Date(),
      payment_method: transaction?.payment_method || undefined,
      reference_no: transaction?.reference_no,
      note: transaction?.note,
      type: (transaction?.amount as number) < 0 ? 'borrow' : 'lend',
    },
  })

  const lendingAccount = form.watch('lending_account')

  const isNewAccount = useMemo(
    () => Array.isArray(lendingAccount) && lendingAccount.length > 0 && lendingAccount[0]?.id === undefined,
    [lendingAccount],
  )
  const addAccountMutation = useMutation({
    mutationFn: addLendingAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      form.reset()
      setIsDialogOpen(false)
      toast({ title: 'Account created successfully!' })
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const addTransactionMutation = useMutation({
    mutationFn: addLendingTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [LENDING.TRANSACTIONS] })
      form.reset()
      toast({ title: 'Transaction created successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const updateTransactionMutation = useMutation({
    mutationFn: (dto: AddTransactionSchema) => updateLendingTransaction(transaction?.id!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      queryClient.invalidateQueries({ queryKey: [LENDING.TRANSACTIONS] })
      toast({ title: 'Transaction updated successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const lendingAccountOptions = useMemo(() => {
    return (
      lendingAccounts?.map((acc) => ({
        id: acc.id?.toString(),
        label: acc.name,
        ...(transaction ? {} : { value: acc.name }), // Only include 'value' if there is no transaction
      })) ?? []
    )
  }, [lendingAccounts, transaction])

  const inputs = useMemo(() => {
    return [
      {
        id: 'type',
        label: 'Select Type',
        type: 'select',
        options: TRANSACTION_TYPES,
      },
      {
        id: 'lending_account',
        label: 'Select Lending Account',
        type: transaction ? 'select' : 'multi-select',
        options: lendingAccountOptions,
        maxSelection: 1,
        helpText: 'A lending account is where your transactions will be recorded.',
        closeOnSelect: true,
      },
      {
        id: 'amount',
        label: isNewAccount ? 'Principal Amount' : 'Amount',
        type: 'number',
      },
      {
        id: 'time',
        label: 'Date',
        type: 'date',
        defaultDate: transaction?.time ? new Date(transaction.time) : new Date(),
      },
    ] as InputField[]
  }, [lendingAccountOptions, transaction, isNewAccount])

  const inputsForAccount = useMemo(() => {
    const inputs = [
      {
        id: 'payment_method',
        label: 'Enter Payment Method',
        type: 'select',
        options: PAYMENT_METHODS,
        helpText: 'Enter the payment method used for this transaction.',
      },
      {
        id: 'reference_no',
        label: 'Enter Reference No',
        type: 'text',
        helpText: 'Enter a reference number for this transaction if available.',
      },
      {
        id: 'note',
        label: 'Enter Note',
        type: 'text',
        helpText: 'Add any additional notes or details for this transaction.',
      },
    ] as InputField[]

    if (isNewAccount && !transaction) {
      inputs.unshift(
        {
          id: 'partner_email',
          label: 'Enter Email',
          type: 'text',
          helpText: 'Enter the email of the partner who owns this account.',
        },
        {
          id: 'user_remark',
          label: 'Remarks',
          type: 'text',
          helpText: 'Enter any additional remarks for this account.',
        },
      )
    }

    return inputs
  }, [isNewAccount, transaction])

  const handleAddOrEditLendingTransaction = () => {
    const values = form.getValues()
    const type = values.type
    const lending_account = values.lending_account

    // ** Checking if there is an account
    if (!lending_account || lending_account?.length === 0) {
      form.setError('lending_account', {
        message: 'Please select an account',
      })
      return
    }
    const amount = typeof values.amount === 'number' ? values.amount : parseFloat(values.amount as string) || 0

    const newTransaction = {
      ...values,
      id: transaction?.id,
      amount: type ? calculateTransactionAmount(type, amount) : amount,
    }

    /** Handling case of transaction updation */
    if (transaction) {
      updateTransactionMutation.mutate(newTransaction)
      return
    }
    if (Array.isArray(lending_account)) {
      /** Handling case of transaction creation */
      if (lending_account?.some((ele) => ele.id)) {
        // there is already an account, so add transaction
        addTransactionMutation.mutate({
          ...values,
          lending_account: lending_account[0].id as string,
          amount: type ? calculateTransactionAmount(type, values.amount as number) : values.amount,
        })
      } else {
        // there is no account, so add account as first transaction
        addAccountMutation.mutate({
          started: values.time,
          partner_email: values.partner_email as string,
          name: lending_account[0].value?.charAt(0)?.toUpperCase() + lending_account[0].value?.slice(1),
          principal: type ? calculateTransactionAmount(type, values.amount as number) : values.amount,
        })
      }
    }
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
          <DialogTitle>{transaction ? 'Edit' : 'Add'} Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddOrEditLendingTransaction)} className='space-y-4'>
            <InputFieldsRenderer control={form.control} inputs={inputs} />

            <Collapsible>
              <CollapsibleTrigger className='flex hover:underline justify-between items-center w-full mb-5 text-sm font-medium'>
                Advance Options
                <ChevronDown size={20} />
              </CollapsibleTrigger>
              <CollapsibleContent className='flex flex-col gap-3'>
                <InputFieldsRenderer control={form.control} inputs={inputsForAccount} />
              </CollapsibleContent>
            </Collapsible>
            <DialogFooter className='gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type='submit' loading={addTransactionMutation.isPending || updateTransactionMutation.isPending}>
                {transaction ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
