import { useState } from 'react';
import SidebarCollapseIcon from '../../assets/icons/SidebarCollapse.svg?react';

interface SidebarProps {
  items: string[];
  activeItem?: string;
  onItemClick?: (item: string) => void;
  title?: string;
}

function Sidebar({ items, activeItem, onItemClick, title = 'Module Navigation' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={[
        'flex-shrink-0 border-r border-neutral-200 flex flex-col transition-all duration-200 bg-[var(--color-tab-bg)]',
        collapsed ? 'w-10' : 'w-56',
      ].join(' ')}
    >
      {/* Header */}
      <div
        className={[
          'flex items-center min-h-[44px] border-b border-neutral-100',
          collapsed ? 'justify-center px-0 py-3' : 'gap-2 px-3 py-3',
        ].join(' ')}
      >
        {!collapsed && (
          <i className="bi bi-list text-base text-brand-primary flex-shrink-0" aria-hidden="true" />
        )}
        {!collapsed && (
          <span className="flex-1 text-xs font-bold text-brand-primary uppercase tracking-wide leading-snug">
            {title}
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex-shrink-0 p-1 rounded hover:bg-neutral-100 text-brand-primary transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <SidebarCollapseIcon
            className={[
              'w-4 h-4 transition-transform duration-200',
              collapsed ? 'rotate-180' : '',
            ].join(' ')}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Nav items */}
      {!collapsed && (
        <nav className="flex flex-col pt-1" aria-label="Module navigation">
          {items.map((item) => {
            const isActive = activeItem === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onItemClick?.(item)}
                className={[
                  'text-left pl-3 pr-4 py-2.5 text-sm transition-colors border-l-[3px]',
                  isActive
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold'
                    : 'border-transparent text-neutral-500 font-normal hover:bg-neutral-50',
                ].join(' ')}
              >
                {item}
              </button>
            );
          })}
        </nav>
      )}
    </aside>
  );
}

export default Sidebar;
