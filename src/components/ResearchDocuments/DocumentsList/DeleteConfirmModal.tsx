interface DeleteConfirmModalProps {
  open: boolean;
  docTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

function DeleteConfirmModal({ open, docTitle, onConfirm, onCancel, isDeleting = false }: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <i className="bi bi-trash3 text-red-600 text-base" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">Delete Document</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Are you sure you want to delete{' '}
              <span className="font-medium text-neutral-800">"{docTitle}"</span>? This action cannot
              be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-sm font-medium border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
