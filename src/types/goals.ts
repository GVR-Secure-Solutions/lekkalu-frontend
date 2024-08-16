export type Goal = {
  id: number
  name: string
  target_value: number
  current_value: number
  reachable_by_days: number
  goal_proportionality: string
  track_kpi: string
  created_at: string
  updated_at: string
  target_contribution_source: number | null
  target_date: string
  met: boolean
  custom_kpi: number
}
export type CustomKPI = {
  id: number
  name: string
  description: string
  latex: string
}

export type Timeline = {
  kpi_value: number
  time: string
}

export type GoalProportionalityType = {
  id: number
  label: string
  value: string
}

export type KpiType = {
  id: number
  label: string
  value: string
}

export type GoalStatus = {
  total: number
  onTrack: number
  offTrack: number
  completed: number
}
