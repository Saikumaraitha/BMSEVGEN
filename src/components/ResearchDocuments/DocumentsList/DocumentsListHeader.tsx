import { RD_SORT_OPTIONS, type RdSortKey } from '../../../config/ResearchDocumentsConfig';
import {
  RD_PAGE_TITLE,
  RD_CREATE_NEW_LABEL,
  RD_SEARCH_PLACEHOLDER,
  RD_SORT_BY_LABEL,
} from '../../../constants/researchDocuments';
import SearchIcon from '../../../assets/icons/search.svg?react';
import PlusIcon from '../../../assets/icons/plus.svg?react';

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
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* title + count */}
        <div className="flex flex-col">
          <h1 className="text-[20px] font-bold font-['Trebuchet_MS'] text-[#BE2BBB] leading-normal">{RD_PAGE_TITLE}</h1>
        </div>

        {/* Create New + Search */}
        <div className="flex items-center gap-3">
          {/* Create New */}
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-2 pl-1 pr-4 py-1 w-[116.434px] h-[32.4px] rounded-[90px] border-[0.45px] border-[#BE2BBB] bg-white shadow-[0_3.6px_9px_0_rgba(190,43,187,0.10)] text-[#BE2BBB] text-center font-[Inter] text-[11.7px] font-semibold leading-normal transition-colors hover:bg-[#faf5fa]"
          >
            <span className="w-6 h-6 rounded-full bg-exec-icon-bg text-[#BE2BBB] flex items-center justify-center flex-shrink-0">
              <PlusIcon className="w-[10px] h-[10px]" aria-hidden="true" />
            </span>

            <span className="font-[Inter] text-[11px] font-semibold leading-normal text-[#BE2BBB]">
              {RD_CREATE_NEW_LABEL}
            </span>
          </button>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={RD_SEARCH_PLACEHOLDER}
              className="pl-4 pr-10 py-1.5 w-[303.653px] h-[32.4px] rounded-[743.688px] bg-[#F4F4F4] border border-rd-search-border focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-[#8C7873] placeholder:font-[Inter] placeholder:text-[11.664px] placeholder:italic placeholder:font-light placeholder:leading-normal "
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors"
              aria-label="Search"
            >
              <SearchIcon className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-0 border-t border-rd-divider mb-3" />

      {/* Sort row */}
      <div className="flex items-center justify-between">
        <span className="text-[#88877F] font-[Inter] text-[12px] not-italic font-bold leading-normal">
          {count} document{count !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-detail-link font-bold font-sans text-rd-section-label uppercase tracking-wide">
            {RD_SORT_BY_LABEL}
          </span>
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as RdSortKey)}
              className="appearance-none text-2xs font-normal font-heading border border-[#B0B0B0] rounded px-2 py-1 pr-12 text-tab-inactive bg-white focus:outline-none"
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
