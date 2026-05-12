import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout/AppLayout'
import HomeToolbar from '../../components/home/HomeToolbar'
import AssetGrid from '../../components/home/AssetGrid'
import AddAssetModal from '../../components/home/AddAssetModal'
import type { Asset, SortKey, TabKey } from '../../types/home'
import { getAssetsData } from '../../services/home'
import { buildPath, ROUTES } from '../../constants/routes'

function sortAssets(assets: Asset[], sortBy: SortKey): Asset[] {
  return [...assets].sort((a, b) => {
    switch (sortBy) {
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
  const [activeTab, setActiveTab] = useState<TabKey>('my')
  const [sortBy, setSortBy] = useState<SortKey>('name-asc')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    getAssetsData().then(({ assets }) => setAssets(assets))
  }, [])

  const filtered = sortAssets(
    assets
      .filter((a) =>
        activeTab === 'my' ? a.myAsset && !a.archived
        : activeTab === 'all' ? !a.archived
        : a.archived,
      )
      .filter((a) => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          a.name.toLowerCase().includes(q) ||
          a.mechanismOfAction.toLowerCase().includes(q)
        )
      }),
    sortBy,
  )

  const handleCardClick = (id: string) => {
    navigate(buildPath(ROUTES.ASSET.EXECUTIVE_SUMMARY.ROOT, { assetId: id }))
  }

  const handleAddAsset = (asset: Asset) => {
    setAssets((prev) => [asset, ...prev])
  }

  return (
    <AppLayout>
      
      <div className="px-4 sm:px-6 lg:px-10 py-6">
        <HomeToolbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sortBy={sortBy}
          onSortChange={setSortBy}
          search={search}
          onSearchChange={setSearch}
          onAddAsset={() => setShowModal(true)}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-10 py-6">
        <AssetGrid assets={filtered} onCardClick={handleCardClick} />
      </div>

      <AddAssetModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddAsset}
      />
    </AppLayout>
  )
}

export default Home
