import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import type { AccessType, RawResearchDocument, ResearchDocument } from '../../../types/research-documents';
import type { RdFilterKey, RdSortKey } from '../../../config/ResearchDocumentsConfig';

const ACCESS_TYPE_MAP: Record<string, AccessType> = {
  CAN_EDIT:  'Can Edit',
  VIEW_ONLY: 'View Only',
  OWNER:     'My Doc',
};

function deriveInitials(name: string): string {
  return name.split(' ').map((p) => p[0] ?? '').join('').toUpperCase().slice(0, 2);
}

function transformDocument(raw: RawResearchDocument): ResearchDocument {
  return {
    id:           raw.doc_id,
    title:        raw.name,
    description:  raw.description,
    accessType:   ACCESS_TYPE_MAP[raw.access_type] ?? 'View Only',
    owner: {
      name:        raw.owner.name,
      initials:    deriveInitials(raw.owner.name),
      role:        raw.owner.role ?? '',
      avatarColor: '#7c3aed',
    },
    lastEdited:   raw.last_edited || raw.created_at || '',
    lastEditedBy: raw.last_edited_by.name,
    noteCount:    0,
    commentCount: 0,
  };
}
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
        (d.owner?.name ?? '').toLowerCase().includes(term),
    );
  }

  if (sortBy === 'title-asc') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === 'title-desc') result = [...result].sort((a, b) => b.title.localeCompare(a.title));
  else result = [...result].sort((a, b) => b.lastEdited.localeCompare(a.lastEdited));

  return result;
}

function DocumentsList() {
  const { assetId = '', indicationId = '' } = useParams<{ assetId: string; indicationId: string }>();
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
    getResearchDocuments(assetId, indicationId).then((rawDocs) => {
      const docs = rawDocs.map(transformDocument);
      setDocuments(docs);
      setDocCounts({
        all: docs.length,
        'created-by-me': docs.filter((d) => d.accessType === 'My Doc').length,
        'can-edit': docs.filter((d) => d.accessType === 'Can Edit').length,
        'view-only': docs.filter((d) => d.accessType === 'View Only').length,
      });
    });
  }, [assetId, indicationId, setDocCounts]);

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
    indicationId,
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
          <div className="flex flex-col gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onShare={handleShareOpen}
                onDelete={handleDeleteRequest}
                onOpen={handleCardClick}
                onGenerateGaps={handleGenerateGaps}
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
