import { useState, useMemo, useRef } from 'react'
import type { ColumnDef, TableRow, SortDir } from '../../../types/table'

export interface DataTableProps {
  columns:           ColumnDef[]
  rows:              TableRow[]
  visibleColumns:    Set<string>
  variant?:          'default' | 'card'
  selectedColumnKey?: string
  onColumnSelect?:   (key: string) => void
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-4 list-disc marker:text-neutral-400">
      {items.map((item, i) => (
        <li key={i} className="text-xs leading-relaxed text-table-body-text">{item}</li>
      ))}
    </ul>
  )
}

function renderCell(col: ColumnDef, row: TableRow) {
  const value = row.cells[col.key]
  if (col.cellType === 'links' && Array.isArray(value)) {
    return (
      <div className="space-y-1">
        {(value as string[]).map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noreferrer" className="block text-xs text-link underline break-all">
            {url}
          </a>
        ))}
      </div>
    )
  }
  if (col.cellType === 'bulletList' && Array.isArray(value)) {
    return <BulletList items={value} />
  }
  if (col.cellType === 'badge' && !Array.isArray(value)) {
    const str   = String(value ?? '')
    const style = col.badgeMap?.[str]
    if (!style) return <span className="text-xs text-neutral-400">N/A</span>
    return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
        {str}
      </span>
    )
  }
  return <p className="text-xs leading-relaxed text-table-body-text">{String(value ?? '—')}</p>
}

// ── Default variant helpers ────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={`ml-1.5 inline-block text-xs ${active ? 'text-brand-primary' : 'text-neutral-400'}`}>
      {!active ? '↕' : dir === 'asc' ? '↑' : '↓'}
    </span>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function DataTable({
  columns,
  rows,
  visibleColumns,
  variant = 'default',
  selectedColumnKey,
  onColumnSelect,
}: DataTableProps) {
  const [sortKey,       setSortKey]       = useState<string | null>(null)
  const [sortDir,       setSortDir]       = useState<SortDir>('asc')
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set())

  const scrollRef      = useRef<HTMLDivElement>(null)
  const isDragging     = useRef(false)
  const dragStartX     = useRef(0)
  const dragScrollLeft = useRef(0)

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    isDragging.current     = true
    dragStartX.current     = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    dragScrollLeft.current = scrollRef.current?.scrollLeft ?? 0
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDragging.current) return
    e.preventDefault()
    const x    = e.pageX - (scrollRef.current?.offsetLeft ?? 0)
    const walk = x - dragStartX.current
    if (scrollRef.current) scrollRef.current.scrollLeft = dragScrollLeft.current - walk
  }

  function stopDrag() { isDragging.current = false }

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function toggleRow(id: string) {
    setCollapsedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows
    return [...rows].sort((a, b) => {
      const av = a.cells[sortKey]
      const bv = b.cells[sortKey]
      const as = Array.isArray(av) ? (av[0] ?? '') : (av ?? '')
      const bs = Array.isArray(bv) ? (bv[0] ?? '') : (bv ?? '')
      const cmp = as.localeCompare(bs)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [rows, sortKey, sortDir])

  const displayCols = columns.filter(col => !col.toggleable || visibleColumns.has(col.key))
  const stickyCol   = displayCols.find(col => col.sticky)
  const scrollCols  = displayCols.filter(col => !col.sticky)

  // ── Card variant ─────────────────────────────────────────────────────────────

  if (variant === 'card') {
    return (
      <div
        ref={scrollRef}
        className="overflow-auto cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <table
          className="w-full border-separate [border-spacing:6px_0]"
          style={{ minInlineSize: `${190 + scrollCols.length * 252}px` }}
        >
          <thead>
            <tr>
              {stickyCol && (
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-white w-[190px] min-w-[190px] will-change-transform"
                />
              )}

              {scrollCols.map(col => {
                const isSel = col.key === selectedColumnKey
                return (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => onColumnSelect?.(col.key)}
                    className={`relative p-4 align-top font-normal cursor-pointer select-none text-left
                      min-w-[240px] rounded-t-xl border-b-0
                      ${isSel
                        ? 'border-t-2 border-l-2 border-r-2 border-t-[var(--color-primary)] border-l-[var(--color-primary)] border-r-[var(--color-primary)] bg-[var(--color-primary-tint-04)]'
                        : 'border-t border-l border-r border-t-[var(--color-neutral-200)] border-l-[var(--color-neutral-200)] border-r-[var(--color-neutral-200)] bg-white'
                      }`}
                  >
                    {isSel && (
                      <span className="absolute top-3 right-3 text-[var(--color-primary-tint-45)]">
                        <i className="bi bi-pin-angle-fill text-[14px]" />
                      </span>
                    )}

                    <div className="font-bold text-base text-neutral-900 pr-6 leading-snug">
                      {col.header}
                    </div>
                    {col.subHeader && (
                      <div className="text-xs text-neutral-500 mt-0.5 mb-4">
                        ({col.subHeader})
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 shrink-0">
                        {col.companyIcon && (
                          <img src={col.companyIcon} alt="" className="w-[14px] h-[14px]" />
                        )}
                      </span>
                      {col.company && (
                        <span className="text-xs text-neutral-600">{col.company}</span>
                      )}
                    </div>

                    {col.badge && (
                      <span className="inline-block text-brand-primary text-[11px] font-medium px-3 py-1 rounded-full bg-[var(--color-primary-tint-10)]">
                        {col.badge}
                      </span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, pIdx) => {
              const isLast      = pIdx === rows.length - 1
              const isCollapsed = collapsedRows.has(row.id)
              const rowBg       = pIdx % 2 === 0 ? 'var(--color-bg-row-alt)' : 'white'
              return (
                <tr key={row.id}>
                  {stickyCol && (
                    <td
                      className={`sticky left-0 z-10 p-4 w-[190px] min-w-[190px]
                        ${isLast ? '' : 'border-b border-b-[var(--color-chart-grid)]'}`}
                      style={{ backgroundColor: rowBg }}
                    >
                      <div className="flex items-center gap-2">
                        {row.icon && (
                          <img src={row.icon} alt="" className="shrink-0 w-4 h-4" />
                        )}
                        <span className="text-xs font-semibold leading-tight flex-1 text-[var(--color-text-dark)]">
                          {String(row.cells[stickyCol.key] ?? '')}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleRow(row.id)}
                          className="transition-colors text-xs leading-none text-[var(--color-text-mid)]"
                          aria-label={isCollapsed ? 'Expand row' : 'Collapse row'}
                        >
                          {isCollapsed ? '+' : '—'}
                        </button>
                      </div>
                    </td>
                  )}

                  {scrollCols.map(col => {
                    const isSel   = col.key === selectedColumnKey
                    const value   = row.cells[col.key] ?? ''
                    const content = Array.isArray(value) ? value : String(value)
                    return (
                      <td
                        key={col.key}
                        className={`text-xs leading-relaxed align-top text-black
                          ${isLast ? 'rounded-b-xl' : ''}
                          ${isSel
                            ? 'border-l-2 border-r-2 border-l-[var(--color-primary)] border-r-[var(--color-primary)]'
                            : 'border-l border-r border-l-[var(--color-neutral-200)] border-r-[var(--color-neutral-200)]'
                          }
                          ${pIdx > 0 ? 'border-t border-t-[var(--color-chart-grid)]' : ''}
                          ${isLast
                            ? (isSel
                                ? 'border-b-2 border-b-[var(--color-primary)]'
                                : 'border-b border-b-[var(--color-neutral-200)]')
                            : ''
                          }`}
                        style={{ backgroundColor: rowBg }}
                      >
                        {!isCollapsed && (
                          <div className="p-4">
                            {col.cellType === 'links' && Array.isArray(content)
                              ? content.map((url, i) => (
                                  <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-link underline break-all mb-1"
                                  >
                                    {url}
                                  </a>
                                ))
                              : String(content)}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // ── Default variant ───────────────────────────────────────────────────────────

  return (
    <div
      ref={scrollRef}
      className="overflow-x-auto rounded-lg border border-neutral-200 cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-table-header-bg">
            {stickyCol && (
              <th
                style={{ minInlineSize: stickyCol.minWidth }}
                className={`sticky left-0 z-10 bg-table-header-bg border-r border-b border-brand-primary-dark
                            px-4 py-3 text-left text-xs font-semibold text-white
                            ${stickyCol.sortable ? 'cursor-pointer select-none' : ''}`}
                onClick={() => stickyCol.sortable && handleSort(stickyCol.key)}
              >
                {stickyCol.header}
                {stickyCol.sortable && <SortIcon active={sortKey === stickyCol.key} dir={sortDir} />}
              </th>
            )}
            {scrollCols.map(col => (
              <th
                key={col.key}
                style={{ minInlineSize: col.minWidth }}
                className={`px-4 py-3 border-b border-brand-primary-dark text-left text-xs font-semibold
                            text-white whitespace-nowrap
                            ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.header}
                {col.sortable && <SortIcon active={sortKey === col.key} dir={sortDir} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => {
            const isEven   = i % 2 === 0
            const stickyBg = isEven ? 'var(--color-table-sticky-row-even)' : 'var(--color-table-sticky-row-odd)'
            const normalBg = isEven ? 'var(--color-table-row-even)'        : 'var(--color-table-row-odd)'
            return (
              <tr key={row.id}>
                {stickyCol && (
                  <td
                    style={{ minInlineSize: stickyCol.minWidth, backgroundColor: stickyBg }}
                    className="sticky left-0 z-10 border-r border-b border-neutral-200 px-4 py-4 align-top"
                  >
                    <span className="text-xs font-semibold leading-relaxed text-table-sticky-text">
                      {String(row.cells[stickyCol.key] ?? '')}
                    </span>
                  </td>
                )}
                {scrollCols.map(col => (
                  <td
                    key={col.key}
                    style={{ minInlineSize: col.minWidth, backgroundColor: normalBg }}
                    className="px-4 py-4 border-b border-neutral-200 align-top"
                  >
                    {renderCell(col, row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
