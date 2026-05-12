import { ROUTES } from '../constants/routes'

export const ASSET_NAV_ROUTES: Record<string, string> = {
  'Executive Summary':                   ROUTES.ASSET.EXECUTIVE_SUMMARY.ROOT,
  'Disease & Treatment Landscape':       ROUTES.ASSET.DISEASE_TREATMENT.ROOT,
  'BMS Asset Strategy':                  ROUTES.ASSET.ASSET_STRATEGY_EVIDENCE.ROOT,
  'Competitive Benchmark':               ROUTES.ASSET.COMPETITIVE_BENCHMARK.ROOT,
  'Gap Identification & Prioritization': ROUTES.ASSET.GAP_IDENTIFICATION.ROOT,
}

export const DISEASE_TREATMENT_SIDEBAR_ROUTES: Record<string, string> = {
  'Disease Pathophysiology': ROUTES.ASSET.DISEASE_TREATMENT.DISEASE_PATHOPHYSIOLOGY,
  'Treatment Paradigm':      ROUTES.ASSET.DISEASE_TREATMENT.TREATMENT_PARADIGM,
  'Patient Segment':         ROUTES.ASSET.DISEASE_TREATMENT.PATIENT_SEGMENT,
}

export const COMPETITIVE_BENCHMARK_SIDEBAR_ROUTES: Record<string, string> = {
  'Competitor Overview': ROUTES.ASSET.COMPETITIVE_BENCHMARK.COMPETITOR_OVERVIEW,
  'Trial Snapshot':      ROUTES.ASSET.COMPETITIVE_BENCHMARK.TRIAL_SNAPSHOT,
}

export const ASSET_STRATEGY_SIDEBAR_ROUTES: Record<string, string> = {
  'TPP':                       ROUTES.ASSET.ASSET_STRATEGY_EVIDENCE.TPP,
  'Medical Strategic Context': ROUTES.ASSET.ASSET_STRATEGY_EVIDENCE.MEDICAL_STRATEGIC_CONTEXT,
}

export const GAP_IDENTIFICATION_SIDEBAR_ROUTES: Record<string, string> = {
  'Evidence Gap Summary':        ROUTES.ASSET.GAP_IDENTIFICATION.EVIDENCE_GAP_SUMMARY.ROOT,
  'Evidence Gap Prioritization': ROUTES.ASSET.GAP_IDENTIFICATION.EVIDENCE_GAP_PRIORITIZATION.ROOT,
}

export const ASSET_SIDEBAR_ITEMS: Record<string, string[]> = {
  'Executive Summary': [],
  'Disease & Treatment Landscape': [
    'Disease Pathophysiology',
    'Treatment Paradigm',
    'Patient Segment',
  ],
  'BMS Asset Strategy': [
    'TPP',
    'Medical Strategic Context',
  ],
  'Competitive Benchmark': [
    'Competitor Overview',
    'Trial Snapshot',
  ],
  'Gap Identification & Prioritization': [
    'Evidence Gap Summary',
    'Evidence Gap Prioritization',
  ],
}
