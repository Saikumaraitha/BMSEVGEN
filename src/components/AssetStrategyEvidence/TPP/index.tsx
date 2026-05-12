import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../../common/PageHeader'
import TPPCard from './TPPCard'
import { getTppData } from '../../../services/tpp'
import type { TPPData } from '../../../types/tpp'

export default function TPP() {
  const { assetId = '' } = useParams<{ assetId: string }>()
  const [data, setData]       = useState<TPPData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    getTppData(assetId)
      .then(setData)
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false))
  }, [assetId])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader title="TPP" onExport={() => {}} />

      {loading && (
        <div className="flex items-center justify-center p-12 text-neutral-500 text-sm">Loading…</div>
      )}

      {(error || (!loading && !data)) && (
        <div className="flex items-center justify-center p-12 text-error text-sm">{error}</div>
      )}

      {data && (
        <div className="flex-1 overflow-auto p-4 bg-white">
          <div className="grid grid-cols-2 gap-3">
            {data.sections.map(section => (
              <TPPCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
