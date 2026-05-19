import type { Dispatch, SetStateAction } from 'react';
import type { ResearchNote } from '../../types/research-documents';

interface NoteCardHandlerDeps {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  setEditing: Dispatch<SetStateAction<boolean>>;
  setEditTitle: Dispatch<SetStateAction<string>>;
  setEditContent: Dispatch<SetStateAction<string>>;
  onEdit: (id: string, title: string, content: string) => void;
  onDuplicate: (note: ResearchNote) => void;
  onDelete: (id: string) => void;
  note: ResearchNote;
}

export function createNoteCardHandlers(deps: NoteCardHandlerDeps) {
  const {
    setMenuOpen,
    setEditing,
    setEditTitle,
    setEditContent,
    onEdit,
    onDuplicate,
    onDelete,
    note,
  } = deps;

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleMenuClose = () => setMenuOpen(false);

  const handleEditOpen = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditing(true);
    setMenuOpen(false);
  };

  const handleEditSubmit = (editTitle: string, editContent: string) => {
    onEdit(note.id, editTitle, editContent);
    setEditing(false);
  };

  const handleEditCancel = () => setEditing(false);

  const handleDuplicate = () => {
    onDuplicate(note);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(note.id);
    setMenuOpen(false);
  };

  return {
    handleMenuToggle,
    handleMenuClose,
    handleEditOpen,
    handleEditSubmit,
    handleEditCancel,
    handleDuplicate,
    handleDelete,
  };
}
