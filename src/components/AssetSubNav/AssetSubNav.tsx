import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '../../assets/icons/chevron-left.svg?react';
import SparkleAiIcon from '../../assets/icons/sparkle-ai.svg?react';
import { ASSET_NAV_ITEMS } from '../../config/AssetsNavItems';
import { ASSET_NAV_ROUTES } from '../../config/AssetSidebarItems';
import { buildPath } from '../../constants/routes';

interface AssetSubNavProps {
  assetName: string;
  activeTab: string;
  lastUpdated?: string;
  onBack?: () => void;
}

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function AssetSubNav({ assetName, activeTab, lastUpdated, onBack }: AssetSubNavProps) {
  const navigate = useNavigate();
  const { assetId = '' } = useParams<{ assetId: string }>();

  return (
    <div className="flex-shrink-0 bg-white border-b border-neutral-200">
      <div className="flex items-center gap-3 px-4 md:px-5 h-[52px]">

        {/* Back button + Asset Name */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="w-6 h-6 flex items-center justify-center rounded-full border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <span className="font-bold text-sm text-neutral-900 whitespace-nowrap">
            {assetName}
          </span>
        </div>

        {/* Nav tab pills */}
        <nav
          className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto"
          aria-label="Asset sections"
        >
          {ASSET_NAV_ITEMS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  const route = ASSET_NAV_ROUTES[tab];
                  if (route) navigate(buildPath(route, { assetId }));
                }}
                className={[
                  'flex-shrink-0 px-4 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'bg-white border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
                ].join(' ')}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {/* Last Updated */}
        {lastUpdated && (
          <span className="flex-shrink-0 text-xs text-neutral-500 whitespace-nowrap">
            Last Updated:{' '}
            <span className="font-medium text-neutral-700">{formatDate(lastUpdated)}</span>
          </span>
        )}

        {/* AI badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fdf6ec] border border-[#e8d5b0] text-xs text-[#7a5c2e] font-medium whitespace-nowrap">
          <SparkleAiIcon className="w-3.5 h-3.5 text-[#c57100] flex-shrink-0" aria-hidden="true" />
          <span>AI-generated &mdash; verify before use</span>
        </div>

      </div>
    </div>
  );
}

export default AssetSubNav;
