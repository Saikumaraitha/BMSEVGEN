import type { ExecutiveSummaryPageData } from '../types/executive-summary'
import api from '../lib/axios'

export async function getExecutiveSummaryData(assetId: string): Promise<ExecutiveSummaryPageData> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockExecutiveSummaryData } = await import('../mocks/executive-summary')
    return mockExecutiveSummaryData
  }
  const { data } = await api.get<ExecutiveSummaryPageData>(`/assets/${assetId}/executive-summary`)
  return data
}
