import { ROUTES } from '../constants/routes'

export const ASSET_NAV_ROUTES: Record<string, string> = {
  'Chat & Agents':                       ROUTES.ASSET.CHAT_AGENTS,
  'Research Workspace':                  ROUTES.ASSET.RESEARCH_DOCUMENTS.ROOT,
  'Gap Identification & Prioritization': ROUTES.ASSET.GAP_IDENTIFICATION.ROOT,
}

export const ASSET_SIDEBAR_ITEMS: Record<string, string[]> = {
  'Chat & Agents':                       [],
  'Research Workspace':                  [],
  'Gap Identification & Prioritization': [],
}
