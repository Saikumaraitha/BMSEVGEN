import { useState, useRef, useEffect } from 'react';
import type { ResearchDocument } from '../../../types/research-documents';
import { formatDocDate } from '../../../utils/dateUtils';
import ExportIcon from '../../../assets/icons/export.svg?react';
import ShareIcon from '../../../assets/icons/share.svg?react';
import TrashIcon from '../../../assets/icons/trash.svg?react';
import PdfIcon from '../../../assets/icons/pdf.svg?react';

interface DocumentCardProps {
  document: ResearchDocument;
  onShare: (docId: string) => void;
  onDelete: (doc: ResearchDocument) => void;
  onOpen: (docId: string) => void;
}

const ACCESS_STYLES: Record<string, string> = {
  'My Doc':    'bg-badge-congress-bg text-rd-tag-my-doc-text',
  'Can Edit':  'bg-badge-planning-bg text-rd-tag-can-edit-text',
  'View Only': 'bg-rd-tag-view-only-bg text-rd-tag-view-only-text',
};

function DocumentCard(props: DocumentCardProps) {
  const doc = props.document;
  const { onShare, onDelete, onOpen } = props;

  const isViewOnly = doc.accessType === 'View Only';
  const isMyDoc = doc.accessType === 'My Doc';

  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showExport) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExport(false);
      }
    };
    window.document.addEventListener('mousedown', handler);
    return () => window.document.removeEventListener('mousedown', handler);
  }, [showExport]);

  const handleExportSelect = (type: 'pdf' | 'word') => {
    setShowExport(false);
    console.info('Export', type, doc.id);
  };

  return (
    <div className="bg-white border border-rd-card-border rounded-xl p-4 hover:shadow-sm transition-shadow">
      {/* Row 1: title + badge (left) · action icons (right) */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => onOpen(doc.id)}
            className="text-sm font-semibold font-sans text-brand-primary hover:underline text-left truncate"
          >
            {doc.title}
          </button>
          <span className={`px-2.5 py-0.5 rounded-full text-2xs font-medium shrink-0 ${ACCESS_STYLES[doc.accessType] ?? ''}`}>
            {doc.accessType}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!isViewOnly && (
            <button
              type="button"
              onClick={() => onOpen(doc.id)}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-rd-card-border text-rd-section-label hover:bg-neutral-100 hover:text-brand-primary transition-colors"
              aria-label="Edit"
            >
              <i className="bi bi-pencil text-xs" aria-hidden="true" />
            </button>
          )}

          {/* Export with dropdown */}
          <div ref={exportRef} className="relative">
            <button
              type="button"
              onClick={() => setShowExport((prev) => !prev)}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-rd-card-border text-rd-section-label hover:bg-neutral-100 transition-colors"
              aria-label="Export"
            >
              <ExportIcon className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            {showExport && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-44 overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleExportSelect('pdf')}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-sans text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <PdfIcon className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                  Export to PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleExportSelect('word')}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-sans text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <i className="bi bi-file-earmark-word text-blue-600 flex-shrink-0" aria-hidden="true" />
                  Export to Word
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onShare(doc.id)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-rd-card-border text-rd-section-label hover:bg-neutral-100 hover:text-brand-primary transition-colors"
            aria-label="Share"
          >
            <ShareIcon className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          {isMyDoc && (
            <button
              type="button"
              onClick={() => onDelete(doc)}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-rd-card-border text-rd-trash hover:bg-red-50 transition-colors"
              aria-label="Delete"
            >
              <TrashIcon className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: owner avatar + meta */}
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-rd-avatar-bg text-rd-avatar-text text-3xs font-bold flex-shrink-0">
          {doc.owner?.initials}
        </div>
        <span className="text-2xs font-semibold font-sans text-rd-owner-name">{doc.owner?.name}</span>
        <span className="text-2xs text-rd-section-label">·</span>
        <span className="text-2xs font-medium font-sans text-rd-section-label">{doc.owner?.role}</span>
        <span className="text-2xs text-rd-section-label">·</span>
        <span className="text-2xs font-medium font-sans text-rd-section-label whitespace-nowrap">
          Last edited {formatDocDate(doc.lastEdited)}
        </span>
      </div>

      {/* Row 3: description */}
      {doc.description && (
        <p className="text-xs font-normal font-sans text-rd-description leading-relaxed line-clamp-2 mb-3">
          {doc.description}
        </p>
      )}

    </div>
  );
}

export default DocumentCard;
