import type { ReactNode } from 'react';
import SidebarCollapseIcon from '../../assets/icons/SidebarCollapse.svg?react';

interface ResearchWorkspaceSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function ResearchWorkspaceSidebar({
  collapsed,
  onToggle,
  children,
}: ResearchWorkspaceSidebarProps) {
  return (
    <aside
      className={[
        'flex-shrink-0 border-r border-neutral-200 flex flex-col transition-all duration-200 bg-[var(--color-tab-bg)]',
        collapsed ? 'w-10' : 'w-48',
      ].join(' ')}
    >
      <div
        className={[
          'flex items-center min-h-[44px] border-b border-neutral-100',
          collapsed ? 'justify-center px-0 py-3' : 'gap-2 px-3 py-3',
        ].join(' ')}
      >
        {/* {!collapsed && (
          <i className="bi bi-list text-base text-brand-primary flex-shrink-0" aria-hidden="true" />
        )} */}
        {!collapsed && (
          <span className="flex-1 font-inter text-[10px] font-bold not-italic text-brand-primary uppercase whitespace-nowrap leading-snug">
            Research Workspace
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="flex-shrink-0 p-1 rounded hover:bg-neutral-100 text-brand-primary-dark transition-colors"
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

      {!collapsed && <div className="flex flex-col flex-1 overflow-y-auto">{children}</div>}
    </aside>
  );
}

export default ResearchWorkspaceSidebar;
