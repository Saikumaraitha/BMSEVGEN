interface UnsavedChangesModalProps {
  open: boolean;
  onExitWithoutSaving: () => void;
  onSaveAndExit: () => void;
  onClose: () => void;
}

function UnsavedChangesModal({ open, onExitWithoutSaving, onSaveAndExit, onClose }: UnsavedChangesModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-[400px] max-w-[95vw] px-8 py-7 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          <i className="bi bi-x-lg text-lg" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <i className="bi bi-exclamation-circle text-brand-primary text-xl" aria-hidden="true" />
            <h2 className="text-lg font-bold text-brand-primary">Unsaved Changes</h2>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">
            You have unsaved changes.<br />
            Please save your work before leaving this page.
          </p>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={onExitWithoutSaving}
              className="px-5 py-2 rounded-full border border-brand-primary text-brand-primary text-sm font-medium hover:bg-primary-tint-04 transition-colors whitespace-nowrap"
            >
              Exit Without Saving
            </button>
            <button
              type="button"
              onClick={onSaveAndExit}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Save &amp; Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnsavedChangesModal;
