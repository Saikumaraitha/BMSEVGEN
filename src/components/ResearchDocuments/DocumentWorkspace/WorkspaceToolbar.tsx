import type { ResearchDocument } from '../../../types/research-documents';
import PdfIcon from '../../../assets/icons/pdf.svg?react';
import { formatDocDate } from '../../../utils/dateUtils';

interface WorkspaceToolbarProps {
  document: ResearchDocument;
  noteCount: number;
  searchTerm: string;
  showDownload: boolean;
  onAddNote: () => void;
  onSearchChange: (term: string) => void;
  onDownloadSelect: (type: 'word' | 'pdf') => void;
  onShare: () => void;
  onDelete: () => void;
  onToggleDownload: () => void;
  onDuplicate?: () => void;
}

function WorkspaceToolbar({
  document,
  noteCount,
  searchTerm,
  showDownload,
  onAddNote,
  onSearchChange,
  onDownloadSelect,
  onShare,
  onDelete,
  onToggleDownload,
  onDuplicate,
}: WorkspaceToolbarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onSearchChange(e.target.value);

  const hasNotes = noteCount > 0;

  return (
    <div className="px-5 py-4 border-b border-neutral-100 bg-white">
      {/* Row 1: title + actions */}
      <div className="flex items-center gap-3">
        <h1 className="flex-1 text-base font-bold text-brand-primary truncate min-w-0">
          {document.title}
        </h1>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onAddNote}
            className="inline-flex items-center gap-2 pl-1 pr-4 py-1 rounded-full border border-brand-primary bg-white text-brand-primary-dark text-sm font-medium hover:bg-primary-tint-04 transition-colors whitespace-nowrap"
          >
            <span className="w-6 h-6 rounded-full bg-exec-icon-bg text-brand-primary flex items-center justify-center flex-shrink-0">
              <i className="bi bi-plus-lg text-xs" aria-hidden="true" />
            </span>
            Add Note
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search within this document"
              className="pl-4 pr-10 py-1.5 w-52 rounded-full bg-rd-search-bg focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-rd-search-placeholder placeholder:italic placeholder:font-normal placeholder:text-placeholder-sm placeholder:font-sans"
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors"
              aria-label="Search"
            >
              <i className="bi bi-search text-xs" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-rd-card-border text-rd-section-label hover:bg-neutral-100 hover:text-brand-primary transition-colors"
            aria-label="Edit title"
          >
            <i className="bi bi-pencil text-sm" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-rd-card-border text-rd-section-label hover:bg-neutral-100 hover:text-brand-primary transition-colors"
            aria-label="Duplicate document"
          >
            <i className="bi bi-files text-sm" aria-hidden="true" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={hasNotes ? onToggleDownload : undefined}
              disabled={!hasNotes}
              className={[
                'w-7 h-7 flex items-center justify-center rounded-lg border transition-colors',
                hasNotes
                  ? 'border-rd-card-border text-rd-section-label hover:bg-neutral-100 hover:text-brand-primary'
                  : 'border-neutral-200 text-neutral-300 cursor-not-allowed',
              ].join(' ')}
              aria-label="Download"
            >
              <PdfIcon className="w-4 h-4" aria-hidden="true" />
            </button>
            {showDownload && hasNotes && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-52 overflow-hidden">
                <button type="button" onClick={() => onDownloadSelect('word')} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <i className="bi bi-file-earmark-word text-blue-600" aria-hidden="true" /> Eport to Word
                </button>
                <button type="button" onClick={() => onDownloadSelect('pdf')} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <i className="bi bi-file-earmark-pdf text-red-600" aria-hidden="true" /> Expot to PDF
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={hasNotes ? onShare : undefined}
            disabled={!hasNotes}
            className={[
              'w-7 h-7 flex items-center justify-center rounded-lg border transition-colors',
              hasNotes
                ? 'border-rd-card-border text-rd-section-label hover:bg-neutral-100 hover:text-brand-primary'
                : 'border-neutral-200 text-neutral-300 cursor-not-allowed',
            ].join(' ')}
            aria-label="Share"
          >
            <i className="bi bi-share text-sm" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-rd-card-border text-rd-trash hover:bg-red-50 transition-colors"
            aria-label="Delete document"
          >
            <i className="bi bi-trash3 text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Row 2: meta info */}
      <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-400 flex-wrap">
        <span className="font-medium text-neutral-600">{document.owner.name}</span>
        <span>·</span>
        <span>{document.owner.role}</span>
        <span>·</span>
        <span>Last edited {formatDocDate(document.lastEdited)}</span>
        <span>·</span>
        <span><span className="font-bold">{noteCount}</span> saved {noteCount === 1 ? 'entry' : 'entries'}</span>
      </div>
    </div>
  );
}

export default WorkspaceToolbar;
