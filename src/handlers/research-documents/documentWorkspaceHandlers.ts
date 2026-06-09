import type { SetURLSearchParams } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import type {
  ResearchNote,
  ChatMessage,
  DocumentComment,
  CreateCommentPayload,
  RawComment,
} from "../../types/research-documents";
import { todayDocDate } from "../../utils/dateUtils";
import {
  createAddNote,
  createComment,
  deleteNote,
  UpdateNote,
  getDocumentComments,
  getNoteComments,
} from "../../services/research-documents";
import type { CreateAddNotePayload } from "../../types/research-documents";

interface WorkspaceHandlerDeps {
  setSearchParams: SetURLSearchParams;
  setNotes: Dispatch<SetStateAction<ResearchNote[]>>;
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setComments: Dispatch<SetStateAction<DocumentComment[]>>;
  comments: DocumentComment[];
  setShowAddNote: Dispatch<SetStateAction<boolean>>;
  setShowShare: Dispatch<SetStateAction<boolean>>;
  setShowDownload: Dispatch<SetStateAction<boolean>>;
  docId?: string;
  setFilterNoteId: Dispatch<SetStateAction<string | null>>;
}

function mapRawCommentToUI(
  raw: RawComment,
  noteTitle?: string,
): DocumentComment {
  let replies: DocumentComment[] = [];

  if (raw.replies) {
    if (Array.isArray(raw.replies)) {
      replies = raw.replies.map((r) => mapRawCommentToUI(r, ""));
    } else {
      replies = [mapRawCommentToUI(raw.replies, "")];
    }
  }

  return {
    id: raw.comment_id,
    noteId: raw.note_id || "",
    noteTitle: noteTitle || raw.note_title || "",
    author: raw.author_name,
    authorInitials: raw.author_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
    authorColor: "bg-brand-primary",
    authorTextColor: "text-white",
    date: raw.created_at,
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    content: raw.content,
    replies,
  };
}

export function createWorkspaceHandlers(deps: WorkspaceHandlerDeps) {
  const {
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
  } = deps;

  const handlePanelSwitch = (panel: string) => setSearchParams({ panel });

  const handleAddNote = () => setShowAddNote(true);

  const handleCancelAddNote = () => setShowAddNote(false);

  const handleSaveNote = async (
    title: string,
    content: string,
    origin: "manual" | "EvGen_AI",
  ) => {
    if (docId) {
      try {
        const payload: CreateAddNotePayload = { title, content, origin };
        const resp = await createAddNote(docId, payload);
        const d = resp.data;
        const mapped: ResearchNote = {
          id: d.note_id,
          number: 0,
          title: d.title,
          content: d.content,
          date: d.created_at,
          author: d.author_name,
          source: d.origin === "manual" ? "manual" : "EvGenAI",
          commentCount: d.comments_count,
        };
        setNotes((prev) =>
          [mapped, ...prev].map((n, i) => ({ ...n, number: i + 1 })),
        );
        setShowAddNote(false);
        return;
      } catch (err) {
        console.error("createAddNote failed, falling back to local note", err);
      }
    }

    setNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        number: prev.length + 1,
        title,
        content,
        date: todayDocDate(),
        author: "You",
        source: "manual",
      },
      ...prev,
    ]);
    setShowAddNote(false);
  };

  const handleEditNote = async (id: string, title: string, content: string) => {
    if (docId) {
      try {
        const payload = { title, content };
        const resp = await UpdateNote(docId, id, payload);
        const d = resp.data;
        setNotes((prev) =>
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  title: d.title,
                  content: d.content,
                  date: d.updated_at,
                  author: d.attribution?.author_name ?? n.author,
                  source: d.origin === "MANUAL" ? "manual" : "EvGenAI",
                }
              : n,
          ),
        );
        return;
      } catch (err) {
        console.error(
          "UpdateNote API failed, falling back to local update",
          err,
        );
      }
    }

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title, content } : n)),
    );
  };

  const handleDeleteNote = async (id: string) => {
    if (docId) {
      try {
        await deleteNote(docId, id);
        setNotes((prev) => {
          const updated = prev.filter((n) => n.id !== id);
          return updated.map((n, i) => ({ ...n, number: i + 1 }));
        });
        setComments((prev) => prev.filter((c) => c.noteId !== id));
        return;
      } catch (err) {
        console.error(
          "deleteNote API failed, falling back to local removal",
          err,
        );
      }
    }

    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      return updated.map((n, i) => ({ ...n, number: i + 1 }));
    });
    setComments((prev) => prev.filter((c) => c.noteId !== id));
  };

  const handleDuplicateNote = (note: ResearchNote) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === note.id);
      const copy: ResearchNote = {
        ...note,
        id: `note-${Date.now()}`,
        number: prev.length + 1,
        title: `${note.title} (Copy)`,
        date: todayDocDate(),
        source: "manual",
      };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next.map((n, i) => ({ ...n, number: i + 1 }));
    });
  };

  const handleAddToNotes = (content: string, query: string) => {
    setNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        number: prev.length + 1,
        title: "EvGen AI Note",
        content,
        date: todayDocDate(),
        author: "EvGen AI",
        source: "EvGenAI",
        originalQuery: query,
      },
      ...prev,
    ]);
  };

  const handleSendMessage = (content: string, userInitials: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      userInitials,
      timestamp: new Date().toISOString(),
    };
    const aiMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "ai",
      content:
        "I am analysing the document context for your query. Please wait for a full response from the backend.",
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const handlePostComment = async (
    content: string,
    author: string,
    initials: string,
    noteId?: string,
    noteTitle?: string,
  ) => {
    if (docId && noteId) {
      try {
        const payload: CreateCommentPayload = {
          document_id: docId,
          note_id: noteId,
          comment: content,
        };
        await createComment(payload);
        
        // Reload comments to ensure consistency with backend
        const rawComments = await getNoteComments(docId, noteId);
        const mapped = rawComments.map((c) =>
          mapRawCommentToUI({ ...c, note_id: noteId }, noteTitle ?? ""),
        );
        setComments(mapped);
        
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? { ...n, commentCount: (n.commentCount ?? 0) + 1 }
              : n,
          ),
        );
        return;
      } catch (err) {
        console.error(
          "createComment API failed, falling back to local comment",
          err,
        );
      }
    }

    const comment: DocumentComment = {
      id: `cmt-${Date.now()}`,
      noteId: noteId ?? "",
      noteTitle: noteTitle ?? "",
      author,
      authorInitials: initials,
      authorColor: "bg-brand-primary",
      authorTextColor: "text-white",
      date: todayDocDate(),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content,
      replies: [],
    };
    setComments((prev) => [...prev, comment]);
    if (noteId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? { ...n, commentCount: (n.commentCount ?? 0) + 1 }
            : n,
        ),
      );
    }
  };

  const handleReply = async (
    parentId: string,
    content: string,
    author: string,
    initials: string,
    noteId?: string,
  ) => {
    if (docId && noteId) {
      try {
        const payload: CreateCommentPayload = {
          document_id: docId,
          note_id: noteId,
          comment: content,
          parent_comment_id: parentId,
        };
        await createComment(payload);
        
        // Reload comments to get the reply with proper nesting
        const parentComment = comments.find(c => c.id === parentId);
        const rawComments = await getNoteComments(docId, noteId);
        const mapped = rawComments.map((c) =>
          mapRawCommentToUI({ ...c, note_id: noteId }, parentComment?.noteTitle ?? ""),
        );
        setComments(mapped);
        return;
      } catch (err) {
        console.error(
          "createComment reply API failed, falling back to local reply",
          err,
        );
      }
    }

    const reply: DocumentComment = {
      id: `cmt-${Date.now()}`,
      noteId: "",
      noteTitle: "",
      author,
      authorInitials: initials,
      authorColor: "bg-brand-primary",
      authorTextColor: "text-white",
      date: todayDocDate(),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content,
    };
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies ?? []), reply] }
          : c,
      ),
    );
  };

  const handleShareOpen = () => setShowShare(true);
  const handleShareClose = () => setShowShare(false);
  const handleDownloadToggle = () => setShowDownload((prev) => !prev);

  const handleLoadAllComments = async () => {
    if (!docId) return;
    try {
      const rawComments = await getDocumentComments(docId);
      const mapped = rawComments.map((c) => mapRawCommentToUI(c));
      setComments(mapped);
      setFilterNoteId(null);
    } catch (err) {
      console.error("Failed to load all comments", err);
    }
  };

  const handleLoadNoteComments = async (noteId: string, noteTitle: string) => {
    if (!docId) return;
    try {
      const rawComments = await getNoteComments(docId, noteId);
      const mapped = rawComments.map((c) =>
        mapRawCommentToUI({ ...c, note_id: noteId }, noteTitle),
      );
      setComments(mapped);
      setFilterNoteId(noteId);
    } catch (err) {
      console.error("Failed to load note comments", err);
    }
  };

  return {
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
  };
}
