import { useCallback, useEffect, useRef, useState } from "react";
import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import type {
  ResearchNote,
  ChatMessage,
  DocumentComment,
  ResearchDocumentData,
  RawComment,
} from "../../../types/research-documents";
import {
  getDocumentData,
  getDocumentNotes,
  updateResearchDocument,
  deleteResearchDocument,
  getDocumentComments,
} from "../../../services/research-documents";
import { buildWorkspaceData } from "../../../handlers/research-documents/documentDataHelpers";
import { todayDocDate } from "../../../utils/dateUtils";
import { createWorkspaceHandlers } from "../../../handlers/research-documents/documentWorkspaceHandlers";
import { useResearchDocumentsContext } from "../../../contexts/ResearchDocumentsContext";
import { buildPath, ROUTES } from "../../../constants/routes";
import WorkspaceToolbar from "./WorkspaceToolbar";
import NotesPanel from "./NotesPanel";
import EvGenAIPanel from "./EvGenAIPanel";
import CommentsPanel from "./CommentsPanel";
import ShareModal from "../DocumentsList/ShareModal";
import DeleteDocumentModal from "./DeleteDocumentModal";

function DocumentWorkspace() {
  const {
    assetId = "",
    indicationId = "",
    docId = "",
  } = useParams<{ assetId: string; indicationId: string; docId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as {
    title?: string;
    description?: string;
    pendingNote?: { title: string; content: string };
  } | null;
  const {
    setNoteCount,
    setCommentCount,
    setHasUnsavedChanges,
    setOnSaveAndExit,
    setCanEdit,
    setCanDelete,
  } = useResearchDocumentsContext();

  const [data, setData] = useState<ResearchDocumentData | null>(null);
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [filterNoteId, setFilterNoteId] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [addNoteTitle, setAddNoteTitle] = useState("");
  const [addNoteContent, setAddNoteContent] = useState("");

  const [activateEdit, setActivateEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Document edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [editedNotes, setEditedNotes] = useState<
    Map<string, { title: string; content: string }>
  >(new Map());

  const loadWorkspace = useCallback(() => {
    Promise.all([
      getDocumentData(assetId, docId),
      getDocumentNotes(docId),
    ]).then(([rawDoc, rawNotesRes]) => {
      const workspace = buildWorkspaceData(rawDoc, rawNotesRes);
      const resolved = locationState?.title
        ? {
            ...workspace,
            document: {
              ...workspace.document,
              title: locationState.title,
              description:
                locationState.description ?? workspace.document.description,
            },
          }
        : workspace;
      setData(resolved);
      setCanEdit(["My Doc", "Can Edit"].includes(resolved.document.accessType));
      setCanDelete(resolved.document.accessType === "My Doc");
      setChatMessages(resolved.chatMessages);
      setCommentCount(0);

      if (locationState?.pendingNote) {
        const injected: ResearchNote = {
          id: `note-${Date.now()}`,
          number: resolved.notes.length + 1,
          title: locationState.pendingNote.title,
          content: locationState.pendingNote.content,
          date: todayDocDate(),
          author: "You",
          source: "EvGenAI",
        };
        const withInjected = [injected, ...resolved.notes].map((n, i) => ({
          ...n,
          number: i + 1,
        }));
        setNotes(withInjected);
        setNoteCount(withInjected.length);
      } else {
        setNotes(resolved.notes);
        setNoteCount(resolved.notes.length);
      }
    });
  }, [
    assetId,
    docId,
    locationState,
    setData,
    setChatMessages,
    setComments,
    setNotes,
    setNoteCount,
    setCommentCount,
    setCanEdit,
    setCanDelete,
  ]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  useEffect(() => {
    if (docId) {
      getDocumentComments(docId).then((rawComments) => {
        const mapped = rawComments.map((c) => {
          let replies: DocumentComment[] = [];
          if (c.replies) {
            if (Array.isArray(c.replies)) {
              replies = c.replies.map((r: RawComment) => ({
                id: r.comment_id,
                noteId: "",
                noteTitle: "",
                author: r.author_name,
                authorInitials: r.author_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase(),
                authorColor: "bg-brand-primary",
                authorTextColor: "text-white",
                date: r.created_at,
                time: new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                content: r.content,
              }));
            }
          }

          return {
            id: c.comment_id,
            noteId: c.note_id || "",
            noteTitle: c.note_title || "",
            author: c.author_name,
            authorInitials: c.author_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase(),
            authorColor: "bg-brand-primary",
            authorTextColor: "text-white",
            date: c.created_at,
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            content: c.content,
            replies,
          };
        });
        setComments(mapped);
        setCommentCount(mapped.length);
      });
    }
  }, [docId]);

  useEffect(() => {
    setNoteCount(notes.length);
  }, [notes.length, setNoteCount]);

  useEffect(() => {
    setCommentCount(comments.length);
  }, [comments.length, setCommentCount]);

  // Watch URL action params from sidebar
  useEffect(() => {
    const action = searchParams.get("action");
    if (!action) return;
    const next = new URLSearchParams(searchParams);
    next.delete("action");
    if (action === "add-note") {
      setIsEditing(true);
      setShowAddNote(true);
    } else if (action === "share") {
      setShowShare(true);
    } else if (action === "delete") {
      setShowDeleteModal(true);
    } else if (action === "edit") {
      setActivateEdit(true);
    }
    setSearchParams(next, { replace: true });
  }, [searchParams.get("action")]);

  useEffect(() => {
    if (activateEdit && data) {
      setOriginalTitle(data.document.title);
      setOriginalDescription(data.document.description);
      setEditTitle(data.document.title);
      setEditDescription(data.document.description);
      setIsEditing(true);
      setActivateEdit(false);
    }
  }, [activateEdit, data]);

  const activePanel = searchParams.get("panel") ?? "evgen";

  const handleCommentsClick = (noteId: string, noteTitle: string) => {
    handlePanelSwitch("comments");
    handleLoadNoteComments(noteId, noteTitle);
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
    handleLoadAllComments,
    handleLoadNoteComments,
  } = createWorkspaceHandlers({
    setSearchParams,
    setNotes,
    setChatMessages,
    setComments,
    comments,
    setShowAddNote,
    setShowShare,
    setShowDownload,
    docId,
    setFilterNoteId,
  });

  // Unsaved changes: 1 for title, 1 for description, 1 for pending new note, + edited notes
  const unsavedChangesCount =
    [
      isEditing && editTitle !== originalTitle,
      isEditing && editDescription !== originalDescription,
      isEditing &&
        (addNoteTitle.trim().length > 0 || addNoteContent.trim().length > 0),
    ].filter(Boolean).length + (isEditing ? editedNotes.size : 0);

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
    setEditTitle("");
    setEditDescription("");
    setOriginalTitle("");
    setOriginalDescription("");
    setShowAddNote(false);
    setAddNoteTitle("");
    setAddNoteContent("");
    setEditedNotes(new Map());
  };

  const handleSaveChanges = async () => {
    // Save pending new note if it has content
    if (addNoteTitle.trim() && addNoteContent.trim()) {
      await handleSaveNote(
        addNoteTitle.trim(),
        addNoteContent.trim(),
        "manual",
      );
    }
    setAddNoteTitle("");
    setAddNoteContent("");
    setShowAddNote(false);

    // Save edited notes
    for (const [noteId, { title, content }] of editedNotes.entries()) {
      await handleEditNote(noteId, title, content);
    }
    setEditedNotes(new Map());

    if (
      data &&
      (editTitle !== originalTitle || editDescription !== originalDescription)
    ) {
      await updateResearchDocument(docId, editTitle, editDescription);
      setData((prev) =>
        prev
          ? {
              ...prev,
              document: {
                ...prev.document,
                title: editTitle,
                description: editDescription,
              },
            }
          : null,
      );
    }
    setIsEditing(false);
    setEditTitle("");
    setEditDescription("");
    setOriginalTitle("");
    setOriginalDescription("");
    loadWorkspace();
  };

  const handleSaveChangesRef = useRef(handleSaveChanges);
  handleSaveChangesRef.current = handleSaveChanges;

  useEffect(() => {
    const backPath = buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.ROOT, {
      assetId,
      indicationId,
    });
    setOnSaveAndExit(async () => {
      await handleSaveChangesRef.current();
      navigate(backPath);
    });
    return () => setOnSaveAndExit(null);
  }, [assetId, indicationId, navigate, setOnSaveAndExit]);

  const handleSearchChange = (term: string) => setSearchTerm(term);

  const handleDownloadSelect = (type: "word" | "pdf") => {
    setShowDownload(false);
    console.info("Download", type, docId);
  };

  const handleDeleteDoc = () => setShowDeleteModal(true);
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteResearchDocument(docId);
      setShowDeleteModal(false);
      navigate(
        buildPath(ROUTES.ASSET.RESEARCH_DOCUMENTS.ROOT, {
          assetId,
          indicationId,
        }),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddNoteClick = () => {
    if (!isEditing) {
      handleEditStart();
    }
    handleAddNote();
  };

  const handleNoteEdit = (id: string, title: string, content: string) => {
    if (isEditing) {
      // Track edited notes in edit mode
      setEditedNotes((prev) => {
        const updated = new Map(prev);
        updated.set(id, { title, content });
        return updated;
      });
      // Update local state immediately for UI
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, title, content } : n)),
      );
    } else {
      // Save immediately when not in edit mode
      handleEditNote(id, title, content);
    }
  };

  const filteredNotes = searchTerm.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : notes;

  const addNoteDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const addNoteAuthor = data?.document.owner.name ?? "Ava Sharma";

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-400">
        <i
          className="bi bi-arrow-clockwise animate-spin text-2xl"
          aria-hidden="true"
        />
      </div>
    );
  }

  const canEdit = ["My Doc", "Can Edit"].includes(data.document.accessType);
  const canDelete = data.document.accessType === "My Doc";

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
        canEdit={canEdit}
        canDelete={canDelete}
        onEditStart={handleEditStart}
        onEditDocument={handleEditStart}
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
              isFiltered={searchTerm.trim() !== ""}
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
                setAddNoteTitle("");
                setAddNoteContent("");
                handleCancelAddNote();
              }}
              onEdit={handleNoteEdit}
              onEditChange={isEditing ? handleNoteEdit : undefined}
              onDelete={handleDeleteNote}
              onDuplicate={handleDuplicateNote}
              onCommentsClick={(noteId, noteTitle) =>
                handleCommentsClick(noteId, noteTitle)
              }
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col w-80 xl:w-96 flex-shrink-0">
          <div className="flex border-b border-neutral-200 bg-tab-bg">
            <button
              type="button"
              onClick={() => handlePanelSwitch("evgen")}
              className={[
                "flex-1 flex items-center justify-center py-3 text-sm font-sans border-b-2 transition-colors",
                activePanel !== "comments"
                  ? "border-brand-primary text-brand-primary-dark font-bold"
                  : "border-transparent text-rd-section-label font-normal",
              ].join(" ")}
            >
              EvGen AI
            </button>
            <button
              type="button"
              onClick={() => handlePanelSwitch("comments")}
              className={[
                "flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-sans border-b-2 transition-colors",
                activePanel === "comments"
                  ? "border-brand-primary text-brand-primary-dark font-bold"
                  : "border-transparent text-rd-section-label font-normal",
              ].join(" ")}
            >
              Comments
              {(() => {
                const displayCount = filterNoteId
                  ? comments.filter((c) => c.noteId === filterNoteId).length
                  : comments.length;
                return (
                  displayCount > 0 && (
                    <span
                      className={[
                        "text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                        activePanel === "comments"
                          ? "bg-brand-primary text-white"
                          : "bg-neutral-200 text-neutral-600",
                      ].join(" ")}
                    >
                      {displayCount}
                    </span>
                  )
                );
              })()}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activePanel === "comments" ? (
              <CommentsPanel
                comments={comments}
                filterNoteId={filterNoteId}
                filterNoteTitle={
                  notes.find((n) => n.id === filterNoteId)?.title ?? ""
                }
                onClearFilter={handleLoadAllComments}
                onPost={(content, author, initials, noteId, noteTitle) =>
                  handlePostComment(
                    content,
                    author,
                    initials,
                    noteId,
                    noteTitle,
                  )
                }
                onReply={(parentId, content, author, initials, noteId) =>
                  handleReply(parentId, content, author, initials, noteId)
                }
              />
            ) : (
              <EvGenAIPanel
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onAddToNotes={handleAddToNotes}
                userInitials={data.document.owner.initials}
                userFirstName={data.document.owner.name.split(" ")[0]}
              />
            )}
          </div>
        </div>
      </div>

      <ShareModal
        open={showShare}
        docId={docId}
        docTitle={data.document.title}
        iepId={indicationId}
        sharedWith={data.document.shared_with ?? []}
        onClose={handleShareClose}
        onSave={() => {
          handleShareClose();
          loadWorkspace();
        }}
      />
      <DeleteDocumentModal
        open={showDeleteModal}
        docTitle={data.document.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default DocumentWorkspace;
