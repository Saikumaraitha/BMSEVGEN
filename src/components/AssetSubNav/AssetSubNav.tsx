import { useNavigate, useParams } from 'react-router-dom'
import ChevronLeftIcon from '../../assets/icons/chevron-left.svg?react'
import { ASSET_NAV_ITEMS } from '../../config/AssetsNavItems'
import { ASSET_NAV_ROUTES } from '../../config/AssetSidebarItems'
import { buildPath } from '../../constants/routes'

interface AssetSubNavProps {
  assetName: string
  activeTab: string
  lastUpdated?: string
  onBack?: () => void
}

function AssetSubNav({
  assetName,
  activeTab,
  lastUpdated,
  onBack,
}: AssetSubNavProps) {
  const navigate = useNavigate()
  const { assetId = '' } = useParams<{ assetId: string }>()
  return (
    <div className="flex-shrink-0 bg-subnav-bg border-b border-neutral-200">
      <div className="flex items-center gap-2 px-4 md:px-6 h-[60px] overflow-hidden">
        {/* Back + Asset Name */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-[23.4px] h-[23.4px] flex items-center justify-center rounded-full bg-tab-accent text-white flex-shrink-0 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
          </button>
          {/* vertical divider */}
          <span className="w-px h-5 bg-tab-accent" aria-hidden="true" />
          <span
            className="font-ui font-bold text-sm text-near-black whitespace-nowrap pr-3"
          >
            {assetName}
          </span>
        </div>

        {/* Tabs — flex-1 so they fill remaining space; each button flex-1 to share equally */}
        <nav className="flex flex-1 items-center min-w-0 overflow-hidden" aria-label="Asset sections">
          {ASSET_NAV_ITEMS.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  const route = ASSET_NAV_ROUTES[tab]
                  if (route) navigate(buildPath(route, { assetId }))
                }}
                className={[
                  'flex-1 min-w-0 text-center px-1 py-1.5 rounded-full leading-tight',
                  'text-[12px] font-medium',
                  isActive
                    ? 'bg-brand-primary text-white border border-brand-primary-dark'
                    : 'text-tab-inactive border border-transparent',
                ].join(' ')}
              >
                {tab}
              </button>
            )
          })}
        </nav>

        {/* Last Updated — always pinned to the right, never overlaps */}
        {lastUpdated && (
          <span className="flex-shrink-0 text-[12px] whitespace-nowrap pl-2 text-subnav-meta">
            Last Updated: <span className="text-subnav-meta">{lastUpdated}</span>
          </span>
        )}
      </div>
    </div>
  )
}

export default AssetSubNav
