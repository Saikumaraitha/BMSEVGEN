import ChevronDownIcon from '../../../assets/icons/chevron-down.svg?react'
import ExportIcon from '../../../assets/icons/export.svg?react'

export interface FilterColumn {
  key:     string
  label:   string
  options: string[]
}

export interface ViewOption {
  key:      string
  label:    string
  checked:  boolean
  onChange: () => void
}

export interface PageHeaderProps {
  title:           string
  onExport?:       () => void
  isFilter?:       boolean
  filterColumns?:  FilterColumn[]
  filterValues?:   Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  viewOptions?:    ViewOption[]
}

export default function PageHeader({
  title,
  onExport,
  isFilter = false,
  filterColumns = [],
  filterValues = {},
  onFilterChange,
  viewOptions = [],
}: Readonly<PageHeaderProps>) {

  return (
    <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-neutral-200 bg-white overflow-x-auto">

      {/* Title */}
      <div className="flex flex-col flex-shrink-0">
        <h2 className="text-base font-semibold font-ui whitespace-nowrap m-0 text-brand-primary">{title}</h2>
        <span className="block h-[3px] w-[30px] rounded-full bg-brand-primary mt-0.5" aria-hidden="true" />
      </div>

      {/* Info icon */}
      <i className="bi bi-info-circle-fill text-[11.81px] text-neutral-400 hover:text-neutral-500 transition-colors cursor-pointer" aria-label="Page info" />

      {/* Right-side group: Export + Filter dropdowns */}
      <div className="ml-auto flex items-center gap-3 flex-shrink-0">
        {/* Filter dropdowns */}
        {isFilter && filterColumns.length > 0 && (
          <div className="flex items-center gap-4 px-3 py-1.5 rounded bg-[var(--color-bg-filter-bar)]">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide whitespace-nowrap">
              View Options
            </span>
            <div className="w-px h-4 bg-neutral-200 flex-shrink-0" />
            {filterColumns.map((col, i) => (
              <div key={col.key} className="flex items-center gap-3">
                <div className="relative inline-flex items-center gap-1 text-brand-primary text-xs font-semibold cursor-pointer bg-white px-2 py-1 rounded [&>select]:absolute [&>select]:inset-0 [&>select]:w-full [&>select]:h-full [&>select]:opacity-0 [&>select]:cursor-pointer [&>select]:bg-transparent">
                  <span className="pointer-events-none whitespace-nowrap">
                    {filterValues[col.key] && filterValues[col.key] !== 'All'
                      ? filterValues[col.key]
                      : col.label}
                  </span>
                  <ChevronDownIcon className="pointer-events-none flex-shrink-0 w-3 h-3" aria-hidden="true" />
                  <select
                    value={filterValues[col.key] ?? 'All'}
                    onChange={e => onFilterChange?.(col.key, e.target.value)}
                    aria-label={`Filter by ${col.label}`}
                  >
                    {col.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                {i < filterColumns.length - 1 && (
                  <div className="w-px h-4 bg-neutral-200 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* View options checkboxes */}
        {viewOptions.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">VIEW OPTIONS</span>
            {viewOptions.map(opt => (
              <label key={opt.key} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={opt.onChange}
                  className="w-4 h-4 accent-brand-primary cursor-pointer"
                />
                <span className="text-sm text-neutral-600">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Export button */}
        <button
          className="flex items-center gap-1.5 text-brand-primary text-sm font-medium font-sans bg-transparent border-none cursor-pointer px-2 py-1 rounded-md transition-colors hover:bg-neutral-100 flex-shrink-0"
          onClick={onExport}
          aria-label="Export"
          type="button"
        >
          <ExportIcon className="w-[15px] h-[15px]" aria-hidden="true" />
          Export
        </button>
      </div>

    </div>
  )
}
