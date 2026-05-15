import { useState } from 'react';
import type { ResearchNote } from '../../../types/research-documents';

interface NoteCardProps {
  note: ResearchNote;
  onEdit: (id: string, title: string, content: string) => void;
}

function NoteCard({ note, onEdit }: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleEditSubmit = () => {
    onEdit(note.id, editTitle, editContent);
    setEditing(false);
  };

  const handleEditCancel = () => setEditing(false);

  if (editing) {
    return (
      <div className="px-4 pt-4 pb-4 flex flex-col gap-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={4}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={handleEditCancel} className="px-4 py-1.5 rounded-lg text-sm font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleEditSubmit} className="px-4 py-1.5 rounded-lg text-sm font-medium bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors">
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-3 pb-4">
      {/* Top row: badge flush-left + date + menu flush-right */}
      <div className="flex items-center pr-2 mb-3">
        <span className="h-[18px] flex items-center px-3 rounded-r-full text-2xs font-bold font-sans bg-rd-note-tag-bg text-rd-note-tag-text uppercase tracking-wider shrink-0">
          NOTE {note.number}
        </span>
        <div className="flex-1" />
        <span className="text-2xs font-sans text-rd-section-label">{note.date}</span>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1 rounded hover:bg-neutral-100 text-rd-section-label transition-colors"
            aria-label="Note options"
          >
            <i className="bi bi-three-dots-vertical text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Content with horizontal padding */}
      <div className="px-4">
        <h3 className="text-sm font-bold font-heading text-text-dark mb-2">{note.title}</h3>
        <p className="text-xs font-normal font-sans text-rd-description leading-relaxed">{note.content}</p>
        <p className="text-2xs font-sans text-rd-section-label mt-3">
          <span className="font-semibold text-rd-owner-name">{note.author}</span>
          <span className="mx-1">·</span>
          {note.source === 'EvGenAI' ? 'via EvGenAi' : 'via manual entry'}
        </p>
      </div>
    </div>
  );
}

export default NoteCard;
