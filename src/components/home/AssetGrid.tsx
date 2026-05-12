import AssetCard from './AssetCard'
import EmptyStateIcon from '../../assets/icons/empty-state.svg?react'
import type { Asset } from '../../types/home'

interface AssetGridProps {
  assets: Asset[]
  onCardClick: (id: string) => void
}

function AssetGrid({ assets, onCardClick }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <EmptyStateIcon className="w-12 h-12 mb-4 text-neutral-200" aria-hidden="true" />
        <p className="text-sm">No assets found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onClick={() => onCardClick(asset.id)}
        />
      ))}
    </div>
  )
}

export default AssetGrid
