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

// API types for get_assets_metadata
export interface AssetMetadata {
  id:        string
  name:      string
  createdAt: string
  moaId:     string
}

export interface MechanismOfAction {
  id:   string
  name: string
}

export interface DiseaseArea {
  id:                   string
  name:                 string
  theurapetic_area_id:  string
}

export interface TherapeuticArea {
  id:   string
  name: string
}

export interface AssetsMetadataResponse {
  assets:               AssetMetadata[]
  mechanisms_of_action: MechanismOfAction[]
  disease_areas:        DiseaseArea[]
  therapeutic_areas:    TherapeuticArea[]
}

// API types for get_ieps
export interface GetIepsParams {
  page?:     number
  pageSize?: number
  status?:   string
  search?:   string
  sort_byy?: string
}

export interface IepPlan {
  iep_id:            string
  disease_area:      string
  therapeutic_area:  string
  status:            string
  last_updated_time: string
}

export interface AssetIep {
  asset_id:                  string
  asset_name:                string
  mechanism_of_action:       string
  integration_evidence_plan: IepPlan[]
}

export interface GetIepsResponse {
  success: boolean
  message: string
  data:    AssetIep[]
}

// API types for create_iep
export interface CreateIepRequest {
  asset_id:       string
  disease_area_id: string
}

interface IepRef {
  id:   string
  name: string
}

export interface CreateIepResponseData {
  iep_id:             string
  asset:              IepRef
  disease_area:       IepRef
  therapeutic_area:   IepRef
  mechanism_of_action: IepRef
  status:             string
  created_at:         string
  last_updated_time:  string
}

export interface CreateIepResponse {
  success: boolean
  message: string
  data:    CreateIepResponseData
}
