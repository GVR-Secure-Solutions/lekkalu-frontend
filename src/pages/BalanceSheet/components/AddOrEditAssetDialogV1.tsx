import React, { cloneElement, useEffect, useState } from 'react'
import { IndianRupee, Percent } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldError, SubmitHandler, useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog-v1'
import DatePickerV1 from '@/components/DatePicker/DatePickerV1'
import GenericFormField from '@/components/ui/form-v1'

type Props = {
  trigger: React.ReactElement
}
// Field Container component that takes children fields and renders them in a row
const FieldContainer = ({ children }: { children: React.ReactNode }) => (
  <div className='w-full p-[5px] bg-[#154181]/20 rounded-[5px] justify-between items-center inline-flex'>
    <div className='w-full flex-col justify-start items-start  inline-flex'>{children}</div>
  </div>
)
type FieldProps = {
  label: string
  children: React.ReactNode
  error?: FieldError
  field_name?: string
}
// Field component that takes the field body as child, text as label to render a field
const Field: React.FC<FieldProps> = ({ label, children, error }) => (
  <>
    <div className='flex justify-between w-full gap-10'>
      <div className='self-stretch text-black/50 text-base leading-snug whitespace-nowrap flex items-center justify-center'>
        <p className='font-normal font-["Charter"]'>{label}</p>
      </div>
      <div className='justify-start items-center gap-[5px] inline-flex'>{children}</div>
    </div>
    {error && <p className='text-destructive text-md text-right'>{error.message}</p>}
  </>
)
const SaveButton = () => (
  <div className='w-[59px] h-[21px] px-[5px] bg-[#154181] rounded-[5px] justify-center items-center gap-2.5 flex'>
    <button type='submit' className="text-white text-[13px] font-normal font-['Charter']">
      Save
    </button>
  </div>
)

interface CancelButtonProps {
  clickHandler: () => void
}

const CancelButton: React.FC<CancelButtonProps> = ({ clickHandler }) => (
  <div className='w-[59px] h-[21px] px-[5px] bg-[#154181]/20 rounded-[5px] justify-center items-center gap-2.5 flex'>
    <button className="text-black text-[13px] font-normal font-['Charter']" onClick={clickHandler}>
      Cancel
    </button>
  </div>
)

export default function AddOrEditAssetDialogV1({ trigger }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [theme] = useState('light')

  // Define the Zod schema for form validation
  const formSchema = z.object({
    asset_name: z.string(),
    buy_price: z.string().transform((value) => parseFloat(value)),
    expected_returns: z.string().transform((value) => parseFloat(value)),
  })
  // Infer the TypeScript types from the Zod schema
  type FormData = z.infer<typeof formSchema>
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  // This function will be executed when the form is successfully submitted
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data)
  }
  const onCancel = () => {
    clearErrors()
  }
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }, [theme])
  useEffect(() => {
    clearErrors()
  }, [isDialogOpen])

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='h-auto p-[25px] bg-accent rounded-[10px] shadow justify-start items-start gap-[31px] inline-flex'>
            <div className='flex-col justify-center items-start gap-2.5 inline-flex'>
              <div className="text-right text-black text-2xl font-bold font-['Charter'] leading-[33.60px]">About</div>
              <div className="w-[270px] h-[150px] text-black text-[15px] font-normal font-['Charter'] leading-[21px]">
                Add any Real Estate properties that you own. Flat in an apartment, Commercial shop. And specify expected
                returns to gauge your total financial performance over past and future
              </div>
            </div>
            <div className='flex-col justify-start items-start gap-[31px] inline-flex'>
              <div className='px-2.5 py-[5px] bg-[#c6ddff] rounded-[5px] justify-center items-center gap-2.5 inline-flex'>
                <div className='w-[15px] h-[15px] relative' />
                <div className="text-black text-base font-normal font-['Charter'] leading-snug">Real Estate</div>
                <div className='w-[15px] h-[15px] p-[1.25px] justify-center items-center flex'>
                  <div className='w-[12.50px] h-[12.50px] relative' />
                </div>
              </div>
              <input
                type='text'
                placeholder='Asset Name'
                className="w-full bg-inherit self-stretch text-black/25 text-4xl font-normal font-['Charter'] leading-9
              focus:outline-none"
              />
              {/*Container of Essential Fields*/}
              <FieldContainer>
                {/*Bought Date Field*/}
                <Field label='Bought on'>
                  <div className='justify-start items-center gap-[5px]  inline-flex'>
                    <div className="text-black text-base font-normal font-['Charter'] leading-snug whitespace-nowrap ">
                      Sun, 14 Jul
                    </div>
                    <DatePickerV1 className='mr-2 h-4 w-4' />
                  </div>
                </Field>
                {/*Bought Price Field*/}
                <Field label='At Price' error={errors.buy_price} field_name='buy_price'>
                  <div className='justify-start items-center gap-[5px] inline-flex'>
                    <GenericFormField
                      type={'number'}
                      placeholder='40,00,000'
                      register={register}
                      name='buy_price'
                      className="bg-inherit text-black font-normal font-['Charter'] leading-snug focus:outline-none
                      text-right min-w-10 max-w-20"
                    />
                    <IndianRupee className='mr-2 h-4 w-4' />
                    {/*Error Message*/}
                  </div>
                </Field>
              </FieldContainer>
              <FieldContainer>
                <Field label='Expected Returns' error={errors.expected_returns} field_name={'expected_returns'}>
                  <div className='justify-start items-center gap-[5px] inline-flex'>
                    <GenericFormField
                      type={'number'}
                      name='expected_returns'
                      register={register}
                      placeholder='4'
                      className="bg-inherit text-black font-normal font-[' Charter'] leading-snug focus:outline-none
                      text-right
                      min-w-10 max-w-20"
                    />
                    <Percent className='mr-2 h-4 w-4' />
                  </div>
                </Field>
              </FieldContainer>
              <div className='self-stretch justify-between items-start inline-flex'>
                <CancelButton clickHandler={onCancel} />
                <SaveButton />
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// todo: this dialog on mobile devices
