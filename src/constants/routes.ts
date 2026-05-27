// ─── Relative path segments (used in nested <Route path={...}>) ──────────────

export const ROUTE_SEGMENTS = {
  HOME:       '/',
  ASSET_ROOT: '/asset/:assetId',

  // Indication nesting
  INDICATION: 'indication/:indicationId',

  // Header tabs
  CHAT_AGENTS:     'chat-agents',
  RESEARCH_DOCUMENTS: 'research-documents',
  GAP_IDENTIFICATION: 'gap-identification',

  // Research Documents children
  DOC_ID: ':docId',
} as const

// ─── Path prefix helpers ──────────────────────────────────────────────────────

const S = ROUTE_SEGMENTS

const assetRoot               = S.ASSET_ROOT
const indicationBase          = `${assetRoot}/${S.INDICATION}`
const researchDocBase         = `${indicationBase}/${S.RESEARCH_DOCUMENTS}`
const gapBase                 = `${indicationBase}/${S.GAP_IDENTIFICATION}`

// ─── Absolute paths (used in <Link to={...}> and navigate()) ─────────────────

export const ROUTES = {
  HOME: S.HOME,

  ASSET: {
    CHAT_AGENTS: `${indicationBase}/${S.CHAT_AGENTS}`,

    RESEARCH_DOCUMENTS: {
      ROOT: researchDocBase,
      DOC:  `${researchDocBase}/${S.DOC_ID}`,
    },
    GAP_IDENTIFICATION: {
      ROOT: gapBase,
    }
  },
} as const

// ─── Helper to resolve :assetId / :indicationId / :docId ─────────────────────

export function buildPath(
  route: string,
  params: { assetId: string; indicationId: string; docId?: string },
): string {
  let path = route.replace(':assetId', params.assetId)
  path = path.replace(':indicationId', params.indicationId)
  if (params.docId) path = path.replace(':docId', params.docId)
  return path
}
