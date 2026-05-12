import { useState, useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import AssetSubNav from '../../components/AssetSubNav/AssetSubNav'
import Sidebar from '../../components/Sidebar/Sidebar'
import { ASSET_SIDEBAR_ITEMS } from '../../config/AssetSidebarItems'

interface AssetLayoutProps {
  children: ReactNode
  assetName?: string
  activeTab?: string
  lastUpdated?: string
  onBack?: () => void
  activeSidebarItem?: string
  onSidebarItemClick?: (item: string) => void
}

function AssetLayout({
  children,
  assetName = 'Asset',
  activeTab = 'Executive Summary',
  lastUpdated,
  onBack,
  activeSidebarItem,
  onSidebarItemClick,
}: AssetLayoutProps) {
  const { pathname } = useLocation()
  const items = ASSET_SIDEBAR_ITEMS[activeTab] ?? []
  const showSidebar = items.length > 0

  const [sidebarItem, setSidebarItem] = useState(items[0] ?? '')

  // Reset active sidebar item when the tab (and thus items) changes
  useEffect(() => {
    setSidebarItem(items[0] ?? '')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const resolvedActiveItem = activeSidebarItem ?? sidebarItem
  const resolvedOnItemClick = onSidebarItemClick ?? setSidebarItem

  return (
    <div className="flex flex-col h-full">
      <AssetSubNav
        assetName={assetName}
        activeTab={activeTab}
        lastUpdated={lastUpdated}
        onBack={onBack}
      />

      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <Sidebar
            items={items}
            activeItem={resolvedActiveItem}
            onItemClick={resolvedOnItemClick}
          />
        )}
        <main key={pathname} className="flex-1 overflow-auto p-4 md:p-6 bg-white page-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AssetLayout
