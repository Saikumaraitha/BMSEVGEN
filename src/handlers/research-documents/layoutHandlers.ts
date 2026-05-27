import type { NavigateFunction, SetURLSearchParams } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';
import { buildPath, ROUTES } from '../../constants/routes';
import type { RdFilterKey } from '../../config/ResearchDocumentsConfig';

interface LayoutHandlerDeps {
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
  setSearchParams: SetURLSearchParams;
  navigate: NavigateFunction;
  assetId: string;
  indicationId: string;
}

export function createLayoutHandlers(deps: LayoutHandlerDeps) {
  const { setSidebarCollapsed, setSearchParams, navigate, assetId, indicationId } = deps;

  const handleSidebarToggle = () => setSidebarCollapsed((prev) => !prev);

  const handleFilterClick = (key: RdFilterKey) => setSearchParams({ filter: key });

  const handlePanelClick = (panel: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('panel', panel);
      return next;
    });

  const handleBackToList = () =>
    navigate(buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.ROOT, { assetId, indicationId }));

  const handleGenerateGaps = () =>
    navigate(buildPath(ROUTES.ASSET.GAP_IDENTIFICATION.ROOT, { assetId, indicationId }));

  const handleAddNoteAction = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('action', 'add-note');
      return next;
    });

  const handleShareAction = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('action', 'share');
      return next;
    });

  const handleDeleteAction = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('action', 'delete');
      return next;
    });

  return {
    handleSidebarToggle,
    handleFilterClick,
    handlePanelClick,
    handleBackToList,
    handleGenerateGaps,
    handleAddNoteAction,
    handleShareAction,
    handleDeleteAction,
  };
}
