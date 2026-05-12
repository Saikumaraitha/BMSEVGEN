import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout/AppLayout'
import AssetLayout from '../layouts/AssetLayout/AssetLayout'
import { ROUTES } from '../constants/routes'
import { getAssetDetails } from '../services/home'
import type { Asset } from '../types/home'

interface ComingSoonAssetPageProps {
  activeTab: string
}

function ComingSoonAssetPage({ activeTab }: ComingSoonAssetPageProps) {
  const { assetId = '' } = useParams<{ assetId: string }>()
  const navigate = useNavigate()
  const [asset, setAsset] = useState<Asset>()

  useEffect(() => {
    getAssetDetails(assetId).then(setAsset)
  }, [assetId])

  return (
    <AppLayout>
      <AssetLayout
        assetName={asset?.name}
        activeTab={activeTab}
        lastUpdated={asset?.lastUpdated}
        onBack={() => navigate(ROUTES.HOME)}
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-neutral-400">
          <svg className="w-16 h-16 opacity-30" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
            <path d="M32 20v16M32 44v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <p className="text-2xl font-heading font-semibold text-neutral-300">Coming Soon</p>
          <p className="text-sm text-neutral-400">This section is under development.</p>
        </div>
      </AssetLayout>
    </AppLayout>
  )
}

export default ComingSoonAssetPage
