import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { ResearchDocument } from '../../../types/research-documents';
import type { RdFilterKey, RdSortKey } from '../../../config/ResearchDocumentsConfig';
import { getResearchDocuments } from '../../../services/research-documents';
import { createDocumentsListHandlers } from '../../../handlers/research-documents/documentsListHandlers';
import { useResearchDocumentsContext } from '../../../contexts/ResearchDocumentsContext';
import DocumentsListHeader from './DocumentsListHeader';
import DocumentCard from './DocumentCard';
import ShareModal from './ShareModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import CreateDocumentModal from './CreateDocumentModal';

function filterDocuments(
  docs: ResearchDocument[],
  filter: RdFilterKey,
  searchTerm: string,
  sortBy: RdSortKey,
): ResearchDocument[] {
  let result = docs;

  if (filter === 'created-by-me') result = result.filter((d) => d.accessType === 'My Doc');
  else if (filter === 'can-edit') result = result.filter((d) => d.accessType === 'Can Edit');
  else if (filter === 'view-only') result = result.filter((d) => d.accessType === 'View Only');

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (d) =>
        d.title.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        d.owner.name.toLowerCase().includes(term),
    );
  }

  if (sortBy === 'title-asc') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === 'title-desc') result = [...result].sort((a, b) => b.title.localeCompare(a.title));
  else result = [...result].sort((a, b) => b.lastEdited.localeCompare(a.lastEdited));

  return result;
}

function DocumentsList() {
  const { assetId = '' } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setDocCounts } = useResearchDocumentsContext();

  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<RdSortKey>('last-edited');
  const [shareOpen, setShareOpen] = useState<string | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<ResearchDocument | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    getResearchDocuments(assetId).then((docs) => {
      setDocuments(docs);
      setDocCounts({
        all: docs.length,
        'created-by-me': docs.filter((d) => d.accessType === 'My Doc').length,
        'can-edit': docs.filter((d) => d.accessType === 'Can Edit').length,
        'view-only': docs.filter((d) => d.accessType === 'View Only').length,
      });
    });
  }, [assetId, setDocCounts]);

  const activeFilter = (searchParams.get('filter') ?? 'all') as RdFilterKey;

  const {
    handleSearch,
    handleSortChange,
    handleShareOpen,
    handleShareClose,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleCardClick,
    handleCreateNew,
    handleCreateDocument,
    handleGenerateGaps,
  } = createDocumentsListHandlers({
    setSearchParams,
    setSearchTerm,
    setSortBy,
    setShareOpen,
    setDeleteDoc,
    setDocuments,
    setShowCreateModal,
    setIsCreating,
    navigate,
    assetId,
  });

  const filteredDocuments = filterDocuments(documents, activeFilter, searchTerm, sortBy);

  return (
    <div className="flex flex-col h-full">
      <DocumentsListHeader
        count={filteredDocuments.length}
        sortBy={sortBy}
        searchTerm={searchTerm}
        onSortChange={handleSortChange}
        onCreateNew={handleCreateNew}
        onSearchChange={handleSearch}
      />

      <div className="flex-1 overflow-auto px-6 pt-4 pb-6">
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-neutral-400">
            <i className="bi bi-file-earmark-text text-4xl mb-2" aria-hidden="true" />
            <p className="text-sm">No documents found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onShare={handleShareOpen}
                onDelete={handleDeleteRequest}
                onGenerateGaps={handleGenerateGaps}
                onOpen={handleCardClick}
              />
            ))}
          </div>
        )}
      </div>

      <ShareModal
        open={shareOpen !== null}
        docId={shareOpen ?? ''}
        docTitle={documents.find((d) => d.id === shareOpen)?.title ?? ''}
        onClose={handleShareClose}
        onSave={handleShareClose}
      />
      <DeleteConfirmModal
        open={deleteDoc !== null}
        docTitle={deleteDoc?.title ?? ''}
        onConfirm={() => deleteDoc && handleDeleteConfirm(deleteDoc.id)}
        onCancel={handleDeleteCancel}
      />
      <CreateDocumentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateDocument}
        isCreating={isCreating}
      />
    </div>
  );
}

export default DocumentsList;
