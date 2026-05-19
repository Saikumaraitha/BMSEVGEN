import type { Asset } from '../../types/home'
import ClockIcon from '../../assets/icons/clock.svg?react'

// Soft colour pairs that cycle across tags
const TAG_COLOURS = [
  'bg-asset-tag-1-bg text-asset-tag-1-text',
  'bg-asset-tag-2-bg text-asset-tag-2-text',
  'bg-asset-tag-3-bg text-asset-tag-3-text',
  'bg-asset-tag-4-bg text-asset-tag-4-text',
  'bg-asset-tag-5-bg text-asset-tag-5-text',
]

interface AssetCardProps {
  asset: Asset
  onClick: () => void
}

function AssetCard({ asset, onClick }: AssetCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="rounded-xl border border-brand-primary/20 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white"
    >
      {/* Card header */}
      <div className="flex items-center gap-3 bg-brand-primary-dark px-4 py-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 flex-shrink-0">
          <ClockIcon className="w-4 h-4 text-white" aria-hidden="true" />
        </span>
        <span className="font-heading font-bold text-white text-base truncate">{asset.name}</span>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3">
        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {asset.tags.map((tag, i) => (
              <span
                key={tag}
                className={`px-3 py-0.5 rounded-full text-xs font-medium ${TAG_COLOURS[i % TAG_COLOURS.length]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Mechanism of Action */}
        <div className="bg-neutral-100 rounded-lg p-3">
          <p className="text-xs text-neutral-500 mb-1">Mechanism of Action</p>
          <p className="text-sm text-neutral-900">{asset.mechanismOfAction}</p>
        </div>

        {/* Footer */}
        <p className="text-xs text-neutral-500 text-right">
          Last Updated <span className="font-semibold text-neutral-700">{asset.lastUpdated}</span>
        </p>
      </div>
    </div>
  )
}

export default AssetCard
