import React, { cloneElement, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { omit } from 'lodash'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import InputFieldsRenderer from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { addLiabilitySchema } from '@/schema/balance-sheet'
import { addLiability, editLiability } from '@/queries/balance-sheet'
import { LIABILITY_INPUTS } from '@/utils/balance-sheet'
import { AddLiabilitySchema, Liability } from '@/types/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { getErrorMessage } from '@/utils/utils'

type Props = {
  trigger: React.ReactElement
  liability?: Liability
}

export default function AddOrEditLiabilityDialog({ trigger, liability }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(liability)

  const form = useForm<AddLiabilitySchema>({
    resolver: zodResolver(addLiabilitySchema),
    defaultValues: {
      ...omit(liability, 'id'),
      //   @ts-expect-error
      disbursement_date: dayjs(liability?.disbursement_date).toDate(),
    },
  })

  const addLiabilityMutation = useMutation({
    mutationFn: addLiability,
    onSuccess: () => {
      form.reset()
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.LIABILITIES] })
      toast({ title: 'Liability created successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const editLiabilityMutation = useMutation({
    mutationFn: (dto: AddLiabilitySchema) => editLiability(liability?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.LIABILITIES] })
      toast({ title: 'Liability edited successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const handleCreateOrEdit = (values: AddLiabilitySchema) => {
    const valuesToSubmit = { ...values, disbursement_date: dayjs(values.disbursement_date).format(SERVER_DATE_FORMAT) }
    /** Handling the case of editing */
    if (typeof liability !== 'undefined') {
      editLiabilityMutation.mutate(valuesToSubmit)
      return
    }

    /** Handling the case of creating */
    addLiabilityMutation.mutate(valuesToSubmit)
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
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Liability</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateOrEdit)} className='grid md:grid-cols-2 gap-4'>
            <InputFieldsRenderer control={form.control} inputs={LIABILITY_INPUTS} />

            <DialogFooter className='gap-2 md:col-span-2'>
              <Button
                loading={addLiabilityMutation.isPending || editLiabilityMutation.isPending}
                type='button'
                variant='outline'
                onClick={() => {
                  setIsDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type='submit' loading={addLiabilityMutation.isPending || editLiabilityMutation.isPending}>
                {isEdit ? 'Edit' : 'Add'} Liability
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
