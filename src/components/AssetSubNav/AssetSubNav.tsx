import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '../../assets/icons/chevron-left.svg?react';
import { ASSET_NAV_ITEMS } from '../../config/AssetsNavItems';
import { ASSET_NAV_ROUTES } from '../../config/AssetSidebarItems';
import { buildPath } from '../../constants/routes';

interface AssetSubNavProps {
  assetName: string;
  activeTab: string;
  indicationName?: string;
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

function AssetSubNav({ assetName, activeTab, indicationName, lastUpdated, onBack }: AssetSubNavProps) {
  const navigate = useNavigate();
  const { assetId = '', indicationId = '' } = useParams<{ assetId: string; indicationId: string }>();

  return (
    <div className="flex-shrink-0 bg-subnav-bg border-b border-neutral-200">
      <div className="flex items-center gap-3 px-4 md:px-4 h-[60px]">
        {/* Back button + Asset Name */}
        <div className="flex items-center gap-5 flex-shrink-0 font-ui">
          <button
            type="button"
            onClick={onBack}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-tab-accent text-subnav-bg hover:bg-brand-primary hover:text-white transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <div className="h-6 border border-topbar-divider"></div>
          <div className='flex items-center gap-1'>
            <span className="font-bold text-neutral-900 whitespace-nowrap">
              {assetName}
            </span>
            {indicationName && (
              <>
                <span className="text-subnav-asset select-none">|</span>
                <span className="font-medium text-subnav-asset whitespace-nowrap">
                  {indicationName}
                </span>
              </>
            )}
          </div>
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
                  if (route)
                    navigate(buildPath(route, { assetId, indicationId }));
                }}
                className={[
                  "flex-shrink-0 px-4 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ease-in-out font-heading",
                  isActive
                    ? "bg-brand-primary text-white border-b-[3px] border-b-[#A1179E] bg-[#BE2BBB]"
                    : "text-tab-inactive-90 hover:bg-brand-primary hover:text-white",
                ].join(" ")}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {/* Last Updated */}
        {lastUpdated && (
          <span className="flex-shrink-0 text-xs text-subnav-meta font-semibold font-heading whitespace-nowrap">
            Last Updated:{" "}
            <span className="font-medium text-subnav-meta">
              {formatDate(lastUpdated)}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

export default AssetSubNav;
