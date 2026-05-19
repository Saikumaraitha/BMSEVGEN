import type { EvidenceGapSummaryData } from '../types/evidence-gap-summary'
import api from '../lib/axios'

export async function getEvidenceGapSummaryData(assetId: string): Promise<EvidenceGapSummaryData> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockEvidenceGapSummaryData } = await import('../mocks/evidence-gap-summary')
    return mockEvidenceGapSummaryData
  }
  const { data } = await api.get<EvidenceGapSummaryData>(`/assets/${assetId}/evidence-gap-summary`)
  return data
}
