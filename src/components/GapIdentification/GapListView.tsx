import { useMemo } from 'react'
import type { PrioritizedGap } from '../../types/evidence-gap-prioritization'
import type { ColumnDef, TableRow } from '../../types/table'
import DataTable from '../common/DataTable'

const LIST_COLUMNS: ColumnDef[] = [
  { key: 'ego',       header: 'EGO',           sortable: true,  sticky: true,  minWidth: '220px' },
  { key: 'segment',   header: 'Segment',        sortable: true,                 minWidth: '130px' },
  { key: 'title',     header: 'Evidence Gap',   sortable: true,                 minWidth: '220px' },
  { key: 'rationale', header: 'Gap Rationale',                                  minWidth: '260px' },
  {
    key:      'priority',
    header:   'Priority',
    sortable: true,
    minWidth: '110px',
    cellType: 'badge',
    badgeMap: {
      High:   'bg-gap-priority-high-bg   text-white',
      Medium: 'bg-gap-priority-medium-bg text-white',
      Low:    'bg-gap-priority-low-bg    text-gap-priority-low-text',
    },
  },
  {
    key:      'urgency',
    header:   'Urgency',
    sortable: true,
    minWidth: '100px',
    cellType: 'badge',
    badgeMap: {
      Urgent: 'bg-gap-urgency-bg text-gap-urgency-text',
    },
  },
]

const ALL_VISIBLE = new Set(LIST_COLUMNS.map(c => c.key))

function toTableRows(gaps: PrioritizedGap[]): TableRow[] {
  return gaps.map(g => ({
    id:    g.id,
    cells: {
      ego:       g.ego,
      segment:   g.segment,
      title:     g.title,
      rationale: g.rationale,
      priority:  g.priority,
      urgency:   g.urgency,
    },
  }))
}

export interface GapListViewProps {
  gaps: PrioritizedGap[]
}

export default function GapListView({ gaps }: GapListViewProps) {
  const tableRows = useMemo(() => toTableRows(gaps), [gaps])

  return (
    <DataTable
      columns={LIST_COLUMNS}
      rows={tableRows}
      visibleColumns={ALL_VISIBLE}
    />
  )
}
