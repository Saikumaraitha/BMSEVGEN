import type { ResearchNote } from '../../../types/research-documents';
import NoteIcon from '../../../assets/icons/note.svg?react';
import AddNoteForm from './AddNoteForm';
import NoteCard from './NoteCard';
import {
  RD_NOTES_EMPTY_TITLE,
  RD_NOTES_EMPTY_DESCRIPTION,
  RD_NOTES_NO_RESULTS_TITLE,
  RD_NOTES_NO_RESULTS_DESCRIPTION,
} from '../../../constants/researchDocuments';

interface NotesPanelProps {
  notes: ResearchNote[];
  showAddNote: boolean;
  isFiltered: boolean;
  isEditing: boolean;
  totalNoteCount: number;
  addNoteTitle: string;
  addNoteContent: string;
  addNoteDate: string;
  addNoteAuthor: string;
  onAddNoteTitleChange: (v: string) => void;
  onAddNoteContentChange: (v: string) => void;
  onAddNote: () => void;
  onCancel: () => void;
  onEdit: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (note: ResearchNote) => void;
  onCommentsClick: (noteId: string) => void;
}

function NotesPanel({
  notes,
  showAddNote,
  isFiltered,
  isEditing,
  totalNoteCount,
  addNoteTitle,
  addNoteContent,
  addNoteDate,
  addNoteAuthor,
  onAddNoteTitleChange,
  onAddNoteContentChange,
  onAddNote,
  onCancel,
  onEdit,
  onDelete,
  onDuplicate,
  onCommentsClick,
}: NotesPanelProps) {
  const isEmpty = notes.length === 0 && !showAddNote;

  return (
    <div className="flex flex-col gap-3">

      {/* Notes list */}
      {isEmpty && isFiltered ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-12 text-center">
          <i className="bi bi-search text-3xl text-neutral-300" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-neutral-600">{RD_NOTES_NO_RESULTS_TITLE}</p>
            <p className="text-xs text-neutral-400">{RD_NOTES_NO_RESULTS_DESCRIPTION}</p>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-12 text-center">
          <NoteIcon className="w-10 h-10 text-rd-section-label" aria-hidden="true" />
          <div className="flex flex-col gap-1.5 max-w-xs">
            <p className="text-sm font-semibold text-neutral-700">{RD_NOTES_EMPTY_TITLE}</p>
            <p className="text-xs text-neutral-400 leading-relaxed">{RD_NOTES_EMPTY_DESCRIPTION}</p>
          </div>
        </div>
      ) : (
        <div className="border border-rd-card-border rounded-xl bg-white overflow-hidden divide-y divide-rd-divider">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isEditing={isEditing}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onCommentsClick={onCommentsClick}
            />
          ))}
        </div>
      )}

      {showAddNote && (
        <AddNoteForm
          title={addNoteTitle}
          content={addNoteContent}
          date={addNoteDate}
          author={addNoteAuthor}
          onTitleChange={onAddNoteTitleChange}
          onContentChange={onAddNoteContentChange}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}

export default NotesPanel;
