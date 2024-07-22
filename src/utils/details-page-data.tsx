import React from 'react'
import {
  ArrowDownAZ,
  BookAudio,
  FileEdit,
  FileLock,
  LayoutList,
  PieChart,
  History,
  FolderKanban,
  Receipt,
  ListTodo,
} from 'lucide-react'
import addExpense from '@/assets/features/add-expense.json'
import editDeleteBudget from '@/assets/features/edit-delete-budget.json'
import budgetLimit from '@/assets/features/budget-limit.json'
import listingExpense from '@/assets/features/listing-expense.json'
import rangeFilter from '@/assets/features/date-range-filter.json'

// Expense & Budget Page
export const EXPENSE_BUDGET_FEATURES: {
  title: string
  description: string
  icon: React.ReactNode
  animation: any
  subTitle: string
}[] = [
    {
      icon: <BookAudio size={50} />,
      title: 'Add Expense',
      description:
        'Easily record your expenses with essential details such as amount, tags, date, and even attach relevant images for documentation.',
      animation: addExpense,
      subTitle: 'Expense Tracker',
    },
    {
      icon: <FileEdit size={50} />,
      title: 'Edit and Delete Budget',
      description:
        'Take control of your financial plan by editing or deleting budget entries as your financial goals and circumstances evolve.',
      animation: editDeleteBudget,
      subTitle: 'Financial Control',
    },
    {
      icon: <FileLock size={50} />,
      title: 'Set Monthly Budget Limit',
      description:
        'Establish a realistic monthly budget limit to align your spending with your financial objectives. The tool allows you to set and adjust limits based on your income and financial priorities.',
      animation: budgetLimit,
      subTitle: 'Budget Planning',
    },
    {
      icon: <LayoutList size={50} />,
      title: 'Expense List',
      description:
        'Access a detailed list of your expenses, complete with pagination for convenient browsing. The tool provides a user-friendly interface for effortless navigation through your financial transactions.',
      animation: listingExpense,
      subTitle: 'Transaction Overview',
    },
    {
      icon: <ArrowDownAZ size={50} />,
      title: 'Date Range Filter',
      description:
        'Gain deeper insights into your spending patterns by filtering expenses based on specific date ranges. This feature enables you to analyze and understand your financial behavior over different periods.',
      animation: rangeFilter,
      subTitle: 'Data Analysis',
    },
  ]

// Income & Expense Page
export const INCOME_EXPENSE_FEATURES: {
  title: string
  description: string
  thumbnail: string
}[] = [
    {
      thumbnail:
        'https://resources.tallysolutions.com/us/wp-content/uploads/2021/11/cogs-vs-expenses-whats-the-difference.jpg',
      title: 'Expense & Budget Management',
      description:
        'Effortlessly manage expenses and budgets, track spending, and achieve financial stability. Our user-friendly tools put you in control of your financial journey.',
    },
    {
      thumbnail: 'https://www.fisdom.com/wp-content/uploads/2022/01/shutterstock_1369175123-_11zon.webp',
      title: 'Financial Goal Setting',
      description:
        'Set and track personalized financial goals with precision. Our goal-setting tools empower you to plan, achieve, and celebrate your financial milestones.',
    },
    {
      thumbnail: 'https://www.livetecs.com/wp-content/uploads/2019/05/Time-Expense-Tracking-.png',
      title: 'Income & Expense Tracking',
      description:
        'Gain insights into your income and expenses for informed decision-making. Track your financial flow effortlessly with our intuitive tools.',
    },
    {
      thumbnail:
        'https://akm-img-a-in.tosshub.com/sites/btmt/images/stories//2015October/financial-calculations-38-1_110415044409.jpg',
      title: 'Holistic Financial Calculators',
      description:
        'Empower yourself with a suite of financial calculators for smart planning and decision-making. From loan calculations to investment planning, we&apos;ve got you covered.',
    },
  ]

// Balance Sheet Page
export const BALANCE_SHEET_FEATURES: {
  title: string
  description: string
  icon: React.ReactNode
}[] = [
    {
      icon: <PieChart size={50} color='#0f4b8f' />,
      title: 'Visualize with Precision',
      description:
        'Effortlessly interpret your financial position with pie charts representing the usage of assets and liabilities. Gain insights at a glance.',
    },
    {
      icon: <History size={50} color='#0f4b8f' />,
      title: 'Track Your Expenses',
      description:
        'Stay informed about your balance expenses through detailed bar charts. Understand where your resources are allocated and make informed decisions.',
    },
    {
      icon: <FolderKanban size={50} color='#0f4b8f' />,
      title: 'Manage Your Assets',
      description:
        'Take control of your assets with the ability to add, edit, and delete. Track essential details such as Current Value, Purchase Value, and Sell Value.',
    },
    {
      icon: <LayoutList size={50} color='#0f4b8f' />,
      title: 'Detailed Asset Listings',
      description:
        'Access a comprehensive list of your assets, including essential information such as Name, Current Value, Purchase Value, and Sell Value.',
    },
    {
      icon: <Receipt size={50} color='#0f4b8f' />,
      title: 'Handle Liabilities with Ease',
      description:
        'Effortlessly manage your liabilities by adding, editing, and deleting. Keep track of details like Market Value, Principal, Interest, Tenure, Closure, and Disbursement.',
    },
    {
      icon: <ListTodo size={50} color='#0f4b8f' />,
      title: 'Detailed Liability Listings',
      description:
        'Get a clear overview of your liabilities with a detailed list including Name, Market Value, Principal, Interest, Tenure, Closure, and Disbursement.',
    },
  ]

// Calculator details Page
export const CALCULATORS_FEATURES: {
  title: string
  description: string
  sub_title: string
  href: string
  thumbnail: string
}[] = [
    {
      title: 'Plan, Invest, Grow - SIP Calculator for Smart Investing',
      sub_title: 'SIP Calculator',
      description:
        'Estimate your potential returns with a Systematic Investment Plan. Understand the power of regular investments with our SIP Calculator. Input your Monthly Investment Amount, Duration of the Investment, and Expected Annual Return (%) to visualize your future wealth.',
      href: '/sip-calculator',
      thumbnail: 'https://www.finology.in/Calculators/images/CalculatorImage/time-during-calculator.png',
    },
    {
      title: 'Calculate your Compound Annual Growth Rate with precision.',
      sub_title: 'CAGR Calculator',
      description:
        'Assess Your Investment Growth - CAGR Calculator for Informed Decision-Making. Learn how to compute your Compound Annual Growth Rate using the formula: Absolute CAGR = (Final Value / Initial Value)^(1 / Duration) - 1.',
      href: '/cagr-calculator',
      thumbnail: 'https://niceillustrations.com/wp-content/uploads/2023/02/cartoon-calculator.png',
    },
    {
      title: 'Plan your loan repayments with ease using our EMI Calculator.',
      sub_title: 'EMI Calculator',
      description:
        'Manage Your Finances Effectively - EMI Calculator for Smart Borrowing. Understand the EMI formula and how it helps you determine the monthly repayment amount based on principal, interest rate, and loan tenure.',
      href: '/emi-calculator',
      thumbnail: 'https://www.fincover.com/wp-content/uploads/2020/11/emi.png',
    },
    {
      title: 'Maximize Your Investment Returns with Our XIRR Calculator',
      sub_title: 'XIRR Calculator',
      description:
        'Calculate the internal rate of return for periodic cash flows accurately. Use our XIRR Calculator to optimize your investment strategy and make informed financial decisions.',
      href: '/xirr-calculator',
      thumbnail: 'https://cdnlearnblog.etmoney.com/wp-content/uploads/2022/09/XIRR-in-mutual-funds-featured.png', // change this url
    },
  ]
