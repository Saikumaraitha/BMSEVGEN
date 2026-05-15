// ─── Relative path segments (used in nested <Route path={...}>) ──────────────

export const ROUTE_SEGMENTS = {
  HOME:       '/',
  ASSET_ROOT: '/asset/:assetId',

  // Header tabs
  CHAT_AGENTS:     'chat-agents',
  RESEARCH_DOCUMENTS: 'research-documents',
  GAP_IDENTIFICATION: 'gap-identification',

  // Gap Identification children
  EVIDENCE_GAP_SUMMARY:        'evidence-gap-summary',
  EVIDENCE_GAP_PRIORITIZATION: 'evidence-gap-prioritization',
  GAP_DETAILS:                 'gap-details',
  GAP_DETAILS_BASIC:           'gap-details-basic',
  LIST:                        'list',
  MATRIX:                      'matrix',
  EVIDENCE_NEED:               'evidence-need',
  COMP_VIEW:                   'comp-view',

  // Research Documents children
  DOC_ID: ':docId',
} as const

// ─── Path prefix helpers ──────────────────────────────────────────────────────

const S = ROUTE_SEGMENTS

const assetRoot               = S.ASSET_ROOT
const gapBase                 = `${assetRoot}/${S.GAP_IDENTIFICATION}`
const evidenceGapSummaryBase  = `${gapBase}/${S.EVIDENCE_GAP_SUMMARY}`
const evidenceGapPrioBase     = `${gapBase}/${S.EVIDENCE_GAP_PRIORITIZATION}`
const researchDocBase         = `${assetRoot}/${S.RESEARCH_DOCUMENTS}`

// ─── Absolute paths (used in <Link to={...}> and navigate()) ─────────────────

export const ROUTES = {
  HOME: S.HOME,

  ASSET: {
    CHAT_AGENTS: `${assetRoot}/${S.CHAT_AGENTS}`,

    RESEARCH_DOCUMENTS: {
      ROOT: researchDocBase,
      DOC:  `${researchDocBase}/${S.DOC_ID}`,
    },

    GAP_IDENTIFICATION: {
      ROOT:      gapBase,
      COMP_VIEW: `${gapBase}/${S.COMP_VIEW}`,

      EVIDENCE_GAP_SUMMARY: {
        ROOT:            evidenceGapSummaryBase,
        GAP_DETAILS:     `${evidenceGapSummaryBase}/${S.GAP_DETAILS}`,
        GAP_DETAILS_BASIC: `${evidenceGapSummaryBase}/${S.GAP_DETAILS_BASIC}`,
      },

      EVIDENCE_GAP_PRIORITIZATION: {
        ROOT:   evidenceGapPrioBase,
        LIST:   `${evidenceGapPrioBase}/${S.LIST}`,
        MATRIX: `${evidenceGapPrioBase}/${S.MATRIX}`,
      },

      EVIDENCE_NEED: `${gapBase}/${S.EVIDENCE_NEED}`,
    },
  },
} as const

// ─── Helper to resolve :assetId / :docId ─────────────────────────────────────

export function buildPath(
  route: string,
  params: { assetId: string; docId?: string },
): string {
  let path = route.replace(':assetId', params.assetId)
  if (params.docId) path = path.replace(':docId', params.docId)
  return path
}
