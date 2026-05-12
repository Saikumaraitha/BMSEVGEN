import type { Priority, ConfidenceLevel, Citation, EvidenceGrade } from '../common'

export interface GapDetailStudy {
  id:            string
  name:          string
  design:        string
  phase:         string
  n?:            number
  status:        'Completed' | 'Ongoing' | 'Planned' | 'Discontinued'
  primaryEndpoint: string
  result?:       string
  grade:         EvidenceGrade
}

export interface GapDetailsData {
  gapId:        string
  title:        string
  category:     string
  priority:     Priority
  confidence:   ConfidenceLevel
  description:  string
  rationale:    string
  impactScore:  number
  feasibility:  'High' | 'Moderate' | 'Low'
  relatedStudies: GapDetailStudy[]
  recommendations: string[]
  citations:    Citation[]
}
