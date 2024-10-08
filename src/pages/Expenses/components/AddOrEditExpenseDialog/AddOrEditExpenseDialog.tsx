import React, { cloneElement, useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { AddExpenseSchema, addExpenseSchema } from '@/schema/expense'
import { Form } from '@/components/ui/form'
import { EXPENSES, TAGS } from '@/utils/query-keys'
import { fetchTags } from '@/queries/tag'
import { addExpense, fetchExpenses, updateExpense } from '@/queries/expense'
import {
  EXPENSE_FILE_VALID_COLUMNS,
  getOrCreateTag,
  validateFileColumns,
  getIdAndUniqueIdArray,
  checkIsExpenseExists,
} from '@/utils/expense'
import { useToast } from '@/components/ui/use-toast'
import { Expense } from '@/types/expense'
import { Input } from '@/components/ui/input'
import { ALLOWED_EXPENSES_FILE_TYPES, MAX_EXPENSES_ALLOWED } from '@/utils/constants'
import { getErrorMessage } from '@/utils/utils'

type Props = {
  trigger: React.ReactElement
  expense?: Expense
}

type ExcelData = {
  amount: number
  tags: string
  date: string
}

export default function AddOrEditExpenseDialog({ expense, trigger }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: tags, refetch: refetchTags } = useQuery({
    queryKey: [TAGS.TAGS],
    queryFn: fetchTags,
    enabled: !!isDialogOpen,
  })
  const { data: expenses } = useQuery({
    queryKey: [EXPENSES.EXPENSES],
    queryFn: () => fetchExpenses(),
    enabled: !!isDialogOpen,
  })
  const form = useForm<AddExpenseSchema>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      amount: expense?.amount ? Number(expense.amount) : undefined,
      // @TODO: Add multiple tags
      tags: expense?.tags
        ? expense.tags.map((tagId) => ({
            id: tagId,
            label: tags?.find((e) => e.id === tagId)?.name,
            value: tags?.find((e) => e.id === tagId)?.name,
          }))
        : undefined,
      time: expense?.time ? new Date(expense.time) : undefined,
    },
  })

  const addExpenseMutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES.EXPENSES] })
      refetchTags()
      form.reset()
      toast({ title: 'Expense created successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const updateExpenseMutation = useMutation({
    mutationFn: (dto: Omit<AddExpenseSchema, 'tags'> & { tags: number[] }) => updateExpense(expense?.id!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSES.EXPENSES] })
      refetchTags()
      toast({ title: 'Expense updated successfully!' })
      setIsDialogOpen(false)
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const inputs = useMemo(() => {
    return [
      {
        id: 'amount',
        label: 'Provide the amount',
        type: 'number',
      },
      {
        id: 'tags',
        label: 'Select tags',
        type: 'multi-select',
        options: tags?.map((tag) => ({ id: tag.id, label: tag.name, value: tag.name })) ?? [],
      },
      {
        id: 'time',
        label: 'Choose the Date',
        type: 'date',
        defaultDate: expense?.time ? new Date(expense.time) : undefined,
      },
    ] as InputField[]
  }, [tags, expense?.time])
  const handleAddOrEditExpense = async (values: AddExpenseSchema) => {
    const newTagsArray = getIdAndUniqueIdArray(values.tags)
    const tagIds = await getOrCreateTag(newTagsArray.newIdArr, tags ?? [])
    const newExpense = {
      amount: parseFloat(values.amount.toFixed(2)),
      tags: [...newTagsArray.idArr, ...tagIds],
      time: values.time,
    }
    /** Handling case of expense updation */
    if (expense) {
      updateExpenseMutation.mutate(newExpense)
      return
    }

    /** Handling case of expense creation */
    const exists = checkIsExpenseExists(expenses?.records ?? [], {
      ...newExpense,
      amount: newExpense.amount.toString(),
    })
    if (exists) {
      toast({ title: 'Expense already exists!', variant: 'destructive' })
      return
    }

    addExpenseMutation.mutate(newExpense)
  }

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target?.files?.[0]
      if (!file) {
        return
      }

      /** Validate file type */
      if (!ALLOWED_EXPENSES_FILE_TYPES.includes(file.type)) {
        toast({ title: 'Invalid file type!', description: 'Please upload a valid excel file!', variant: 'destructive' })
        return
      }

      const reader = new FileReader()
      reader.onload = async (readerEvent) => {
        const data = readerEvent?.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })

        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        const parsedData = XLSX.utils.sheet_to_json<ExcelData>(sheet)
        if (parsedData.length > MAX_EXPENSES_ALLOWED) {
          toast({
            title: 'Too many entries in file',
            description: `Please upload a file with maximum of ${MAX_EXPENSES_ALLOWED} entries!`,
            variant: 'destructive',
          })
          return
        }

        if (parsedData.length > 0) {
          const item = parsedData[0]
          const validColumns = validateFileColumns(Object.keys(item))
          if (!validColumns) {
            toast({
              title: 'Invalid Columns',
              description: `File does not contain required columns. Make sure you have ${EXPENSE_FILE_VALID_COLUMNS.join(
                ', ',
              )} in your file!`,
              variant: 'destructive',
            })
            return
          }

          for (const expense of parsedData) {
            const time = dayjs(expense.date).toDate()
            const newTags = expense.tags.split(',')
            const amount = parseFloat(expense.amount.toFixed(2))
            const tagIds = await getOrCreateTag(newTags, tags ?? [])
            addExpenseMutation.mutate({ amount, tags: tagIds, time })
          }

          toast({ title: 'Expenses created successfully!' })
          refetchTags()
        }
      }

      reader.readAsBinaryString(file)
    },
    [addExpenseMutation, refetchTags, tags, toast],
  )

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
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddOrEditExpense)} className='space-y-4'>
            <InputFieldsRenderer control={form.control} inputs={inputs} />

            <DialogFooter className='gap-2'>
              <Input
                type='file'
                accept='.xls,.xlsx'
                onChange={handleFileUpload}
                disabled={addExpenseMutation.isPending || updateExpenseMutation.isPending}
              />
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setIsDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type='submit' loading={addExpenseMutation.isPending || updateExpenseMutation.isPending}>
                {expense ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
