import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../../common/PageHeader'
import VisionCard from './VisionCard'
import SIColumn from './SIColumn'
import { getMedicalStrategicContextData } from '../../../services/medical-strategic-context'
import type { MedicalStrategicContextData } from '../../../types/medical-strategic-context'

export default function MedicalStrategicContext() {
  const { assetId = '' } = useParams<{ assetId: string }>()
  const [data, setData]       = useState<MedicalStrategicContextData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getMedicalStrategicContextData(assetId)
      .then(setData)
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false))
  }, [assetId])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="Medical Strategic Context" onExport={() => {}} />

      {loading && (
        <div className="flex items-center justify-center p-12 text-neutral-500 text-sm">Loading…</div>
      )}

      {(error || (!loading && !data)) && (
        <div className="flex items-center justify-center p-12 text-error text-sm">{error}</div>
      )}

      {data && (
        <div className="flex-1 overflow-auto p-4 bg-white">
          <VisionCard vision={data.vision} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.imperatives.map((si, i) => (
              <SIColumn key={si.id} imperative={si} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
