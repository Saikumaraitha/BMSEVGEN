export interface Asset {
  id:                string
  name:              string
  tags:              string[]
  mechanismOfAction: string
  lastUpdated:       string
  myAsset:           boolean
  archived:          boolean
}

export interface HomeData {
  assets: Asset[]
}

export type TabKey = 'my' | 'all' | 'archived'
export type SortKey = 'name-asc' | 'name-desc' | 'updated-asc' | 'updated-desc'
