import { useEffect, useState } from 'react';

interface CreateDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
  isCreating?: boolean;
  initialName?: string;
  initialDescription?: string;
  title?: string;
  submitLabel?: string;
}

function CreateDocumentModal({
  open,
  onClose,
  onCreate,
  isCreating = false,
  initialName,
  initialDescription,
  title = 'Create New Document',
  submitLabel = 'Create',
}: CreateDocumentModalProps) {
  const [name, setName] = useState(initialName ?? '');
  const [description, setDescription] = useState(initialDescription ?? '');

  useEffect(() => {
    if (open) {
      setName(initialName ?? '');
      setDescription(initialDescription ?? '');
    }
  }, [open, initialName, initialDescription]);

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), description.trim());
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[597px] h-[395px] max-w-[95vw] px-10 py-6 relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          <i className="bi bi-x-lg text-lg" aria-hidden="true" />
        </button>

        <h2 className="text-lg font-bold text-center text-neutral-800 mb-7">{title}</h2>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Document Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="w-full px-3 py-2.5 bg-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Description <em className="font-normal">(optional)</em>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 bg-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 rounded-[5px] border border-[#D70000] text-[#D70000] text-sm font-medium transition-colors"
            style={{ fontFamily: 'Roboto' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="px-7 py-2 rounded-[5px] text-[#FFF] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Roboto', background: 'linear-gradient(180deg, #E43BE0 0%, #B500B1 100%)' }}
          >
            {isCreating ? `${submitLabel}…` : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateDocumentModal;
