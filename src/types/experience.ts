export type Experience = {
  id: number
  orgName: string
  role: string
  startDate: string   // ISO date
  endDate: string | null
  summary: string | null
  bullets: string[]
}

