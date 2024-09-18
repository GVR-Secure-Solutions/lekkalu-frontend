import React, { cloneElement, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PhysicalAsset } from '@/types/balance-sheet'

type Props = {
  trigger: React.ReactElement
  asset?: PhysicalAsset
}

export default function AddOrEditAssetDialog1({ trigger, asset }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isEdit = Boolean(asset)

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
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Asset</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
