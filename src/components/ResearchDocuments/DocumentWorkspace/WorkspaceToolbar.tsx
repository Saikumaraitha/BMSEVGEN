import type { ResearchDocument } from '../../../types/research-documents';
import PdfIcon from '../../../assets/icons/pdf.svg?react';
import ExportIcon from '../../../assets/icons/export.svg?react';
import ShareIcon from '../../../assets/icons/share.svg?react';
import TrashIcon from '../../../assets/icons/trash.svg?react';
import SearchIcon from '../../../assets/icons/search.svg?react';
import { formatDocDate } from '../../../utils/dateUtils';

interface WorkspaceToolbarProps {
  document: ResearchDocument;
  noteCount: number;
  searchTerm: string;
  showDownload: boolean;
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  unsavedChangesCount: number;
  onEditStart: () => void;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onSaveChanges: () => void;
  onCancelEdit: () => void;
  onSearchChange: (term: string) => void;
  onDownloadSelect: (type: 'word' | 'pdf') => void;
  onAddNote: () => void;
  onShare: () => void;
  onDelete: () => void;
  onToggleDownload: () => void;
}

function WorkspaceToolbar({
  document,
  noteCount,
  searchTerm,
  showDownload,
  isEditing,
  editTitle,
  editDescription,
  unsavedChangesCount,
  onEditStart,
  onTitleChange,
  onDescriptionChange,
  onSaveChanges,
  onCancelEdit,
  onSearchChange,
  onDownloadSelect,
  onAddNote,
  onShare,
  onDelete,
  onToggleDownload,
}: WorkspaceToolbarProps) {
  const hasNotes = noteCount > 0;

  if (isEditing) {
    return (
      <>
        {/* Editing banner */}
        <div className="flex items-center px-5 py-2.5 bg-rd-edit-banner-bg border-b border-rd-card-border">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="w-2 h-2 rounded-full bg-brand-primary-dark flex-shrink-0" />
            <span className="text-xs font-semibold font-sans text-brand-primary-dark whitespace-nowrap">Editing Document</span>
            <span className="text-xs font-medium font-sans text-rd-edit-hint truncate">Changes are not saved until you click save</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <span className="font-sans text-brand-primary whitespace-nowrap" style={{ fontSize: 'var(--text-detail-link)' }}>
              <span className="font-bold">{unsavedChangesCount}</span>
              <span className="font-normal"> unsaved {unsavedChangesCount === 1 ? 'change' : 'changes'}</span>
            </span>
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-1.5 rounded-full border border-rd-cancel-border text-rd-cancel-text text-2xs font-semibold font-sans hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSaveChanges}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-primary text-white text-2xs font-semibold font-sans hover:bg-brand-primary-dark transition-colors"
            >
              <i className="bi bi-check-lg" aria-hidden="true" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Edit fields row — title | description | owner info side by side */}
        <div className="px-5 py-4 border-b border-neutral-100 bg-white flex items-center gap-4">
          <div className="w-[220px] flex-shrink-0">
            <label className="block text-3xs font-bold font-sans text-neutral-500 uppercase tracking-widest mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full text-brand-primary-dark font-bold font-sans text-sm border border-rd-card-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-3xs font-bold font-sans text-neutral-500 uppercase tracking-widest mb-1">
              Description
            </label>
            <input
              type="text"
              value={editDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full text-rd-description font-medium font-sans text-xs border border-rd-card-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex-shrink-0 text-right min-w-[160px]">
            <p className="text-3xs font-semibold font-sans text-rd-owner-name">{document.owner.name}</p>
            <p className="text-3xs font-semibold font-sans text-rd-section-label">{document.owner.role}</p>
            <p className="text-3xs font-semibold font-sans text-rd-section-label mt-0.5">Last edited {formatDocDate(document.lastEdited)}</p>
            <p className="text-3xs font-semibold font-sans text-rd-section-label">
              <span className="font-bold">{noteCount}</span> saved {noteCount === 1 ? 'entry' : 'entries'}
            </p>
          </div>
        </div>
      </>
    );
  }

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
            className="inline-flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full border border-brand-primary bg-white text-brand-primary-dark text-xs font-medium font-sans hover:bg-primary-tint-04 transition-colors whitespace-nowrap"
          >
            <span className="w-5 h-5 rounded-full bg-exec-icon-bg text-brand-primary flex items-center justify-center flex-shrink-0">
              <i className="bi bi-plus-lg text-xs" aria-hidden="true" />
            </span>
            Add Note
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search within this document"
              className="pl-4 pr-10 py-1.5 w-52 rounded-full bg-rd-search-bg focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-rd-search-placeholder placeholder:italic placeholder:font-normal placeholder:text-placeholder-sm placeholder:font-sans"
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors"
              aria-label="Search"
            >
              <SearchIcon className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={onEditStart}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-rd-card-border text-rd-section-label hover:bg-neutral-100 hover:text-brand-primary transition-colors"
            aria-label="Edit document"
          >
            <i className="bi bi-pencil text-sm" aria-hidden="true" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={hasNotes ? onToggleDownload : undefined}
              disabled={!hasNotes}
              className={[
                'w-7 h-7 flex items-center justify-center rounded-lg transition-colors',
                hasNotes
                  ? 'bg-brand-primary text-white hover:bg-brand-primary-dark'
                  : 'border border-neutral-200 text-neutral-300 cursor-not-allowed',
              ].join(' ')}
              aria-label="Export"
            >
              <ExportIcon className="w-4 h-4" aria-hidden="true" />
            </button>
            {showDownload && hasNotes && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 w-52 overflow-hidden">
                <button type="button" onClick={() => onDownloadSelect('word')} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <i className="bi bi-file-earmark-word text-blue-600" aria-hidden="true" /> Eport to Word
                </button>
                <button type="button" onClick={() => onDownloadSelect('pdf')} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <PdfIcon className="w-4 h-4 text-red-600" aria-hidden="true" /> Export to PDF
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
            <ShareIcon className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-rd-card-border text-rd-trash hover:bg-red-50 transition-colors"
            aria-label="Delete document"
          >
            <TrashIcon className="w-4 h-4" aria-hidden="true" />
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
