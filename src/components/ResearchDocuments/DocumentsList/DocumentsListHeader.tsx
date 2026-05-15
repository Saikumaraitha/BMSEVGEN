import { RD_SORT_OPTIONS, type RdSortKey } from '../../../config/ResearchDocumentsConfig';
import {
  RD_PAGE_TITLE,
  RD_CREATE_NEW_LABEL,
  RD_SEARCH_PLACEHOLDER,
  RD_SORT_BY_LABEL,
} from '../../../constants/researchDocuments';

interface DocumentsListHeaderProps {
  count: number;
  sortBy: RdSortKey;
  searchTerm: string;
  onSortChange: (key: RdSortKey) => void;
  onCreateNew: () => void;
  onSearchChange: (term: string) => void;
}

function DocumentsListHeader({
  count,
  sortBy,
  searchTerm,
  onSortChange,
  onCreateNew,
  onSearchChange,
}: DocumentsListHeaderProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onSearchChange(e.target.value);

  return (
    <div className="px-6 pt-5 pb-3 bg-white">
      {/* Title + controls row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* title + count */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-ui text-brand-primary">{RD_PAGE_TITLE}</h1>
          <span className="text-xs font-normal font-sans text-rd-section-label mt-0.5">
            {count} document{count !== 1 ? 's' : ''}
          </span>
        </div>

        {/* References + Search + Create New */}
        <div className="flex items-center gap-3">
          {/* References */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            <i className="bi bi-book text-base" aria-hidden="true" />
            <span>References</span>
          </button>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={RD_SEARCH_PLACEHOLDER}
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

          {/* Create New */}
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 pl-1 pr-4 py-1 rounded-full border border-brand-primary bg-white text-brand-primary-dark text-sm font-medium hover:bg-primary-tint-04 transition-colors"
          >
            <span className="w-6 h-6 rounded-full bg-exec-icon-bg text-brand-primary flex items-center justify-center flex-shrink-0">
              <i className="bi bi-plus-lg text-xs" aria-hidden="true" />
            </span>
            {RD_CREATE_NEW_LABEL}
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-0 border-t border-rd-divider mb-3" />

      {/* Sort row */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-detail-link font-bold font-sans text-rd-section-label uppercase tracking-wide">
            {RD_SORT_BY_LABEL}
          </span>
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as RdSortKey)}
              className="appearance-none text-2xs font-normal font-heading border border-rd-sort-border rounded px-2 py-1 pr-6 text-tab-inactive bg-white focus:outline-none"
            >
              {RD_SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down absolute right-1.5 text-text-mid text-3xs pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentsListHeader;
