interface DeleteDocumentModalProps {
  open: boolean;
  docTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

function DeleteDocumentModal({ open, docTitle, onConfirm, onCancel, isDeleting = false }: DeleteDocumentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[400px] max-w-[95vw] px-8 py-7 relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          <i className="bi bi-x-lg text-lg" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-lg font-bold bg-gradient-to-r from-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
            Delete Research Document?
          </h2>

          <p className="text-sm text-neutral-600 leading-relaxed">
            You are about to permanently delete{' '}
            <span className="font-semibold text-neutral-800">"{docTitle}"</span>. All notes and
            content within this document will be removed. This action cannot be undone.
          </p>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-full border border-neutral-300 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteDocumentModal;
