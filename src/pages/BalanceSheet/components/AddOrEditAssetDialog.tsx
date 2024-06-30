import React, { Dispatch, SetStateAction, cloneElement, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { addPhysicalAssetTypeSchema } from '@/schema/balance-sheet'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ASSET_CATEGORY_TYPE, getAppropriateAssetsTypeDialog } from '@/utils/balance-sheet'
import { AddPhysicalAssetTypeSchema, AssetsType, PhysicalAsset } from '@/types/balance-sheet'
import { Step, StepItem, Stepper, useStepper } from '@/components/ui/stepper'

type Props = {
  trigger: React.ReactElement
  asset?: PhysicalAsset
}

export default function AddOrEditAssetDialog({ trigger, asset }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isEdit = Boolean(asset)
  const [selectedType, setSelectedType] = useState<AssetsType>('cash')
  const navigate = useNavigate()

  const AppropriateAssetDialog = useMemo(() => {
    return getAppropriateAssetsTypeDialog(selectedType)
    // eslint-disable-next-line
  }, [selectedType])

  const stepsData = [{ label: 'Select Type' }, { label: 'Add Form' }] as StepItem[]

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(e) => {
        setIsDialogOpen(e)
        navigate('/balance-sheet')
      }}
    >
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
        <Stepper variant='circle-alt' initialStep={0} steps={stepsData}>
          {stepsData.map((stepProps, index) => {
            if (index === 0) {
              return (
                <Step key={stepProps.label} {...stepProps}>
                  <SelectTypeForm setSelectedType={setSelectedType} />
                </Step>
              )
            }
            return (
              <Step key={stepProps.label} {...stepProps}>
                <AppropriateAssetDialog
                  isSteeper
                  closeModal={() => {
                    setIsDialogOpen(false)
                    navigate('/balance-sheet')
                  }}
                />
              </Step>
            )
          })}
        </Stepper>
      </DialogContent>
    </Dialog>
  )
}
function SelectTypeForm({ setSelectedType }: { setSelectedType: Dispatch<SetStateAction<AssetsType>> }) {
  const { nextStep, prevStep, resetSteps, isDisabledStep, hasCompletedAllSteps, isLastStep, isOptionalStep } =
    useStepper()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const form = useForm<AddPhysicalAssetTypeSchema>({
    resolver: zodResolver(addPhysicalAssetTypeSchema),
    defaultValues: {
      type: 'cash',
    },
  })

  const assetsInputOptions: InputField[] = useMemo(
    () => [
      {
        id: 'type',
        label: 'Please select assets category',
        type: 'select',
        options: ASSET_CATEGORY_TYPE,
      },
    ],
    [],
  )
  function onSubmit(data: AddPhysicalAssetTypeSchema) {
    setSelectedType(data.type)
    nextStep()
    navigate(`?for=${data.type}`)
  }

  useEffect(() => {
    if (searchParams.get('for')) {
      form.reset({ type: searchParams.get('for') as AssetsType })
    }
  }, [searchParams, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='md:col-span-2 space-y-2'>
          <div className='flex flex-col my-5 gap-2 w-full'>
            <InputFieldsRenderer control={form.control} inputs={assetsInputOptions} />
          </div>
        </div>
        <div className='w-full flex justify-end gap-2'>
          {hasCompletedAllSteps ? (
            <Button size='sm' onClick={resetSteps}>
              Reset
            </Button>
          ) : (
            <>
              <Button disabled={isDisabledStep} onClick={prevStep} size='sm' variant='secondary'>
                Prev
              </Button>
              <Button size='sm'>{isLastStep ? 'Finish' : isOptionalStep ? 'Skip' : 'Next'}</Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
