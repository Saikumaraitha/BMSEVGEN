import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import GapListView from '../../components/GapIdentification/GapListView'
import { PrioritizationOutletContext } from './EvidenceGapPrioritization'

export default function EvidenceGapPrioritizationList() {
  const { data, filterValues } = useOutletContext<PrioritizationOutletContext>()

  const filteredGaps = useMemo(() => data.list.gaps.filter(gap => {
    if (filterValues.ego      && filterValues.ego      !== 'All' && gap.egoId    !== filterValues.ego)      return false
    if (filterValues.priority && filterValues.priority !== 'All' && gap.priority !== filterValues.priority) return false
    if (filterValues.urgency  && filterValues.urgency  !== 'All' && gap.urgency  !== filterValues.urgency)  return false
    return true
  }), [data.list.gaps, filterValues])

  return <GapListView gaps={filteredGaps} />
}
