import { useState } from 'react'
import SidebarCollapseIcon from '../../assets/icons/sidebar-collapse.svg?react'

interface SidebarProps {
  items: string[]
  activeItem?: string
  onItemClick?: (item: string) => void
}

function Sidebar({ items, activeItem, onItemClick }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={[
        'flex-shrink-0 border-r border-neutral-200 flex flex-col transition-all duration-200 bg-[var(--color-tab-bg)]',
        collapsed ? 'w-10' : 'w-56',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 min-h-[44px]">
        {!collapsed && (
          <span className="text-sm font-semibold text-brand-primary-dark truncate">
            Module Navigation
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex-shrink-0 p-1 rounded hover:bg-neutral-100 text-brand-primary-dark transition-colors ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <SidebarCollapseIcon
            className={['w-4 h-4 transition-transform duration-200', collapsed ? 'rotate-180' : ''].join(' ')}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Nav items */}
      {!collapsed && (
        <nav className="flex flex-col pt-1" aria-label="Module navigation">
          {items.map((item) => {
            const isActive = activeItem === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => onItemClick?.(item)}
                className={[
                  'text-left px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-neutral-800 hover:bg-neutral-100',
                ].join(' ')}
              >
                {item}
              </button>
            )
          })}
        </nav>
      )}
    </aside>
  )
}

export default Sidebar
