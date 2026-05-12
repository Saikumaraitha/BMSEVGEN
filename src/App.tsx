import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTE_SEGMENTS } from './constants/routes'
import Home from './pages/Home'
import ExecutiveSummary from './pages/ExecutiveSummary'

import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/common/ProtectedRoute'

import GapIdentification from './pages/GapIdentification'
import EvidenceGapPrioritization from './pages/GapIdentification/EvidenceGapPrioritization'
import EvidenceGapPrioritizationList from './pages/GapIdentification/EvidenceGapPrioritizationList'
import EvidenceGapPrioritizationMatrix from './pages/GapIdentification/EvidenceGapPrioritizationMatrix'
import EvidenceGapSummary from './components/GapIdentification/EvidenceGapSummary'

const S = ROUTE_SEGMENTS

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path={S.HOME} element={<ProtectedRoute><Home /></ProtectedRoute>} />

      {/* All asset routes — auth guarded at the layout level */}
      <Route path={S.ASSET_ROOT} element={<ProtectedRoute />}>

        {/* Header Tab 1: Executive Summary */}
        <Route path={S.EXECUTIVE_SUMMARY} element={<ExecutiveSummary />} />

       

        {/* Header Tab 5: Gap Identification & Prioritization */}
        <Route path={S.GAP_IDENTIFICATION} element={<GapIdentification />}>
          <Route path={S.EVIDENCE_GAP_SUMMARY}        element={<EvidenceGapSummary />} />
          <Route path={S.EVIDENCE_GAP_PRIORITIZATION} element={<EvidenceGapPrioritization />}>
            <Route index element={<Navigate to={S.LIST} replace />} />
            <Route path={S.LIST}   element={<EvidenceGapPrioritizationList />} />
            <Route path={S.MATRIX} element={<EvidenceGapPrioritizationMatrix />} />
          </Route>
        </Route>

        {/* Catch-all: redirect unmatched deep URLs to home */}
        <Route path="*" element={<Navigate to={S.HOME} replace />} />

      </Route>

      {/* Global catch-all */}
      <Route path="*" element={<Navigate to={S.HOME} replace />} />
    </Routes>
  )
}

export default App
