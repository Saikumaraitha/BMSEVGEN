import type { Priority, ConfidenceLevel } from '../common'

export interface GapDetailsBasicData {
  gapId:       string
  title:       string
  category:    string
  priority:    Priority
  confidence:  ConfidenceLevel
  description: string
  impactScore: number
  feasibility: 'High' | 'Moderate' | 'Low'
  tags:        string[]
  note:        string
}
