import React, { cloneElement, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { omit } from 'lodash'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import InputFieldsRenderer from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { AddLiabilitySchema, addLiabilitySchema } from '@/schema/balance-sheet'
import { LIABILITY_INPUTS_FOR_SCENARIO, LIABILITY_INPUTS_FOR_SCENARIO_ADVANCE } from '@/utils/balance-sheet'
import { Liability } from '@/types/balance-sheet'
import { AUTH, BALANCE_SHEET } from '@/utils/query-keys'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { getErrorMessage } from '@/utils/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

type Props = {
  trigger: React.ReactElement
  liability?: Liability
  addLiability: (dto: AddLiabilitySchema) => Promise<any>
  editLiability: (id: number, dto: Partial<AddLiabilitySchema>) => Promise<any>
}

export default function AddOrEditLiabilityDialog({ trigger, liability, editLiability, addLiability }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: username } = useQuery<any>([AUTH.CURRENT_IMAGINARY_USER])
  const { toast } = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(liability)

  const form = useForm<AddLiabilitySchema>({
    resolver: zodResolver(addLiabilitySchema),
    defaultValues: {
      ...omit(liability, 'id'),
      // @ts-expect-error
      disbursement_date: liability?.disbursement_date ? dayjs(liability?.disbursement_date).toDate() : dayjs(),
      balance: liability?.balance ? +liability?.balance : 0,
      emi_day: liability?.emi_day ? +liability?.emi_day : 1,
      emi: liability?.emi ? +liability?.emi : 0,
      closure_charges: liability?.closure_charges ? +liability?.closure_charges : 0,
    },
  })

  const addLiabilityMutation = useMutation(addLiability, {
    onSuccess: () => {
      form.reset()
      qc.invalidateQueries([`${BALANCE_SHEET.LIABILITIES}-${username}`])
      toast({ title: 'Liability created successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const editLiabilityMutation = useMutation((dto: AddLiabilitySchema) => editLiability(liability?.id!, dto), {
    onSuccess: () => {
      qc.invalidateQueries([`${BALANCE_SHEET.LIABILITIES}-${username}`])
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
      <DialogContent className='max-h-[800px] overflow-auto'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Liability</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateOrEdit)}>
            <div className='grid md:grid-cols-2 gap-4'>
              <InputFieldsRenderer control={form.control} inputs={LIABILITY_INPUTS_FOR_SCENARIO} />
            </div>
            <Collapsible>
              <CollapsibleTrigger>
                <p className='my-5'>Advance Options</p>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='grid md:grid-cols-2 gap-4'>
                  <InputFieldsRenderer control={form.control} inputs={LIABILITY_INPUTS_FOR_SCENARIO_ADVANCE} />
                </div>
              </CollapsibleContent>
            </Collapsible>
            <DialogFooter className='gap-2 md:col-span-2 mt-5'>
              <Button
                loading={addLiabilityMutation.isLoading || editLiabilityMutation.isLoading}
                type='button'
                variant='outline'
                onClick={() => {
                  setIsDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type='submit' loading={addLiabilityMutation.isLoading || editLiabilityMutation.isLoading}>
                {isEdit ? 'Edit' : 'Add'} Liability
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
