import { SortKey, TabKey } from "../../types/home";
import SortIcon from '../../assets/icons/sort.svg?react'
import PlusIcon from '../../assets/icons/plus.svg?react'
import SearchIcon from '../../assets/icons/search.svg?react'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'my', label: 'My Assets' },
  { key: 'all', label: 'All Assets' },
  { key: 'archived', label: 'Archived' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
  { value: 'updated-asc', label: 'Last Updated (Oldest)' },
  { value: 'updated-desc', label: 'Last Updated (Newest)' },
]

interface HomeToolbarProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
  sortBy: SortKey
  onSortChange: (sort: SortKey) => void
  search: string
  onSearchChange: (value: string) => void
  onAddAsset: () => void
}

function HomeToolbar({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  search,
  onSearchChange,
  onAddAsset,
}: HomeToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            className={[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors min-w-[9rem]',
              activeTab === key
                ? 'bg-brand-primary text-white  shadow-[0_4px_0_0_var(--color-primary-dark)]'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sort By */}
      <div className="flex items-center gap-1.5 text-sm text-neutral-500 ml-2">
        <SortIcon className="w-4 h-4" aria-hidden="true" />
        <span className="font-medium">Sort By:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="bg-transparent text-neutral-700 font-medium cursor-pointer focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Add Asset */}
      <button
        type="button"
        onClick={onAddAsset}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-primary text-brand-primary text-sm font-medium hover:bg-brand-primary hover:text-white transition-colors"
      >
        <PlusIcon className="w-4 h-4" aria-hidden="true" />
        Add Asset
      </button>

      {/* Search */}
      <div className="flex items-center rounded-full border border-neutral-200 bg-white overflow-hidden pl-4 pr-1 py-1">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Name, MoA"
          className="text-sm text-neutral-700 placeholder-neutral-400 bg-transparent focus:outline-none w-48 lg:w-56"
        />
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary-dark text-white flex-shrink-0"
          aria-label="Search"
        >
          <SearchIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default HomeToolbar
