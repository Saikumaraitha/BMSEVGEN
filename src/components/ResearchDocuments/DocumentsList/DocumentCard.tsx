import type { ResearchDocument } from '../../../types/research-documents';
import { formatDocDate } from '../../../utils/dateUtils';

interface DocumentCardProps {
  document: ResearchDocument;
  onShare: (docId: string) => void;
  onDelete: (doc: ResearchDocument) => void;
  onGenerateGaps: (docId: string) => void;
  onOpen: (docId: string) => void;
}

const ACCESS_STYLES: Record<string, string> = {
  'My Doc':    'bg-badge-congress-bg text-rd-tag-my-doc-text',
  'Can Edit':  'bg-badge-planning-bg text-rd-tag-can-edit-text',
  'View Only': 'bg-rd-tag-view-only-bg text-rd-tag-view-only-text',
};

function DocumentCard({ document, onShare, onDelete, onGenerateGaps, onOpen }: DocumentCardProps) {
  const isViewOnly = document.accessType === 'View Only';
  const isMyDoc = document.accessType === 'My Doc';

  return (
    <div className="bg-white border border-rd-card-border rounded-xl p-4 hover:shadow-sm transition-shadow">
      {/* Row 1: badge + circular action icons */}
      <div className="flex items-center justify-between mb-2">
        <span className={`px-3 py-0.5 rounded-full text-2xs font-medium ${ACCESS_STYLES[document.accessType] ?? ''}`}>
          {document.accessType}
        </span>

        <div className="flex items-center gap-1.5">
          {!isViewOnly && (
            <button
              type="button"
              onClick={() => onOpen(document.id)}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-rd-card-border text-rd-section-label hover:bg-neutral-100 hover:text-brand-primary transition-colors"
              aria-label="Edit"
            >
              <i className="bi bi-pencil text-xs" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-rd-card-border text-rd-section-label hover:bg-neutral-100 transition-colors"
            aria-label="Print"
          >
            <i className="bi bi-printer text-xs" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onShare(document.id)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-rd-card-border text-rd-section-label hover:bg-neutral-100 hover:text-brand-primary transition-colors"
            aria-label="Share"
          >
            <i className="bi bi-share text-xs" aria-hidden="true" />
          </button>
          {isMyDoc && (
            <button
              type="button"
              onClick={() => onDelete(document)}
              className="w-7 h-7 flex items-center justify-center rounded-full border border-rd-card-border text-rd-trash hover:bg-red-50 transition-colors"
              aria-label="Delete"
            >
              <i className="bi bi-trash3 text-xs" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: title */}
      <button
        type="button"
        onClick={() => onOpen(document.id)}
        className="text-sm font-semibold text-brand-primary-dark hover:underline text-left w-full mb-1.5"
      >
        {document.title}
      </button>

      {/* Row 3: description */}
      {document.description && (
        <p className="text-xs font-normal font-sans text-rd-description leading-relaxed line-clamp-2 mb-3">
          {document.description}
        </p>
      )}

      {/* Row 4: owner meta + generate gaps */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-rd-avatar-bg text-rd-avatar-text text-3xs font-bold flex-shrink-0">
            {document.owner.initials}
          </div>
          <span className="text-2xs font-semibold font-sans text-rd-owner-name">{document.owner.name}</span>
          <span className="text-2xs text-rd-section-label">·</span>
          <span className="text-2xs font-medium font-sans text-rd-section-label">{document.owner.role}</span>
          <span className="text-2xs text-rd-section-label">·</span>
          <span className="text-2xs font-medium font-sans text-rd-section-label whitespace-nowrap">Last edited {formatDocDate(document.lastEdited)}</span>
        </div>

        <div className="relative group flex-shrink-0">
          <button
            type="button"
            onClick={isViewOnly ? undefined : () => onGenerateGaps(document.id)}
            disabled={isViewOnly}
            className={[
              'px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap',
              isViewOnly
                ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
                : 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
            ].join(' ')}
          >
            Generate Gaps
          </button>
          {isViewOnly && (
            <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-neutral-800 text-white text-2xs rounded px-2 py-1 whitespace-nowrap z-10">
              View Only — cannot generate gaps
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentCard;
