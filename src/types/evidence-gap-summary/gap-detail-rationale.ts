export interface GapDetailRationaleItem {
  title?:      string
  text:        string
  studyLinks?: string[]
}

export interface GapDetailRationaleTab {
  id:    string
  label: string
  items: GapDetailRationaleItem[]
}

export interface GapDetailRationaleData {
  gapId:        string
  gapStatement: string
  tabs:         GapDetailRationaleTab[]
}
