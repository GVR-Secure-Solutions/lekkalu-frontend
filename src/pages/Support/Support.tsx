import * as React from 'react'
import { AccordionItem } from '@radix-ui/react-accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionTrigger } from '@/components/ui/accordion'
import Page from '@/components/Page/Page'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FAQs = {
  question: string
  id: number
  answer: string
}

const faqs: FAQs[] = [
  {
    id: 1,
    question: 'How many programmers does it take to screw in a lightbulb?',
    answer: "None. We don't address hardware issues.",
  },
  {
    id: 2,
    question: 'Who is the most awesome person?',
    answer: 'You. The Viewer.',
  },
  {
    id: 3,
    question: 'How many questions does it take to make a successful FAQ Page?',
    answer: 'This many.',
  },
  {
    id: 4,
    question: 'How many questions does it take to make a successful FAQ Page?',
    answer: 'This many.',
  },
  {
    id: 5,
    question: 'How many questions does it take to make a successful FAQ Page?',
    answer: 'This many.',
  },
  {
    id: 6,
    question: 'How many questions FAQ Page?',
    answer: 'This many.',
  },
  {
    id: 7,
    question: 'How many questions does it take to make a successful FAQ Page?',
    answer: 'This many.',
  },
]

export default function Support() {
  return (
    <Page className='flex scroll-mt-24 flex-col items-center justify-center gap-4 space-y-8'>
      <div className='grid grid-cols-1 w-full gap-4 py-6'>
        <Card className='group/item flex flex-col items-center gap-4 rounded-md border border-default bg-slate-100 p-6'>
          <CardContent className='space-y-8'>
            <p className='max-w-xl text-center text-3xl font-medium'>We are here to help!</p>
            <div className='flex items-center space-x-2 w-full'>
              <Input
                type='text'
                className='px-3 py-2 w-42 sm:w-60 md:w-80'
                placeholder='Search for questions or topics...'
              />
              <Button className='px-3 py-2'>Search</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col items-center gap-4'>
        <h2 className='gradient-text text-center font-bold tracking-tight text-6xl'>Support</h2>
      </div>
      <p className='max-w-xl text-center font-extrabold text-2xl'>
        Finuncle gives you the tools to build an <span className='text-primary'>financial knowledge base</span>. It
        allows user to <span className='text-primary'>quickly manage finance</span> and manage all the budget with
        goals.
      </p>
      <div className='grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardContent className='group/item flex flex-col items-center gap-4 rounded-md border border-default bg-slate-100 p-6 hover:border-primary'>
            <div className='h-16 w-16 rounded-full border-2 border-current p-3 group-hover/item:border-primary group-hover/item:text-primary'>
              <svg viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z'
                />
              </svg>
            </div>
            <p className='text-center font-extrabold text-xl group-hover/item:text-primary'>Questions / Answers</p>
            <p className='text-center text-offset text-sm'>
              Finuncle gives all queries and questions related to user experience.
            </p>
          </CardContent>
        </Card>
        <Card className='group/item flex flex-col items-center gap-4 rounded-md border border-default bg-slate-100 p-6 hover:border-primary'>
          <div className='h-16 w-16 rounded-full border-2 border-current p-3 group-hover/item:border-primary group-hover/item:text-primary'>
            <svg viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M22 2s-7.64-.37-13.66 7.88C3.72 16.21 2 22 2 22l1.94-1c1.44-2.5 2.19-3.53 3.6-5 2.53.74 5.17.65 7.46-2-2-.56-3.6-.43-5.96-.19C11.69 12 13.5 11.6 16 12l1-2c-1.8-.34-3-.37-4.78.04C14.19 8.65 15.56 7.87 18 8l1.21-1.93c-1.56-.11-2.5.06-4.29.5 1.61-1.46 3.08-2.12 5.22-2.25 0 0 1.05-1.89 1.86-2.32z'
              />
            </svg>
          </div>
          <p className='text-center font-extrabold text-xl group-hover/item:text-primary'>User guid</p>
          <p className='text-center text-offset text-sm'>
            Follow the steps and guide to getting start with the finuncle.
          </p>
        </Card>
        <Card className='group/item flex flex-col items-center gap-4 rounded-md border border-default bg-slate-100 p-6 hover:border-primary'>
          <div className='h-16 w-16 rounded-full border-2 border-current p-3 group-hover/item:border-primary group-hover/item:text-primary'>
            <svg viewBox='0 0 512 512'>
              <path
                fill='currentColor'
                d='M430.1 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 12-36.6.1-47.7zM120 216c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm40 126c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm64-161c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm72 219c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm24-208c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z'
              />
            </svg>
          </div>
          <p className='text-center font-extrabold text-xl group-hover/item:text-primary'>Billing / Payments</p>
          <p className='text-center text-offset text-sm'>Check all the details of the billing and payments.</p>
        </Card>
      </div>

      {/* Accordion  */}
      <div className='flex flex-col items-center gap-4'>
        <h2 className='gradient-text text-center font-extrabold tracking-tight text-6xl'>FAQ</h2>
      </div>
      <p className='max-w-xl text-center font-extrabold text-2xl'>Find answers to your questions</p>
      <Accordion type='single' collapsible className='md:w-4/6 xs:w-4/5'>
        {faqs.map((faq) => {
          return (
            <AccordionItem value={`item-${faq.id}`} className='border' key={faq.id}>
              <AccordionTrigger className='bg-slate-100 px-3'>{faq.question}</AccordionTrigger>
              <AccordionContent className='px-6 mt-5'>{faq.answer}</AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </Page>
  )
}
