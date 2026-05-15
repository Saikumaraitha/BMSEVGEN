import { useState } from 'react';

interface CreateDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
  isCreating?: boolean;
}

function CreateDocumentModal({ open, onClose, onCreate, isCreating = false }: CreateDocumentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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
      <div className="bg-white rounded-2xl shadow-xl w-[440px] max-w-[95vw] px-10 py-8 relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          <i className="bi bi-x-lg text-lg" aria-hidden="true" />
        </button>

        <h2 className="text-lg font-bold text-center text-neutral-800 mb-7">Create New Document</h2>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              <span className="text-red-500 mr-0.5">*</span>Document Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 rounded-full border border-brand-primary text-brand-primary text-sm font-medium hover:bg-primary-tint-04 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="px-7 py-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateDocumentModal;
