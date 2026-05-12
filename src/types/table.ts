export type CellType = 'text' | 'bulletList' | 'badge' | 'links'
export type SortDir  = 'asc' | 'desc'

export interface ColumnDef {
  key:         string
  header:      string
  cellType?:   CellType  // default: 'text'
  sticky?:     boolean   // if true, column is left-sticky (fixed)
  toggleable?: boolean   // can be hidden via view options
  sortable?:   boolean   // header is clickable for sort
  minWidth?:   string                 // e.g. '200px', applied as inline style
  badgeMap?:   Record<string, string> // value → Tailwind classes (for cellType 'badge')
  // card variant extras
  subHeader?:   string  // e.g. drug code shown below header name
  company?:     string
  companyIcon?: string
  badge?:       string  // pill badge text
}

export interface TableRow {
  id:    string
  cells: Record<string, string | string[]>
  icon?: string // icon shown in sticky column for card variant
}
