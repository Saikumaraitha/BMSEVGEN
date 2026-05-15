import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import type { ResearchNote, ChatMessage, DocumentComment, ResearchDocumentData } from '../../../types/research-documents';
import { getDocumentData } from '../../../services/research-documents';
import { createWorkspaceHandlers } from '../../../handlers/research-documents/documentWorkspaceHandlers';
import { useResearchDocumentsContext } from '../../../contexts/ResearchDocumentsContext';
import { buildPath, ROUTES } from '../../../constants/routes';
import WorkspaceToolbar from './WorkspaceToolbar';
import NotesPanel from './NotesPanel';
import EvGenAIPanel from './EvGenAIPanel';
import CommentsPanel from './CommentsPanel';
import ShareModal from '../DocumentsList/ShareModal';
import DeleteDocumentModal from './DeleteDocumentModal';

function DocumentWorkspace() {
  const { assetId = '', docId = '' } = useParams<{ assetId: string; docId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { title?: string; description?: string } | null;
  const { setNoteCount, setCommentCount, setHasUnsavedChanges, setOnSaveAndExit } = useResearchDocumentsContext();

  const [data, setData] = useState<ResearchDocumentData | null>(null);
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addNoteTitle, setAddNoteTitle] = useState('');
  const [addNoteContent, setAddNoteContent] = useState('');

  useEffect(() => {
    getDocumentData(assetId, docId).then((d) => {
      const resolved = locationState?.title
        ? { ...d, document: { ...d.document, title: locationState.title, description: locationState.description ?? d.document.description } }
        : d;
      setData(resolved);
      setNotes(resolved.notes);
      setChatMessages(resolved.chatMessages);
      setComments(resolved.comments);
      setNoteCount(resolved.notes.length);
      setCommentCount(resolved.comments.length);
    });
  }, [assetId, docId, setNoteCount, setCommentCount]);

  useEffect(() => {
    setNoteCount(notes.length);
  }, [notes.length, setNoteCount]);

  useEffect(() => {
    setCommentCount(comments.length);
  }, [comments.length, setCommentCount]);

  // Watch URL action params from sidebar
  useEffect(() => {
    const action = searchParams.get('action');
    if (!action) return;
    const next = new URLSearchParams(searchParams);
    next.delete('action');
    if (action === 'add-note') {
      setShowAddNote(true);
    } else if (action === 'share') {
      setShowShare(true);
    } else if (action === 'delete') {
      setShowDeleteModal(true);
    }
    setSearchParams(next, { replace: true });
  }, [searchParams.get('action')]);

  const activePanel = searchParams.get('panel') ?? 'evgen';

  const {
    handlePanelSwitch,
    handleAddNote,
    handleCancelAddNote,
    handleSaveNote,
    handleEditNote,
    handleAddToNotes,
    handleSendMessage,
    handlePostComment,
    handleReply,
    handleShareOpen,
    handleShareClose,
    handleDownloadToggle,
  } = createWorkspaceHandlers({
    setSearchParams,
    setNotes,
    setChatMessages,
    setComments,
    setShowAddNote,
    setShowShare,
    setShowDownload,
  });

  useEffect(() => {
    setHasUnsavedChanges(showAddNote);
  }, [showAddNote, setHasUnsavedChanges]);

  useEffect(() => {
    const backPath = buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.ROOT, { assetId });
    setOnSaveAndExit(() => () => {
      if (addNoteTitle.trim() && addNoteContent.trim()) {
        handleSaveNote(addNoteTitle.trim(), addNoteContent.trim());
      }
      setAddNoteTitle('');
      setAddNoteContent('');
      setHasUnsavedChanges(false);
      navigate(backPath);
    });
    return () => setOnSaveAndExit(null);
  }, [addNoteTitle, addNoteContent, assetId]);

  const handleSearchChange = (term: string) => setSearchTerm(term);

  const handleDownloadSelect = (type: 'word' | 'pdf') => {
    setShowDownload(false);
    console.info('Download', type, docId);
  };

  const handleDeleteDoc = () => setShowDeleteModal(true);
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    navigate(buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.ROOT, { assetId }));
  };

  const filteredNotes = searchTerm.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : notes;

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        <i className="bi bi-arrow-clockwise animate-spin text-2xl" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Center panel */}
      <div className="flex flex-col flex-1 min-w-0 border-r border-neutral-200">
        <WorkspaceToolbar
          document={data.document}
          noteCount={notes.length}
          searchTerm={searchTerm}
          showDownload={showDownload}
          onAddNote={handleAddNote}
          onSearchChange={handleSearchChange}
          onDownloadSelect={handleDownloadSelect}
          onShare={handleShareOpen}
          onDelete={handleDeleteDoc}
          onToggleDownload={handleDownloadToggle}
        />

        <div className="flex-1 overflow-auto p-5">
          <NotesPanel
            notes={filteredNotes}
            showAddNote={showAddNote}
            isFiltered={searchTerm.trim() !== ''}
            addNoteTitle={addNoteTitle}
            addNoteContent={addNoteContent}
            onAddNoteTitleChange={setAddNoteTitle}
            onAddNoteContentChange={setAddNoteContent}
            onSave={(title, content) => {
              setAddNoteTitle('');
              setAddNoteContent('');
              handleSaveNote(title, content);
            }}
            onCancel={() => {
              setAddNoteTitle('');
              setAddNoteContent('');
              handleCancelAddNote();
            }}
            onEdit={handleEditNote}
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col w-80 xl:w-96 flex-shrink-0">
        <div className="flex border-b border-neutral-200 bg-tab-bg">
          <button
            type="button"
            onClick={() => handlePanelSwitch('evgen')}
            className={[
              'flex-1 flex items-center justify-center py-3 text-sm font-sans border-b-2 transition-colors',
              activePanel !== 'comments'
                ? 'border-brand-primary text-brand-primary-dark font-bold'
                : 'border-transparent text-rd-section-label font-normal',
            ].join(' ')}
          >
            EvGen AI
          </button>
          <button
            type="button"
            onClick={() => handlePanelSwitch('comments')}
            className={[
              'flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-sans border-b-2 transition-colors',
              activePanel === 'comments'
                ? 'border-brand-primary text-brand-primary-dark font-bold'
                : 'border-transparent text-rd-section-label font-normal',
            ].join(' ')}
          >
            Comments
            {comments.length > 0 && (
              <span className={['text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center', activePanel === 'comments' ? 'bg-brand-primary text-white' : 'bg-neutral-200 text-neutral-600'].join(' ')}>
                {comments.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activePanel === 'comments' ? (
            <CommentsPanel
              comments={comments}
              commentHeader={data.commentHeader}
              onPost={handlePostComment}
              onReply={handleReply}
            />
          ) : (
            <EvGenAIPanel
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onAddToNotes={handleAddToNotes}
              userInitials={data.document.owner.initials}
              userFirstName={data.document.owner.name.split(' ')[0]}
            />
          )}
        </div>
      </div>

      <ShareModal open={showShare} docId={docId} docTitle={data.document.title} onClose={handleShareClose} onSave={handleShareClose} />
      <DeleteDocumentModal
        open={showDeleteModal}
        docTitle={data.document.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

export default DocumentWorkspace;
