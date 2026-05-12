import type { Asset, HomeData } from '../types/home'
import api from '../lib/axios'

export async function getAssetsData(): Promise<HomeData> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockHomeData } = await import('../mocks/home')
    return mockHomeData
  }
  const { data } = await api.get<HomeData>('/home')
  return data
}

export async function getAssetDetails(assetId: string): Promise<Asset> {
  if (import.meta.env.VITE_MOCK_ENABLED === 'true') {
    const { mockHomeData } = await import('../mocks/home');
    return mockHomeData.assets.find(asset => asset.id === assetId) || mockHomeData.assets[0] // Return the matching asset or fallback to the first one
  }
  const { data } = await api.get<Asset>(`/home/${assetId}`)
  return data
}
