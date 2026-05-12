import { useState } from 'react'
import CollapsibleSection from '../common/CollapsibleSection'
import StrategicImperativeCard from '../common/StrategicImperativeCard'
import EGOCard from '../common/EGOCard'
import KeyDataMapCard from '../common/KeyDataMapCard'
import EgoKdmConnector from '../common/EgoKdmConnector'
import GapDetailModal from '../common/GapDetailModal'
import type { EvidenceGapSummaryData } from '../../types/evidence-gap-summary'
import type { GapDetailRationaleData } from '../../types/evidence-gap-summary/gap-detail-rationale'

const SI_COLORS = ['orange', 'blue', 'teal'] as const

interface Props {
  data: EvidenceGapSummaryData
}

export default function EvidenceGapSummaryContent({ data }: Readonly<Props>) {
  const [selectedEgoId, setSelectedEgoId] = useState<string>(
    () => (data.egos.find(e => e.highlighted) ?? data.egos[0])?.id ?? ''
  )
  const [egoExpanded, setEgoExpanded] = useState(true)
  const [kdmExpanded, setKdmExpanded] = useState(true)
  const [modalData,   setModalData]   = useState<GapDetailRationaleData | null>(null)

  const selectedIndex = data.egos.findIndex(e => e.id === selectedEgoId)

  return (
    <div className="flex flex-col gap-8">

      {/* ── Strategic Imperatives ── */}
      <CollapsibleSection title="STRATEGIC IMPERATIVES">
        <div className="flex flex-wrap items-stretch gap-4">
          {data.strategicImperatives.map((si, i) => (
            <div key={si.id} className="flex-1 min-w-[220px]">
              <StrategicImperativeCard
                label={si.label}
                title={si.title}
                colorScheme={SI_COLORS[i % SI_COLORS.length]}
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* ── Evidence Generation Objectives ── */}
      <CollapsibleSection
        title="EVIDENCE GENERATION OBJECTIVES (EGOs)"
        expanded={egoExpanded}
        onToggle={next => {
          setEgoExpanded(next)
          if (!next) setKdmExpanded(false)
        }}
      >
        <div className="flex flex-wrap gap-4">
          {data.egos.map(ego => (
            <div key={ego.id} className="flex-1 min-w-[200px]">
              <EGOCard
                label={ego.label}
                title={ego.title}
                bullets={ego.bullets}
                selected={ego.id === selectedEgoId}
                onClick={() => {
                  setSelectedEgoId(ego.id)
                  setKdmExpanded(true)
                }}
              />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* ── Funnel connector ── */}
      {egoExpanded && kdmExpanded && selectedIndex >= 0 && (
        <div className="-my-8 -mx-6">
          <EgoKdmConnector
            selectedIndex={selectedIndex}
            totalCount={data.egos.length}
          />
        </div>
      )}

      {/* ── Underlying Key Data Maps ── */}
      <CollapsibleSection
        title="UNDERLYING KEY DATA MAPS"
        expanded={kdmExpanded}
        disableExpand={!egoExpanded || !selectedEgoId}
        onToggle={next => {
          setKdmExpanded(next)
          if (!next) setSelectedEgoId('')
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {data.keyDataMaps.map(card => (
            <KeyDataMapCard
              key={card.id}
              indication={card.indication}
              type={card.type}
              gap={card.gap}
              rationale={card.rationale}
              priority={card.priority}
              tags={card.tags}
              isLinked={card.linkedEgoIds.includes(selectedEgoId)}
              onClick={card.detailedRationale ? () => setModalData(card.detailedRationale!) : undefined}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* ── Gap Detail Modal ── */}
      {modalData && (
        <GapDetailModal
          data={modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  )
}
