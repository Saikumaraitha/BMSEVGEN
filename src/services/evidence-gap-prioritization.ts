import type { EvidenceGapPrioritizationData } from '../types/evidence-gap-prioritization'
import api from '../lib/axios'

export async function getEvidenceGapPrioritizationData(assetId: string): Promise<EvidenceGapPrioritizationData> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockEvidenceGapPrioritizationData } = await import('../mocks/evidence-gap-prioritization')
    return mockEvidenceGapPrioritizationData
  }
  const { data } = await api.get<EvidenceGapPrioritizationData>(`/assets/${assetId}/evidence-gap-prioritization`)
  return data
}
