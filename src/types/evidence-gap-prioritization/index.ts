// ── Shared ────────────────────────────────────────────────────────────────────

export interface PrioritizedGap {
  id:          string
  egoId:       string
  ego:         string                          // Full EGO display name
  segment:     string                          // e.g. "1L mNSCLC"
  title:       string                          // Evidence Gap title
  rationale:   string                          // Gap Rationale text
  priority:    'High' | 'Medium' | 'Low' | 'N/A'
  urgency:     'Urgent' | 'N/A'
  impact:      'High' | 'Low-Medium'           // Y axis for matrix
  timeHorizon: 'Short-term' | 'Long-term'      // X axis for matrix
}

// ── List View ─────────────────────────────────────────────────────────────────

export interface ListViewColumn {
  key:   string
  label: string
}

export interface EvidenceGapListData {
  view:    'list'
  columns: ListViewColumn[]
  gaps:    PrioritizedGap[]
}

// ── Matrix View ───────────────────────────────────────────────────────────────

export interface MatrixQuadrant {
  id:          string
  label:       string
  impact:      'High' | 'Low-Medium'
  timeHorizon: 'Short-term' | 'Long-term'
  badgeColor:  string   // label badge background
  bgColor:     string   // quadrant background tint
}

export interface EvidenceGapMatrixData {
  view:      'matrix'
  quadrants: MatrixQuadrant[]
  gaps:      PrioritizedGap[]
}

// ── Combined ──────────────────────────────────────────────────────────────────

export interface EgoOption {
  id:    string
  label: string    // e.g. "EGO 1"
  title: string    // full EGO title
}

export interface EvidenceGapPrioritizationData {
  egos:   EgoOption[]
  list:   EvidenceGapListData
  matrix: EvidenceGapMatrixData
}
