import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout/AppLayout'
import HomeToolbar from '../../components/home/HomeToolbar'
import AssetGroupList from '../../components/home/AssetGroupList'
import AddAssetModal from '../../components/home/AddAssetModal'
import type { Asset, Indication, SortKey, StatusFilter } from '../../types/home'
import { getAssetsData } from '../../services/home'
import { buildPath, ROUTES } from '../../constants/routes'

const STATUS_TAG_MAP: Record<Exclude<StatusFilter, 'all'>, string> = {
  'in-refresh':   'In Refresh',
  'active-draft': 'Active Draft',
  'new-insights': 'New Insights',
}

function sortAssets(assets: Asset[], sortBy: SortKey): Asset[] {
  return [...assets].sort((a, b) => {
    switch (sortBy) {
      case 'therapeutic-area':
        return a.tags[0]?.localeCompare(b.tags[0] ?? '') ?? 0
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'updated-asc':
        return a.lastUpdated.localeCompare(b.lastUpdated)
      case 'updated-desc':
        return b.lastUpdated.localeCompare(a.lastUpdated)
    }
  })
}

function Home() {
  const navigate = useNavigate()
  const [assets, setAssets] = useState<Asset[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortBy, setSortBy] = useState<SortKey>('therapeutic-area')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    getAssetsData().then(({ assets }) => setAssets(assets))
  }, [])

  const filtered = sortAssets(
    assets
      .filter((a) => !a.archived)
      .filter((a) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          a.name.toLowerCase().includes(q) ||
          a.mechanismOfAction.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
      .map((a) => {
        if (statusFilter === 'all') return a
        const requiredTag = STATUS_TAG_MAP[statusFilter]
        return {
          ...a,
          indications: a.indications.filter((ind) => ind.tags.includes(requiredTag)),
        }
      }),
    sortBy,
  )

  const handleViewDetails = (assetId: string, indicationId: string) => {
    navigate(buildPath(ROUTES.ASSET.CHAT_AGENTS, { assetId, indicationId }))
  }

  const handleCreatePlan = (assetId: string, indication: Indication) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId ? { ...a, indications: [...a.indications, indication] } : a,
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

        <AssetGroupList assets={filtered} onViewDetails={handleViewDetails} />
      </div>

      <AddAssetModal
        open={showModal}
        onClose={() => setShowModal(false)}
        assets={assets}
        onSubmit={handleCreatePlan}
      />
    </AppLayout>
  )
}

export default Home
