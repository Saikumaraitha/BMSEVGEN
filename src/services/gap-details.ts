import type { GapDetailsData } from '../types/evidence-gap-summary/gap-details'
import api from '../lib/axios'

export async function getGapDetailsData(assetId: string): Promise<GapDetailsData> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockGapDetailsData } = await import('../mocks/gap-details')
    return mockGapDetailsData
  }
  const { data } = await api.get<GapDetailsData>(`/assets/${assetId}/gap-details`)
  return data
}
