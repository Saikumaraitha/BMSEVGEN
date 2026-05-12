import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { PrioritizationOutletContext } from './EvidenceGapPrioritization'
import GapMatrixView from '../../components/GapIdentification/GapMatrixView'

export default function EvidenceGapPrioritizationMatrix() {
  const { data, selectedEgoId } = useOutletContext<PrioritizationOutletContext>()

  const selectedEgo = data.egos.find(e => e.id === selectedEgoId)

  const matrixGaps = useMemo(
    () => data.matrix.gaps.filter(g => g.egoId === selectedEgoId),
    [data.matrix.gaps, selectedEgoId],
  )

  return (
    <GapMatrixView
      gaps={matrixGaps}
      quadrants={data.matrix.quadrants}
      egoLabel={selectedEgo?.label}
    />
  )
}
