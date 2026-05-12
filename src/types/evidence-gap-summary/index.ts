import type { GapDetailRationaleData } from './gap-detail-rationale'
export type { GapDetailRationaleData }

export interface StrategicImperative {
  id:    string
  label: string
  title: string
}

export interface EGO {
  id:          string
  label:       string
  title:       string
  bullets:     string[]
  highlighted?: boolean
}

export interface KeyDataMapCard {
  id:           string
  indication:   string
  type:         'Existing Gap' | 'AI-Driven'
  gap:          string
  rationale:    string
  priority:     string
  tags:         string[]
  linkedEgoIds:      string[]
  detailedRationale?: GapDetailRationaleData
}

export interface EvidenceGapSummaryData {
  strategicImperatives: StrategicImperative[]
  egos:                 EGO[]
  keyDataMaps:          KeyDataMapCard[]
}
