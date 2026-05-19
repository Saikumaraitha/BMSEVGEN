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
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <NoteIcon className="w-4 h-4 text-rd-section-label flex-shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold text-neutral-700">Notes</span>
        {totalNoteCount > 0 && (
          <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold leading-none flex-shrink-0">
            {totalNoteCount}
          </span>
        )}
        <div className="flex-1" />
        {isEditing && (
          <button
            type="button"
            onClick={onAddNote}
            className="inline-flex items-center gap-1 pl-1 pr-3 py-0.5 rounded-full border border-brand-primary bg-white text-brand-primary-dark text-xs font-medium hover:bg-primary-tint-04 transition-colors whitespace-nowrap"
          >
            <span className="w-5 h-5 rounded-full bg-exec-icon-bg text-brand-primary flex items-center justify-center flex-shrink-0">
              <i className="bi bi-plus-lg text-xs" aria-hidden="true" />
            </span>
            Add Note
          </button>
        )}
      </div>

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
        <div className="flex flex-col gap-3">
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
