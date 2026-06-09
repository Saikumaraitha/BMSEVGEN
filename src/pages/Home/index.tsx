import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout/AppLayout'
import HomeToolbar from '../../components/home/HomeToolbar'
import AssetGroupList from '../../components/home/AssetGroupList'
import AddAssetModal from '../../components/home/AddAssetModal'
import type {
  Asset,
  AssetIep,
  AssetsMetadataResponse,
  CreateIepResponseData,
  GetIepsParams,
  Indication,
  SortKey,
  StatusFilter,
} from '../../types/home'
import { getIeps, getAssetsMetadata } from '../../services/home'
import { buildPath, ROUTES } from '../../constants/routes'

const STATUS_UI_TO_API: Record<Exclude<StatusFilter, 'all'>, string> = {
  'in-refresh':   'IN_REFRESH',
  'active-draft': 'ACTIVE_DRAFT',
  'new-insights': 'NEW_INSIGHTS',
}

const STATUS_API_TO_TAG: Record<string, string> = {
  'IN_REFRESH':   'In Refresh',
  'ACTIVE_DRAFT': 'Active Draft',
  'NEW_INSIGHTS': 'New Insights',
}

const SORT_TO_API: Record<SortKey, string> = {
  'therapeutic-area': 'therapeutic_area',
  'name-asc':         'asset_name',
  'name-desc':        'asset_name',
  'updated-asc':      'last_updated',
  'updated-desc':     'last_updated',
}

function mapIepsToAssets(data: AssetIep[]): Asset[] {
  return data.map((item) => {
    const therapeuticArea = item.integration_evidence_plan[0]?.therapeutic_area ?? ''
    const times = item.integration_evidence_plan.map((iep) => iep.last_updated_time).sort()
    const latestTime = times[times.length - 1] ?? ''

    const indications: Indication[] = item.integration_evidence_plan.map((iep) => ({
      id:          iep.iep_id,
      name:        iep.disease_area,
      tags:        [iep.therapeutic_area, STATUS_API_TO_TAG[iep.status]].filter(Boolean) as string[],
      lastUpdated: latestTime
        ? new Date(iep.last_updated_time).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
        : '',
    }))

    return {
      id:                item.asset_id,
      name:              item.asset_name,
      tags:              therapeuticArea ? [therapeuticArea] : [],
      mechanismOfAction: item.mechanism_of_action,
      lastUpdated:       latestTime
        ? new Date(latestTime).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
        : '',
      myAsset:   true,
      archived:  false,
      indications,
    }
  })
}

function sortAssets(assets: Asset[], sortBy: SortKey): Asset[] {
  const sorted = [...assets].sort((a, b) => {
    switch (sortBy) {
      case 'therapeutic-area':
        return (a.tags[0] ?? '').localeCompare(b.tags[0] ?? '')
      case 'name-asc':
      case 'name-desc':
        return a.name.localeCompare(b.name)
      case 'updated-asc':
      case 'updated-desc':
        return a.lastUpdated.localeCompare(b.lastUpdated)
    }
  })
  return sortBy === 'name-desc' || sortBy === 'updated-desc' ? sorted.reverse() : sorted
}

function Home() {
  const navigate = useNavigate()
  const [assets,       setAssets]       = useState<Asset[]>([])
  const [metadata,     setMetadata]     = useState<AssetsMetadataResponse | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy,       setSortBy]       = useState<SortKey>('name-asc')
  const [search,       setSearch]       = useState('')
  const [showModal,    setShowModal]    = useState(false)

  useEffect(() => {
    getAssetsMetadata().then(setMetadata)
  }, [])

  useEffect(() => {
    const params: GetIepsParams = {
      page:     1,
      pageSize: 10,
      sort_byy: SORT_TO_API[sortBy],
    }
    if (statusFilter !== 'all') params.status = STATUS_UI_TO_API[statusFilter]
    if (search.trim())          params.search = search.trim()

    getIeps(params).then(({ data }) => setAssets(mapIepsToAssets(data)))
  }, [search, statusFilter, sortBy])

  const sorted = sortAssets(assets, sortBy)

  const handleViewDetails = (assetId: string, indicationId: string) => {
    navigate(buildPath(ROUTES.ASSET.CHAT_AGENTS, { assetId, indicationId }))
  }

  const handleCreatePlan = (data: CreateIepResponseData) => {
    const indication: Indication = {
      id:          data.disease_area.id,
      name:        data.disease_area.name,
      tags:        [data.therapeutic_area.name, STATUS_API_TO_TAG[data.status]].filter(Boolean) as string[],
      lastUpdated: new Date(data.last_updated_time).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }),
    }
    setAssets((prev) =>
      prev.map((a) =>
        a.id === data.asset.id ? { ...a, indications: [...a.indications, indication] } : a,
      ),
    )
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6">
        <HomeToolbar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          search={search}
          onSearchChange={setSearch}
          onAddAsset={() => setShowModal(true)}
        />

        <AssetGroupList assets={sorted} onViewDetails={handleViewDetails} />
      </div>

      <AddAssetModal
        open={showModal}
        onClose={() => setShowModal(false)}
        metadata={metadata}
        onSuccess={handleCreatePlan}
      />
    </AppLayout>
  )
}

export default Home
