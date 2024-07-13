import dayjs from 'dayjs'
import { Expense, InputValueArray, OutputValueArray } from '@/types/expense'
import { Tag } from '@/types/tag'
import { createTag } from '@/queries/tag'

export function checkIsExpenseExists(allExpenses: Expense[], newExpense: Pick<Expense, 'amount' | 'tags' | 'time'>) {
  let isExists = false
  // If the amount of the new expense does not contain a decimals, this conditional adds .00 for compare it with others
  !(Number(newExpense.amount) % 1 !== 0) && (newExpense.amount = `${newExpense.amount}.00`)

  allExpenses.forEach((expense) => {
    if (expense.amount === newExpense.amount) {
      const existingTags = expense.tags.sort()
      const newTags = newExpense.tags.sort()
      const sameTags = existingTags.map((data, index) => {
        if (data === newTags[index]) return true
        return false
      })

      if (!sameTags.includes(false) && dayjs(expense.time).isSame(dayjs(newExpense.time))) {
        isExists = true
      }
    }
  })

  return isExists
}

export const getCumSumData = (data: any) => {
  data.sort((a: any, b: any) => {
    if (a.year !== b.year) {
      return b.year - a.year
    } else {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      return months.indexOf(b.month) - months.indexOf(a.month)
    }
  })

  const last12MonthsData = data.slice(0, 12)
  return last12MonthsData
}

export const EXPENSE_FILE_VALID_COLUMNS = ['amount', 'tags', 'date']
export function validateFileColumns(columns: string[]) {
  return columns.every((column) => EXPENSE_FILE_VALID_COLUMNS.includes(column.toLowerCase().trim()))
}

export async function getOrCreateTag(newTags: string[], existingTags: Tag[]) {
  const newTagsCopy = Array.from(existingTags)
  const existingOrCreatedTagIds: number[] = []

  for (const tag of newTags) {
    const tagName = tag.replace(tag[0], tag[0].toUpperCase()).trim()
    const existingTag = newTagsCopy.find((tag) => tag.name === tagName)

    if (existingTag) {
      existingOrCreatedTagIds.push(existingTag.id)
    } else {
      try {
        const { data } = await createTag({ name: tagName })
        existingOrCreatedTagIds.push(data.id)
        newTagsCopy.push(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    }
  }

  return existingOrCreatedTagIds
}

export const getIdAndUniqueIdArray = (input: InputValueArray[]): OutputValueArray => {
  const idArr: number[] = []
  const newIdArr: string[] = []

  input.forEach((item) => {
    if (item.id !== undefined) {
      idArr.push(item.id)
    } else {
      newIdArr.push(item.value)
    }
  })

  return {
    idArr,
    newIdArr,
  }
}
