import { Scenario } from './scenarios'

export type Comparison = {
  id: number
  name: string
  access: 'Public' | 'Private'
  scenarios: Array<Scenario>
}
