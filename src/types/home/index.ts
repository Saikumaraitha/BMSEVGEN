export interface Indication {
  id:          string
  name:        string
  tags:        string[]
  lastUpdated: string
}

export interface Asset {
  id:                string
  name:              string
  tags:              string[]
  mechanismOfAction: string
  lastUpdated:       string
  myAsset:           boolean
  archived:          boolean
  indications:       Indication[]
}

export interface HomeData {
  assets: Asset[]
}

export type StatusFilter = 'all' | 'in-refresh' | 'active-draft' | 'new-insights'
export type SortKey = 'therapeutic-area' | 'name-asc' | 'name-desc' | 'updated-asc' | 'updated-desc'
