import type { SetURLSearchParams } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';
import type { ResearchNote, ChatMessage, DocumentComment } from '../../types/research-documents';
import { todayDocDate } from '../../utils/dateUtils';

interface WorkspaceHandlerDeps {
  setSearchParams: SetURLSearchParams;
  setNotes: Dispatch<SetStateAction<ResearchNote[]>>;
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setComments: Dispatch<SetStateAction<DocumentComment[]>>;
  setShowAddNote: Dispatch<SetStateAction<boolean>>;
  setShowShare: Dispatch<SetStateAction<boolean>>;
  setShowDownload: Dispatch<SetStateAction<boolean>>;
}

export function createWorkspaceHandlers(deps: WorkspaceHandlerDeps) {
  const {
    setSearchParams,
    setNotes,
    setChatMessages,
    setComments,
    setShowAddNote,
    setShowShare,
    setShowDownload,
  } = deps;

  const handlePanelSwitch = (panel: string) => setSearchParams({ panel });

  const handleAddNote = () => setShowAddNote(true);

  const handleCancelAddNote = () => setShowAddNote(false);

  const handleSaveNote = (title: string, content: string) => {
    setNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        number: prev.length + 1,
        title,
        content,
        date: todayDocDate(),
        author: 'You',
        source: 'manual',
      },
      ...prev,
    ]);
    setShowAddNote(false);
  };

  const handleEditNote = (id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title, content } : n)),
    );
  };

  const handleDeleteNote = (id: string) => {
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
        source: 'manual',
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
        title: 'EvGen AI Note',
        content,
        date: todayDocDate(),
        author: 'EvGen AI',
        source: 'EvGenAI',
        originalQuery: query,
      },
      ...prev,
    ]);
  };

  const handleSendMessage = (content: string, userInitials: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      userInitials,
      timestamp: new Date().toISOString(),
    };
    const aiMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'ai',
      content: 'I am analysing the document context for your query. Please wait for a full response from the backend.',
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const handlePostComment = (content: string, author: string, initials: string, noteId?: string, noteTitle?: string) => {
    const comment: DocumentComment = {
      id: `cmt-${Date.now()}`,
      noteId: noteId ?? '',
      noteTitle: noteTitle ?? '',
      author,
      authorInitials: initials,
      date: todayDocDate(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      content,
      replies: [],
    };
    setComments((prev) => [...prev, comment]);
    if (noteId) {
      setNotes((prev) =>
        prev.map((n) => n.id === noteId ? { ...n, commentCount: (n.commentCount ?? 0) + 1 } : n),
      );
    }
  };

  const handleReply = (parentId: string, content: string, author: string, initials: string) => {
    const reply: DocumentComment = {
      id: `cmt-${Date.now()}`,
      noteId: '',
      noteTitle: '',
      author,
      authorInitials: initials,
      date: todayDocDate(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      content,
    };
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c,
      ),
    );
  };

  const handleShareOpen = () => setShowShare(true);
  const handleShareClose = () => setShowShare(false);
  const handleDownloadToggle = () => setShowDownload((prev) => !prev);

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
  };
}
