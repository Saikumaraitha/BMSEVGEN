import type { NavigateFunction, SetURLSearchParams } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';
import type { ResearchDocument } from '../../types/research-documents';
import type { RdFilterKey, RdSortKey } from '../../config/ResearchDocumentsConfig';
import { buildPath, ROUTES } from '../../constants/routes';
import { createResearchDocument, deleteResearchDocument } from '../../services/research-documents';

interface DocumentsListHandlerDeps {
  setSearchParams: SetURLSearchParams;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setSortBy: Dispatch<SetStateAction<RdSortKey>>;
  setShareOpen: Dispatch<SetStateAction<string | null>>;
  setDeleteDoc: Dispatch<SetStateAction<ResearchDocument | null>>;
  setDocuments: Dispatch<SetStateAction<ResearchDocument[]>>;
  setShowCreateModal: Dispatch<SetStateAction<boolean>>;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
  navigate: NavigateFunction;
  assetId: string;
  indicationId: string;
  loadDocuments: () => void;
}

export function createDocumentsListHandlers(deps: DocumentsListHandlerDeps) {
  const {
    setSearchParams,
    setSearchTerm,
    setSortBy,
    setShareOpen,
    setDeleteDoc,
    setShowCreateModal,
    setIsCreating,
    setIsDeleting,
    navigate,
    assetId,
    indicationId,
    loadDocuments,
  } = deps;

  const handleFilterChange = (key: RdFilterKey) => setSearchParams({ filter: key });

  const handleSearch = (term: string) => setSearchTerm(term);

  const handleSortChange = (key: RdSortKey) => setSortBy(key);

  const handleShareOpen = (docId: string) => setShareOpen(docId);

  const handleShareClose = () => setShareOpen(null);

  const handleDeleteRequest = (doc: ResearchDocument) => setDeleteDoc(doc);

  const handleDeleteCancel = () => setDeleteDoc(null);

  const handleDeleteConfirm = async (docId: string) => {
    setIsDeleting(true);
    try {
      await deleteResearchDocument(docId);
      setDeleteDoc(null);
      loadDocuments();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = (docId: string) =>
    navigate(buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.DOC, { assetId, indicationId, docId }));

  const handleEditClick = (docId: string) =>
    navigate(
      buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.DOC, { assetId, indicationId, docId }) + '?action=edit',
    );

  const handleCreateNew = () => setShowCreateModal(true);

  const handleCreateDocument = async (name: string, description: string) => {
    setIsCreating(true);
    try {
      const rawDoc = await createResearchDocument(indicationId, name, description);
      setShowCreateModal(false);
      navigate(
        buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.DOC, { assetId, indicationId, docId: rawDoc.doc_id }),
        { state: { title: name, description } },
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateGaps = (docId: string) =>
    navigate(
      buildPath(ROUTES.ASSET.GAP_IDENTIFICATION.ROOT, { assetId, indicationId }) + `?docId=${docId}`,
    );

  return {
    handleFilterChange,
    handleSearch,
    handleSortChange,
    handleShareOpen,
    handleShareClose,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleCardClick,
    handleEditClick,
    handleCreateNew,
    handleCreateDocument,
    handleGenerateGaps,
  };
}
