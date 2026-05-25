import { SortKey, StatusFilter } from "../../types/home";
import SortIcon from '../../assets/icons/sort.svg?react'
import PlusIcon from '../../assets/icons/plus.svg?react'
import SearchIcon from '../../assets/icons/search.svg?react'
import FilterIcon from '../../assets/icons/filter.svg?react'
import ChevronDown from '../../assets/icons/chevron-down.svg?react'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',          label: 'All Statuses' },
  { value: 'in-refresh',   label: 'In Refresh'   },
  { value: 'active-draft', label: 'Active Draft'  },
  { value: 'new-insights', label: 'New Insights'  },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'therapeutic-area', label: 'Therapeutic Area'      },
  { value: 'name-asc',         label: 'Name A → Z'            },
  { value: 'name-desc',        label: 'Name Z → A'            },
  { value: 'updated-asc',      label: 'Last Updated (Oldest)' },
  { value: 'updated-desc',     label: 'Last Updated (Newest)' },
]

interface HomeToolbarProps {
  statusFilter:          StatusFilter
  onStatusFilterChange:  (status: StatusFilter) => void
  sortBy:                SortKey
  onSortChange:          (sort: SortKey) => void
  search:                string
  onSearchChange:        (value: string) => void
  onAddAsset:            () => void
}

function HomeToolbar({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  search,
  onSearchChange,
  onAddAsset,
}: HomeToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Page title */}
      <div className="mr-4">
        <h1 className="font-ui text-xl text-brand-primary-dark leading-tight">Home</h1>
        <div className="h-[3px] w-[30px] bg-brand-primary mt-1 rounded-full" />
      </div>

      {/* Spacer — pushes all controls to the right */}
      <div className="flex-1" />

      {/* Status filter */}
      <div className="flex items-center gap-1.5 text-sm text-neutral-500">
        <FilterIcon className="w-2.5 h-2.5 text-brand-primary" aria-hidden="true" />
        <span className="font-medium text-xs text-brand-primary">Status:</span>
        <div className="relative flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
            className="appearance-none bg-transparent text-neutral-700 text-xs font-medium cursor-pointer focus:outline-none pr-4"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 w-3 h-3 text-brand-primary pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Sort By */}
      <div className="flex items-center gap-1.5 text-sm text-neutral-500">
        <SortIcon className="w-4 h-4" aria-hidden="true" />
        <span className="font-medium text-xs text-brand-primary">Sort By:</span>
        <div className="relative flex items-center">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="appearance-none bg-transparent text-neutral-700 text-xs font-medium cursor-pointer focus:outline-none pr-4"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 w-3 h-3 text-brand-primary pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center rounded-full border border-neutral-200 bg-rd-search-bg overflow-hidden pl-4 p-0.5 w-full lg:max-w-[360px]">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Name, MoA, TA"
          className="text-sm text-neutral-700 placeholder-neutral-400 bg-transparent focus:outline-none"
        />
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary-dark text-white flex-shrink-0"
          aria-label="Search"
        >
          <SearchIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Add New */}
      <button
        type="button"
        onClick={onAddAsset}
        className="flex items-center gap-1.5 px-4 py-1 pl-1 rounded-full border-[0.5px] border-brand-primary text-brand-primary text-sm font-medium hover:bg-brand-primary-light transition-colors shadow-[0_4px_10px_0_rgba(190,43,187,0.1)]"
      >
        <div className="p-2 rounded-full bg-exec-icon-bg">
          <PlusIcon className="w-3 h-3 font-bold" aria-hidden="true" />
        </div>
        Add New
      </button>
    </div>
  )
}

export default HomeToolbar
