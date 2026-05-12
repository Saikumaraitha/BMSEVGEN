import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../layouts/AppLayout/AppLayout'
import AssetLayout from '../../layouts/AssetLayout/AssetLayout'
import ExecutiveSummaryContent from '../../components/ExecutiveSummary/ExecutiveSummaryContent'
import { ROUTES } from '../../constants/routes'
import type { Asset } from '../../types/home'
import type { ExecutiveSummaryPageData } from '../../types/executive-summary'
import { getAssetDetails } from '../../services/home'
import { getExecutiveSummaryData } from '../../services/executive-summary'

function ExecutiveSummary() {
  const { assetId = '' } = useParams<{ assetId: string }>()
  const navigate = useNavigate()

  const [asset, setAsset] = useState<Asset>()
  const [data,  setData]  = useState<ExecutiveSummaryPageData | null>(null)

  useEffect(() => {
    getAssetDetails(assetId).then(setAsset)
    getExecutiveSummaryData(assetId).then(setData)
  }, [assetId])

  return (
    <AppLayout>
      <AssetLayout
        assetName={asset?.name}
        activeTab="Executive Summary"
        lastUpdated={asset?.lastUpdated}
        onBack={() => navigate(ROUTES.HOME)}
      >
        {data
          ? <ExecutiveSummaryContent data={data} assetId={assetId} />
          : <div className="flex items-center justify-center h-full text-neutral-400 text-sm">Loading…</div>
        }
      </AssetLayout>
    </AppLayout>
  )
}

export default ExecutiveSummary
