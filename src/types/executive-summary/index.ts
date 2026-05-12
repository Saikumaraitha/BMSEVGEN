export interface SummaryItem {
  id:      string
  title?:  string
  body:    string
  url?:    string
  isNew?:  boolean
}

export interface SummarySection {
  id:               string
  iconSrc:          string
  title:            string
  viewDetailsRoute: string
  items:            SummaryItem[]
}

export interface SparcRecommendation {
  id:   string
  text: string
}

export interface ExecutiveSummaryPageData {
  modality:             string
  sections:             SummarySection[]
  sparcRecommendations: SparcRecommendation[]
}
