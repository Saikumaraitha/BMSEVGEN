// ─── Relative path segments (used in nested <Route path={...}>) ──────────────

export const ROUTE_SEGMENTS = {
  HOME: '/',
  ASSET_ROOT: '/asset/:assetId',

  // Header tabs
  EXECUTIVE_SUMMARY:        'executive-summary',
  DISEASE_TREATMENT:        'disease-treatment',
  ASSET_STRATEGY_EVIDENCE:  'asset-strategy-evidence',
  COMPETITIVE_BENCHMARK:    'competitive-benchmark',
  GAP_IDENTIFICATION:       'gap-identification',

  // Disease & Treatment Landscape sidebar items
  DISEASE_PATHOPHYSIOLOGY:  'disease-pathophysiology',
  TREATMENT_PARADIGM:       'treatment-paradigm',
  PATIENT_SEGMENT:          'patient-segment',

  // Competitive Benchmark sidebar items
  COMPETITOR_OVERVIEW:          'competitor-overview',
  TRIAL_SNAPSHOT:               'trial-snapshot',

  // Asset Strategy & Evidence sidebar items
  TPP:                          'tpp',
  MEDICAL_STRATEGIC_CONTEXT:    'medical-strategic-context',

  // Gap Identification sidebar items
  GAP_COMP_VIEW:                   'comp-view',
  GAP_EVIDENCE_GAP_SUMMARY:        'evidence-gap-summary',
  GAP_EVIDENCE_GAP_PRIORITIZATION: 'evidence-gap-prioritization',
  GAP_EVIDENCE_NEED:               'evidence-need',

  // Gap Identification — Evidence Gap Prioritization sub-routes
  EVIDENCE_GAP_PRIORITIZATION:     'evidence-gap-prioritization',
  EVIDENCE_GAP_SUMMARY:            'evidence-gap-summary',
  LIST:                            'list',
  MATRIX:                          'matrix',

  // Evidence Gap Summary children
  GAP_DETAILS:       'gap-details',
  GAP_DETAILS_BASIC: 'gap-details-basic',

} as const

// ─── Path prefix helpers ──────────────────────────────────────────────────────

const S = ROUTE_SEGMENTS

const assetRoot                     = S.ASSET_ROOT
const executiveSummaryBase          = `${assetRoot}/${S.EXECUTIVE_SUMMARY}`
const diseaseTreatmentBase          = `${assetRoot}/${S.DISEASE_TREATMENT}`
const assetStrategyBase             = `${assetRoot}/${S.ASSET_STRATEGY_EVIDENCE}`
const gapBase                       = `${assetRoot}/${S.GAP_IDENTIFICATION}`
const evidenceGapSummaryBase        = `${gapBase}/${S.EVIDENCE_GAP_SUMMARY}`
const evidenceGapPrioritizationBase = `${gapBase}/${S.EVIDENCE_GAP_PRIORITIZATION}`
const competitiveBenchmarkBase      = `${assetRoot}/${S.COMPETITIVE_BENCHMARK}`

// ─── Absolute paths (used in <Link to={...}> and navigate()) ─────────────────

export const ROUTES = {
  HOME: S.HOME,

  ASSET: {
    // ── Header Tab 1: Executive Summary ──────────────────────────────────────
    EXECUTIVE_SUMMARY: {
      ROOT:    executiveSummaryBase,
    },

    // ── Header Tab 2: Disease & Treatment Landscape ───────────────────────────
    DISEASE_TREATMENT: {
      ROOT:                    diseaseTreatmentBase,
      DISEASE_PATHOPHYSIOLOGY: `${diseaseTreatmentBase}/${S.DISEASE_PATHOPHYSIOLOGY}`,
      TREATMENT_PARADIGM:      `${diseaseTreatmentBase}/${S.TREATMENT_PARADIGM}`,
      PATIENT_SEGMENT:         `${diseaseTreatmentBase}/${S.PATIENT_SEGMENT}`,
    },

    // ── Header Tab 3: Asset Strategy & Evidence ───────────────────────────────
    ASSET_STRATEGY_EVIDENCE: {
      ROOT:                      assetStrategyBase,
      TPP:                       `${assetStrategyBase}/${S.TPP}`,
      MEDICAL_STRATEGIC_CONTEXT: `${assetStrategyBase}/${S.MEDICAL_STRATEGIC_CONTEXT}`,
    },

    // ── Header Tab 4: Competitive Benchmark ───────────────────────────────────
    COMPETITIVE_BENCHMARK: {
      ROOT:                competitiveBenchmarkBase,
      COMPETITOR_OVERVIEW: `${competitiveBenchmarkBase}/${S.COMPETITOR_OVERVIEW}`,
      TRIAL_SNAPSHOT:      `${competitiveBenchmarkBase}/${S.TRIAL_SNAPSHOT}`,
    },

    // ── Header Tab 5: Gap Identification & Prioritization ─────────────────────
    GAP_IDENTIFICATION: {
      ROOT:                        gapBase,
      EVIDENCE_GAP_SUMMARY: {
        ROOT:              evidenceGapSummaryBase,
        GAP_DETAILS:       `${evidenceGapSummaryBase}/${S.GAP_DETAILS}`,
        GAP_DETAILS_BASIC: `${evidenceGapSummaryBase}/${S.GAP_DETAILS_BASIC}`,
      },
      EVIDENCE_GAP_PRIORITIZATION: {
        ROOT:   evidenceGapPrioritizationBase,
        LIST:   `${evidenceGapPrioritizationBase}/${S.LIST}`,
        MATRIX: `${evidenceGapPrioritizationBase}/${S.MATRIX}`,
      },
    },
  },
} as const

// ─── Helper to resolve :assetId ──────────────────────────────────────────────

export function buildPath(route: string, params: { assetId: string }): string {
  return route.replace(':assetId', params.assetId)
}
