import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import type { ResearchNote, ChatMessage, DocumentComment, ResearchDocumentData } from '../../../types/research-documents';
import { getDocumentData } from '../../../services/research-documents';
import { todayDocDate } from '../../../utils/dateUtils';
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
  const { assetId = '', indicationId = '', docId = '' } = useParams<{ assetId: string; indicationId: string; docId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { title?: string; description?: string; pendingNote?: { title: string; content: string } } | null;
  const { setNoteCount, setCommentCount, setHasUnsavedChanges, setOnSaveAndExit } = useResearchDocumentsContext();

  const [data, setData] = useState<ResearchDocumentData | null>(null);
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [filterNoteId, setFilterNoteId] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addNoteTitle, setAddNoteTitle] = useState('');
  const [addNoteContent, setAddNoteContent] = useState('');

  // Document edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalDescription, setOriginalDescription] = useState('');

  useEffect(() => {
    getDocumentData(assetId, docId).then((d) => {
      const resolved = locationState?.title
        ? { ...d, document: { ...d.document, title: locationState.title, description: locationState.description ?? d.document.description } }
        : d;
      setData(resolved);
      setChatMessages(resolved.chatMessages);
      setComments(resolved.comments);
      setCommentCount(resolved.comments.length);

      if (locationState?.pendingNote) {
        const injected: ResearchNote = {
          id: `note-${Date.now()}`,
          number: resolved.notes.length + 1,
          title: locationState.pendingNote.title,
          content: locationState.pendingNote.content,
          date: todayDocDate(),
          author: 'You',
          source: 'EvGenAI',
        };
        const withInjected = [injected, ...resolved.notes].map((n, i) => ({ ...n, number: i + 1 }));
        setNotes(withInjected);
        setNoteCount(withInjected.length);
      } else {
        setNotes(resolved.notes);
        setNoteCount(resolved.notes.length);
      }
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
      setIsEditing(true);
      setShowAddNote(true);
    } else if (action === 'share') {
      setShowShare(true);
    } else if (action === 'delete') {
      setShowDeleteModal(true);
    }
    setSearchParams(next, { replace: true });
  }, [searchParams.get('action')]);

  const activePanel = searchParams.get('panel') ?? 'evgen';

  const handleCommentsClick = (noteId: string) => {
    handlePanelSwitch('comments');
    setFilterNoteId(noteId);
  };

  const {
    handlePanelSwitch,
    handleAddNote,
    handleCancelAddNote,
    handleSaveNote,
    handleEditNote,
    handleDeleteNote,
    handleDuplicateNote,
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

  // Unsaved changes: 1 for title, 1 for description, 1 for pending new note
  const unsavedChangesCount = [
    isEditing && editTitle !== originalTitle,
    isEditing && editDescription !== originalDescription,
    isEditing && (addNoteTitle.trim().length > 0 || addNoteContent.trim().length > 0),
  ].filter(Boolean).length;

  useEffect(() => {
    setHasUnsavedChanges(isEditing);
  }, [isEditing, setHasUnsavedChanges]);

  const handleEditStart = () => {
    if (!data) return;
    setOriginalTitle(data.document.title);
    setOriginalDescription(data.document.description);
    setEditTitle(data.document.title);
    setEditDescription(data.document.description);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditDescription('');
    setOriginalTitle('');
    setOriginalDescription('');
    setShowAddNote(false);
    setAddNoteTitle('');
    setAddNoteContent('');
  };

  const handleSaveChanges = () => {
    // Save pending new note if it has content
    if (addNoteTitle.trim() && addNoteContent.trim()) {
      handleSaveNote(addNoteTitle.trim(), addNoteContent.trim());
    }
    setAddNoteTitle('');
    setAddNoteContent('');
    setShowAddNote(false);

    // Persist title/description changes into local data state
    if (data && (editTitle !== originalTitle || editDescription !== originalDescription)) {
      setData((prev) =>
        prev
          ? { ...prev, document: { ...prev.document, title: editTitle, description: editDescription } }
          : null,
      );
    }
    setIsEditing(false);
    setEditTitle('');
    setEditDescription('');
    setOriginalTitle('');
    setOriginalDescription('');
  };

  useEffect(() => {
    const backPath = buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.ROOT, { assetId, indicationId });
    setOnSaveAndExit(() => () => {
      handleSaveChanges();
      navigate(backPath);
    });
    return () => setOnSaveAndExit(null);
  }, [editTitle, editDescription, addNoteTitle, addNoteContent, assetId]);

  const handleSearchChange = (term: string) => setSearchTerm(term);

  const handleDownloadSelect = (type: 'word' | 'pdf') => {
    setShowDownload(false);
    console.info('Download', type, docId);
  };

  const handleDeleteDoc = () => setShowDeleteModal(true);
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    navigate(buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.ROOT, { assetId, indicationId }));
  };

  const handleAddNoteClick = () => {
    if (!isEditing) {
      handleEditStart();
    }
    handleAddNote();
  };

  const filteredNotes = searchTerm.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : notes;

  const addNoteDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const addNoteAuthor = data?.document.owner.name ?? 'Ava Sharma';

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        <i className="bi bi-arrow-clockwise animate-spin text-2xl" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Full-width toolbar */}
      <WorkspaceToolbar
        document={data.document}
        noteCount={notes.length}
        searchTerm={searchTerm}
        showDownload={showDownload}
        isEditing={isEditing}
        editTitle={editTitle}
        editDescription={editDescription}
        unsavedChangesCount={unsavedChangesCount}
        onEditStart={handleEditStart}
        onTitleChange={setEditTitle}
        onDescriptionChange={setEditDescription}
        onSaveChanges={handleSaveChanges}
        onCancelEdit={handleCancelEdit}
        onSearchChange={handleSearchChange}
        onDownloadSelect={handleDownloadSelect}
        onAddNote={handleAddNoteClick}
        onShare={handleShareOpen}
        onDelete={handleDeleteDoc}
        onToggleDownload={handleDownloadToggle}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Center panel */}
        <div className="flex flex-col flex-1 min-w-0 border-r border-neutral-200">
          <div className="flex-1 overflow-auto p-5">
            <NotesPanel
              notes={filteredNotes}
              showAddNote={showAddNote}
              isFiltered={searchTerm.trim() !== ''}
              isEditing={isEditing}
              totalNoteCount={notes.length}
              addNoteTitle={addNoteTitle}
              addNoteContent={addNoteContent}
              addNoteDate={addNoteDate}
              addNoteAuthor={addNoteAuthor}
              onAddNoteTitleChange={setAddNoteTitle}
              onAddNoteContentChange={setAddNoteContent}
              onAddNote={handleAddNoteClick}
              onCancel={() => {
                setAddNoteTitle('');
                setAddNoteContent('');
                handleCancelAddNote();
              }}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onDuplicate={handleDuplicateNote}
              onCommentsClick={handleCommentsClick}
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
                filterNoteId={filterNoteId}
                filterNoteTitle={notes.find((n) => n.id === filterNoteId)?.title ?? ''}
                onClearFilter={() => setFilterNoteId(null)}
                onPost={(content, author, initials, noteId, noteTitle) =>
                  handlePostComment(content, author, initials, noteId, noteTitle)
                }
                onReply={(parentId, content, author, initials) =>
                  handleReply(parentId, content, author, initials)
                }
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
