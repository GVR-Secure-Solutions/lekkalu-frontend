import React from 'react'
import {
  BadgeHelp,
  Calculator,
  CalculatorIcon,
  CandlestickChart,
  CircleDollarSign,
  CoinsIcon,
  DollarSignIcon,
  FileSpreadsheet,
  Goal,
  LayoutDashboardIcon,
  Settings2Icon,
  SheetIcon,
  TargetIcon,
  Wallet,
  Scale,
  BookCopy,
  BarChart2,
} from 'lucide-react'

type SubRoute = {
  path: string
  label: string
}

type Route = {
  path: string
  label: string
  icon: React.ReactElement<{ className?: string }>
  subMenu?: Array<SubRoute>
}

export const ROUTES: Array<Route> = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboardIcon />,
  },
  {
    path: '/goals',
    label: 'Goals',
    icon: <TargetIcon />,
  },
  {
    path: '/income-statement',
    label: 'Income Statement',
    icon: <DollarSignIcon />,
  },
  {
    path: '/expenses',
    label: 'Expenses',
    icon: <CoinsIcon />,
  },
  {
    path: '/lending',
    label: 'Lending',
    icon: <Wallet />,
  },
  {
    path: '/balance-sheet',
    label: 'Balance Sheet',
    icon: <SheetIcon />,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: <Settings2Icon />,
  },
  {
    path: '/scenarios',
    label: 'Scenarios',
    icon: <BookCopy />,
    subMenu: [],
  },
  {
    path: '/comparisons',
    label: 'Comparisons',
    icon: <Scale />,
    subMenu: [],
  },
]
export const UN_AUTHENTICATED_ROUTES: Array<Route> = [
  {
    path: '/pricing',
    label: 'Pricing',
    icon: <DollarSignIcon />,
  },
  {
    path: '/support',
    label: 'Support',
    icon: <BadgeHelp />,
  },
]

export const CALCULATOR_ROUTES: Array<Route> = [
  {
    path: '/sip-calculator',
    label: 'SIP Calculator',
    icon: <CalculatorIcon />,
  },
  {
    path: '/cagr-calculator',
    label: 'CAGR Calculator',
    icon: <CalculatorIcon />,
  },
  {
    path: '/emi-calculator',
    label: 'EMI Calculator',
    icon: <CalculatorIcon />,
  },
  {
    path: '/xirr-calculator',
    label: 'XIRR Calculator',
    icon: <CalculatorIcon />,
  },
]
export const FEATURES_ROUTES: { title: string; href: string; description: string; icon: React.ReactNode }[] = [
  {
    title: 'Expense & Budget',
    href: '/feature/expense-budget',
    description: 'Effortlessly manage expenses and budget, track spending, and achieve financial stability.',
    icon: <CircleDollarSign size={30} />,
  },
  {
    title: 'Financial Goal',
    href: '/feature/financial-goal',
    description: 'Set and track financial goals with precision for a successful financial journey.',
    icon: <Goal size={30} />,
  },
  {
    title: 'Income & Expense',
    href: '/feature/income-expense',
    description: 'Gain insights into income and expenses for informed financial decision-making.',
    icon: <CandlestickChart size={30} />,
  },
  {
    title: 'Balance Sheet',
    href: '/feature/balance-sheet',
    description: 'Access a clear balance sheet to understand and improve your financial position.',
    icon: <FileSpreadsheet size={30} />,
  },
  {
    title: 'Calculators',
    href: '/feature/calculators',
    description: 'Empower yourself with financial calculators for smart planning and decision-making.',
    icon: <Calculator size={30} />,
  },
  {
    title: 'Scenario',
    href: '/feature/scenario',
    description:
      'Collections of assets, liabilities, and expenses that represent potential financial situations, which users can simulate',
    icon: <BarChart2 size={30} />,
  },
]
