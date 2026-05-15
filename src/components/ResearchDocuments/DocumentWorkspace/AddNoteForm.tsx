interface AddNoteFormProps {
  title: string;
  content: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

function AddNoteForm({ title, content, onTitleChange, onContentChange, onSave, onCancel }: AddNoteFormProps) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => onTitleChange(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => onContentChange(e.target.value);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave(title.trim(), content.trim());
  };

  return (
    <form onSubmit={handleSave} className="border border-brand-primary rounded-xl p-4 bg-indigo-50/30 flex flex-col gap-3">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Note title"
        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
        required
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Note content..."
        rows={4}
        className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
        required
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 rounded-lg text-sm font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors"
        >
          Save Note
        </button>
      </div>
    </form>
  );
}

export default AddNoteForm;
