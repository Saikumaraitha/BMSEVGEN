import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTE_SEGMENTS } from './constants/routes'
import Home from './pages/Home'
import ComingSoonAssetPage from './pages/ComingSoonAssetPage'
import ChatAgents from './pages/ChatAgents'
import ResearchDocuments from './pages/ResearchDocuments'
import ResearchDocumentsList from './pages/ResearchDocuments/ResearchDocumentsList'
import DocumentWorkspace from './pages/ResearchDocuments/DocumentWorkspace'

const S = ROUTE_SEGMENTS

function App() {
  return (
    <Routes>
      <Route path={S.HOME} element={<Home />} />

      <Route path={S.ASSET_ROOT}>
        <Route path={S.INDICATION}>

          {/* Chat & Agents */}
          <Route path={S.CHAT_AGENTS} element={<ChatAgents />} />

          {/* Research Workspace */}
          <Route path={S.RESEARCH_DOCUMENTS} element={<ResearchDocuments />}>
            <Route index element={<ResearchDocumentsList />} />
            <Route path={S.DOC_ID} element={<DocumentWorkspace />} />
          </Route>

          {/* Gap Identification & Prioritization — Coming Soon */}
          <Route path={S.GAP_IDENTIFICATION} element={<ComingSoonAssetPage activeTab="Gap Identification & Prioritization" />} />

        </Route>

        <Route path="*" element={<Navigate to={S.HOME} replace />} />
      </Route>

      <Route path="*" element={<Navigate to={S.HOME} replace />} />
    </Routes>
  )
}

export default App
