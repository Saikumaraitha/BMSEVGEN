import type { Asset, AssetsMetadataResponse, CreateIepRequest, CreateIepResponse, GetIepsParams, GetIepsResponse, HomeData } from '../types/home'
import api from '../lib/axios'
import { awsSigV4Api } from './http'

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
    return mockHomeData.assets.find(asset => asset.id === assetId) || mockHomeData.assets[0]
  }
  const { data } = await api.get<Asset>(`/home/${assetId}`)
  return data
}

export async function getAssetsMetadata(): Promise<AssetsMetadataResponse> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? '').replace(/\/$/, '')
  return awsSigV4Api.get<AssetsMetadataResponse>(`${base}/api/v1/get_assets_metadata`)
}

export async function getIeps(params: GetIepsParams = {}): Promise<GetIepsResponse> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? '').replace(/\/$/, '')
  return awsSigV4Api.get<GetIepsResponse>(`${base}/api/v1/get_ieps`, { query: params as Record<string, string | number | boolean | null | undefined> })
}

export async function createIep(payload: CreateIepRequest): Promise<CreateIepResponse> {
  const base = (import.meta.env.VITE_AI_ENGINE_BASE_URL ?? '').replace(/\/$/, '')
  return awsSigV4Api.post<CreateIepResponse>(`${base}/api/v1/create_iep`, payload)
}
