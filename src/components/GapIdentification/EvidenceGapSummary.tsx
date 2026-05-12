import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import PageHeader from '../common/PageHeader'
import EvidenceGapSummaryContent from './EvidenceGapSummaryContent'

import { getEvidenceGapSummaryData } from '../../services/evidence-gap-summary'
import type { EvidenceGapSummaryData } from '../../types/evidence-gap-summary'

export default function EvidenceGapSummary() {
  const { assetId = '' } = useParams<{ assetId: string }>()
  const [data,    setData]    = useState<EvidenceGapSummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getEvidenceGapSummaryData(assetId)
      .then(setData)
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false))
  }, [assetId])

  if (loading) return (
    <div className="flex items-center justify-center p-12 text-neutral-500 text-sm">Loading…</div>
  )
  if (error || !data) return (
    <div className="flex items-center justify-center p-12 text-red-500 text-sm">{error}</div>
  )

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Evidence Gap Summary" />
      <div className="flex-1 overflow-auto px-6 py-6">
        <EvidenceGapSummaryContent data={data} />
      </div>
    </div>
  )
}
