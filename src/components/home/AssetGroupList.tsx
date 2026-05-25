import type { Asset, Indication } from '../../types/home'
import EmptyStateIcon from '../../assets/icons/empty-state.svg?react'
import ChevronDownIcon from '../../assets/icons/chevron-down.svg?react'
import SearchIcon from '../../assets/icons/search.svg?react'

// Fixed colour map so each tag always renders in the same colour regardless of position
const TAG_COLOUR_MAP: Record<string, string> = {
  'Oncology':     'bg-asset-tag-1-bg text-asset-tag-1-text',
  'New Insights': 'bg-asset-tag-2-bg text-asset-tag-2-text',
  'In Refresh':   'bg-asset-tag-3-bg text-asset-tag-3-text',
  'Active Draft': 'bg-asset-tag-4-bg text-asset-tag-4-text',
  'Immunology':   'bg-asset-tag-1-bg text-asset-tag-1-text',
  'Psoriasis':    'bg-asset-tag-2-bg text-asset-tag-2-text',
  'TYK2':         'bg-asset-tag-3-bg text-asset-tag-3-text',
}

const TAG_COLOURS_FALLBACK = [
  'bg-asset-tag-1-bg text-asset-tag-1-text',
  'bg-asset-tag-2-bg text-asset-tag-2-text',
  'bg-asset-tag-3-bg text-asset-tag-3-text',
  'bg-asset-tag-4-bg text-asset-tag-4-text',
  'bg-asset-tag-5-bg text-asset-tag-5-text',
]

function tagColour(tag: string, fallbackIndex: number): string {
  return TAG_COLOUR_MAP[tag] ?? TAG_COLOURS_FALLBACK[fallbackIndex % TAG_COLOURS_FALLBACK.length]
}

interface TagPillProps {
  tag:   string
  index: number
}

function TagPill({ tag, index }: TagPillProps) {
  const colour = tagColour(tag, index)

  let prefix: React.ReactNode = null
  if (tag === 'New Insights') {
    prefix = <SearchIcon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
  } else if (tag === 'In Refresh') {
    prefix = <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
  } else if (tag === 'Active Draft') {
    prefix = <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
  }

  return (
    <span className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-medium ${colour}`}>
      {prefix}
      {tag}
    </span>
  )
}

interface IndicationRowProps {
  indication:    Indication
  onViewDetails: () => void
}

function IndicationRow({ indication, onViewDetails }: IndicationRowProps) {
  return (
    <div
      onClick={onViewDetails}
      className="flex flex-wrap items-center gap-3 px-6 py-5 border-t border-neutral-100 cursor-pointer hover:bg-[rgba(190,43,187,0.025)]"
    >
      {/* Indication name */}
      <span className="font-sans font-bold text-asset-tag-indication-name text-sm min-w-[3.5rem]">
        {indication.name}
      </span>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 flex-1 font-heading">
        {indication.tags.map((tag, i) => (
          <TagPill key={tag} tag={tag} index={i} />
        ))}
      </div>

      <div className="flex items-center gap-11">
        {/* Last Updated */}
        <span className="text-xs text-neutral-500 whitespace-nowrap">
          Last Updated{" "}
          <span className="font-semibold text-neutral-700">
            {indication.lastUpdated}
          </span>
        </span>

        {/* View Details — text + filled purple circle with arrow */}
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary-dark transition-colors whitespace-nowrap ml-auto"
        >
          View Details
          <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-primary text-white flex-shrink-0">
            <ChevronDownIcon
              className="w-2.5 h-2.5 -rotate-90"
              aria-hidden="true"
            />
          </span>
        </button>
      </div>
    </div>
  );
}

interface AssetGroupListProps {
  assets:        Asset[]
  onViewDetails: (assetId: string) => void
}

function AssetGroupList({ assets, onViewDetails }: AssetGroupListProps) {
  const visible = assets.filter((a) => a.indications.length > 0)

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <EmptyStateIcon className="w-12 h-12 mb-4 text-neutral-200" aria-hidden="true" />
        <p className="text-sm">No assets found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-10">
      {visible.map((asset) => (
        <div
          key={asset.id}
          className="rounded-2xl border-2 border-brand-primary/40 overflow-hidden shadow-[0_4px_15px_0_rgba(140,31,138,0.05)] bg-white"
        >
          {/* Group header */}
          <div className="flex items-center gap-3 px-6 py-3 bg-[rgba(190,43,187,0.10)]">
            <span className="font-heading font-bold text-brand-primary text-base">
              {asset.name}
            </span>
            <span className="text-asset-tag-mechanism select-none">|</span>
            <span className="text-xs text-asset-tag-mechanism">{asset.mechanismOfAction}</span>
          </div>

          {/* Indication rows */}
          {asset.indications.map((indication) => (
            <IndicationRow
              key={indication.id}
              indication={indication}
              onViewDetails={() => onViewDetails(asset.id)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default AssetGroupList
