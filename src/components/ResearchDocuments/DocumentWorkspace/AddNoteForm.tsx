import TrashIcon from '../../../assets/icons/trash.svg?react';

interface AddNoteFormProps {
  title: string;
  content: string;
  date: string;
  author: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onCancel: () => void;
}

function AddNoteForm({ title, content, date, author, onTitleChange, onContentChange, onCancel }: AddNoteFormProps) {
  return (
    <div className="border border-dashed border-brand-primary rounded-xl bg-rd-new-note-bg pt-3 pb-4">
      {/* Top row: NEW NOTE tag + date + trash */}
      <div className="flex items-center px-4 mb-3">
        <span className="h-[18px] flex items-center px-2.5 rounded-full text-3xs font-bold font-sans bg-brand-primary text-white uppercase tracking-wider shrink-0">
          New Note
        </span>
        <div className="flex-1" />
        <span className="text-2xs font-sans text-rd-section-label mr-1">{date}</span>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded hover:bg-red-50 text-rd-trash transition-colors"
          aria-label="Cancel new note"
        >
          <TrashIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Inner input box */}
      <div className="mx-4 border border-brand-primary rounded-lg bg-white px-3 py-2.5 mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Note Title"
          autoFocus
          className="w-full bg-transparent border-none outline-none text-sm font-semibold font-sans text-rd-note-title placeholder:text-rd-note-title/35 placeholder:font-semibold"
        />
        <div className="border-t border-neutral-100 my-2" />
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Add research notes or key observations"
          rows={4}
          className="w-full bg-transparent border-none outline-none resize-none text-xs font-normal font-sans text-rd-note-body leading-relaxed placeholder:text-rd-new-note-placeholder/35 placeholder:font-normal"
        />
      </div>

      {/* Footer */}
      <div className="px-4">
        <p className="text-3xs font-normal font-sans text-rd-section-label flex items-center gap-1">
          <span>{author}</span>
          <span>·</span>
          <span className="text-rd-tag-my-doc-text">via manual entry</span>
        </p>
      </div>
    </div>
  );
}

export default AddNoteForm;
