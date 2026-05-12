import { useState, useEffect, useMemo } from 'react'
import { useParams, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom'

import PageHeader from '../../components/common/PageHeader'
import ViewToggle from '../../components/common/ViewToggle'
import EgoSelector from '../../components/common/EgoSelector'

import { getEvidenceGapPrioritizationData } from '../../services/evidence-gap-prioritization'
import type { EvidenceGapPrioritizationData } from '../../types/evidence-gap-prioritization'
import type { FilterColumn } from '../../components/common/PageHeader'
import { ROUTES, buildPath } from '../../constants/routes'

export interface PrioritizationOutletContext {
  data:            EvidenceGapPrioritizationData
  filterValues:    Record<string, string>
  selectedEgoId:   string
  setSelectedEgoId:(id: string) => void
}

const VIEW_OPTIONS = [
  { value: 'list',   label: 'List View'   },
  { value: 'matrix', label: 'Matrix View' },
]

export default function EvidenceGapPrioritization() {
  const { assetId = '' } = useParams<{ assetId: string }>()
  const location           = useLocation()
  const navigate           = useNavigate()

  const [data,    setData]    = useState<EvidenceGapPrioritizationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [filterValues,    setFilterValues]    = useState<Record<string, string>>({})
  const [selectedEgoId,   setSelectedEgoId]   = useState('')

  useEffect(() => {
    getEvidenceGapPrioritizationData(assetId)
      .then(d => { setData(d); setSelectedEgoId(d.egos[0]?.id ?? '') })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false))
  }, [assetId])

  const activeView: 'list' | 'matrix' = location.pathname.includes('/matrix') ? 'matrix' : 'list'

  const filterColumns = useMemo<FilterColumn[]>(() => {
    if (!data) return []
    const allGaps = data.list.gaps
    const priorityOptions = ['All', ...Array.from(new Set(allGaps.map(g => g.priority))).filter(p => p !== 'N/A')]
    const urgencyOptions  = ['All', ...Array.from(new Set(allGaps.map(g => g.urgency))).filter(u => u !== 'N/A')]
    const egoOptions      = ['All', ...data.egos.map(e => e.id)]
    return [
      { key: 'ego',      label: 'EGO',           options: egoOptions      },
      { key: 'priority', label: 'Prioritization', options: priorityOptions },
      { key: 'urgency',  label: 'Urgency',        options: urgencyOptions  },
    ]
  }, [data])

  function handleFilterChange(key: string, value: string) {
    setFilterValues(prev => ({ ...prev, [key]: value }))
  }

  function handleViewChange(v: string) {
    const base = buildPath(ROUTES.ASSET.GAP_IDENTIFICATION.EVIDENCE_GAP_PRIORITIZATION.LIST, { assetId })
      .replace('/list', '')
    navigate(`${base}/${v}`)
  }

  if (!loading && !error && data && !location.pathname.match(/\/(list|matrix)$/)) {
    return <Navigate to={buildPath(ROUTES.ASSET.GAP_IDENTIFICATION.EVIDENCE_GAP_PRIORITIZATION.LIST, { assetId })} replace />
  }

  if (loading) return (
    <div className="flex items-center justify-center p-12 text-neutral-500 text-sm">Loading…</div>
  )
  if (error || !data) return (
    <div className="flex items-center justify-center p-12 text-red-500 text-sm">{error}</div>
  )

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Evidence Gap Prioritization"
        isFilter={activeView === 'list'}
        filterColumns={filterColumns}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      {/* Toolbar: view toggle + EGO selector */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-neutral-200 bg-white">
        <ViewToggle
          options={VIEW_OPTIONS}
          value={activeView}
          onChange={handleViewChange}
        />

        {activeView === 'matrix' && (
          <EgoSelector
            egos={data.egos}
            value={selectedEgoId}
            onChange={setSelectedEgoId}
          />
        )}
      </div>

      {/* Route content */}
      <div className="flex-1 overflow-auto p-4">
        <Outlet context={{ data, filterValues, selectedEgoId, setSelectedEgoId } satisfies PrioritizationOutletContext} />
      </div>
    </div>
  )
}
