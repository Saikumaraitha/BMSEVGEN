import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate, Outlet } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout/AppLayout'
import AssetLayout from '../../layouts/AssetLayout/AssetLayout'
import { ROUTES, buildPath } from '../../constants/routes'
import { GAP_IDENTIFICATION_SIDEBAR_ROUTES } from '../../config/AssetSidebarItems'

import { Asset } from '../../types/home'
import { getAssetDetails } from '../../services/home'



function getActiveSidebarItem(pathname: string): string {
  for (const [label, route] of Object.entries(GAP_IDENTIFICATION_SIDEBAR_ROUTES)) {
    const segment = route.split('/').pop() ?? ''
    if (pathname.includes(`/${segment}`)) return label
  }
  return 'Comprehensive View'
}

function GapIdentification() {
  const { assetId = '' } = useParams<{ assetId: string }>();
  const [asset, setAsset] = useState<Asset>();
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    getAssetDetails(assetId).then((asset) => setAsset(asset))
  }, [assetId])
  

  const activeSidebarItem = getActiveSidebarItem(location.pathname)

  // Default redirect: /gap-identification → /gap-identification/comp-view
  useEffect(() => {
    if (location.pathname.endsWith('/gap-identification')) {
      navigate(buildPath(ROUTES.ASSET.GAP_IDENTIFICATION.EVIDENCE_GAP_SUMMARY.ROOT, { assetId }), { replace: true })
    }
  }, [location.pathname, assetId, navigate])

  const handleSidebarClick = (item: string) => {
    const route = GAP_IDENTIFICATION_SIDEBAR_ROUTES[item]
    if (route) navigate(buildPath(route, { assetId }))
  }

  return (
    <AppLayout>
      <AssetLayout
        assetName={asset?.name}
        activeTab="Gap Identification & Prioritization"
        lastUpdated={asset?.lastUpdated}
        onBack={() => navigate(ROUTES.HOME)}
        activeSidebarItem={activeSidebarItem}
        onSidebarItemClick={handleSidebarClick}
      >
        <Outlet />
      </AssetLayout>
    </AppLayout>
  )
}

export default GapIdentification
