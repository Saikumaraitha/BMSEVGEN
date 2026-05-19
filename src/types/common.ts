export type ConfidenceLevel = 'High' | 'Moderate' | 'Low'
export type EvidenceGrade  = 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D'
export type TrendDirection = 'Increasing' | 'Decreasing' | 'Stable'
export type Priority       = 'Critical' | 'High' | 'Moderate' | 'Low'

export interface Citation {
  id:     string
  title:  string
  source: string
  year:   number
  url?:   string
}

export interface KeyMetric {
  label: string
  value: string
  unit?: string
  trend?: TrendDirection
}

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface TableColumn {
  key:   string
  label: string
  width?: string
}
