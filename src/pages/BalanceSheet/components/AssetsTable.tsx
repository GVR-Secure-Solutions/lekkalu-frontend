import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { LoaderIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { fetchPhysicalAssets } from '@/queries/balance-sheet'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AddOrEditAssetDialog from './AddOrEditAssetDialog'
import { Button } from '@/components/ui/button'
import { IndeterminateCheckbox } from '@/components/ui/indeterminate-checkbox'
import When from '@/components/When/When'
import DeleteAssetDialog from './DeleteAssetDialog'
import { formatIndianMoneyNotation } from '@/utils/format-money'
import { PhysicalAsset } from '@/types/balance-sheet'

const columnHelper = createColumnHelper<PhysicalAsset>()

export default function AssetsTable() {
  const { data, isFetching } = useQuery({ queryKey: [BALANCE_SHEET.ASSETS], queryFn: fetchPhysicalAssets })
  const [rowSelection, setRowSelection] = useState({})

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className='px-1'>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      }),
      columnHelper.accessor('name', {
        id: 'name',
        cell: (i) => i.getValue(),
        header: () => <span>Name</span>,
      }),
      columnHelper.accessor('market_value', {
        id: 'current_value',
        cell: (i) => formatIndianMoneyNotation(i.getValue()),
        header: () => <span>Current Value</span>,
      }),
      columnHelper.accessor('purchase_value', {
        id: 'purchase_value',
        cell: (i) => formatIndianMoneyNotation(i.getValue()),
        header: () => <span>Purchase Value</span>,
      }),
      columnHelper.accessor('sell_value', {
        id: 'sell_value',
        cell: (i) => formatIndianMoneyNotation(i.getValue()),
        header: () => <span>Sell Value</span>,
      }),
      columnHelper.accessor('id', {
        id: 'id',
        header: () => <span>Action</span>,
        cell: (i) => {
          return (
            <TableCell className='space-x-2'>
              <AddOrEditAssetDialog
                trigger={
                  <Button size='sm' variant='outline'>
                    <PencilIcon className='w-4 h-5' />
                  </Button>
                }
                asset={i.cell.row.original}
              />

              <DeleteAssetDialog id={[i.cell.row.original.id]} />
            </TableCell>
          )
        },
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  })

  const SELECTED_ROWS = Object.keys(table.getState().rowSelection)
  const HAS_SELECTED_MULTIPLE_ROWS = SELECTED_ROWS.length
  const SELECTED_ROWS_IDS = data?.filter((_, index) => SELECTED_ROWS.includes(String(index))).map((each) => each.id)

  return (
    <div className='space-y-2'>
      <div className='flex justify-end'>
        <AddOrEditAssetDialog
          trigger={
            <Button>
              <PlusIcon className='mr-2 w-4 h-4' />
              <span>Add Asset</span>
            </Button>
          }
        />
        {HAS_SELECTED_MULTIPLE_ROWS ? <DeleteAssetDialog id={SELECTED_ROWS_IDS || []} forMultiple /> : <></>}
      </div>

      <Table className='border rounded'>
        <TableCaption className='text-center'>A list of physical assets</TableCaption>
        <TableHeader className='bg-gray-100/50'>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className='relative'>
          <When truthy={isFetching}>
            <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
              <LoaderIcon className='animate-spin w-4 h-4' />
            </div>
          </When>

          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
