import { useEffect, useState } from 'react';
import type { RawResearchDocument } from '../../types/research-documents';
import { getResearchDocuments } from '../../services/research-documents';
import { formatDocDate } from '../../utils/dateUtils';

interface AddToNotesModalProps {
  assetId: string;
  indicationId: string;
  onSelect: (documentId: string | 'new') => void;
  onClose: () => void;
}

function AddToNotesModal({ assetId, indicationId, onSelect, onClose }: AddToNotesModalProps) {
  const [documents, setDocuments] = useState<RawResearchDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getResearchDocuments(assetId, indicationId)
      .then(setDocuments)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [assetId, indicationId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">Add to Notes</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
            aria-label="Close"
          >
            <i className="bi bi-x text-xl leading-none" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-sm text-neutral-600">Where would you like to save this note?</p>

          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              Existing Documents
            </p>

            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <p className="text-xs text-red-500 text-center py-2">Failed to load documents.</p>
            ) : documents.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-2">No documents found.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {documents.map((doc) => (
                  <button
                    key={doc.doc_id}
                    type="button"
                    onClick={() => onSelect(doc.doc_id)}
                    className="flex items-center gap-3 px-4 py-3 border border-neutral-200 rounded-xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <i className="bi bi-file-earmark-text text-neutral-500 text-sm group-hover:text-brand-primary transition-colors" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate group-hover:text-brand-primary transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {doc.last_edited_by.name} &middot; Last edited {formatDocDate(doc.last_edited)}
                      </p>
                    </div>
                    <i className="bi bi-chevron-right text-neutral-300 text-xs flex-shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Create new */}
          <button
            type="button"
            onClick={() => onSelect('new')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-brand-primary text-brand-primary text-sm font-semibold hover:bg-brand-primary/5 transition-colors"
          >
            <i className="bi bi-plus text-base leading-none" aria-hidden="true" />
            Create as Note in New Document
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddToNotesModal;
