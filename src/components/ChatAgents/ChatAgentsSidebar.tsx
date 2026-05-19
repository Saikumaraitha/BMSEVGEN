import { useRef, useState } from 'react';
import type { ChatProject, RecentChat } from '../../types/chat-agents';
import SidebarCollapseIcon from '../../assets/icons/SidebarCollapse.svg?react';

// ─── New Project Modal ────────────────────────────────────────────────────────

interface NewProjectModalProps {
  onCreate: (name: string) => void;
  onClose: () => void;
}

function NewProjectModal({ onCreate, onClose }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-900">New Project</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
            aria-label="Close"
          >
            <i className="bi bi-x text-lg leading-none" aria-hidden="true" />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-5 py-5">
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Project Name
          </label>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Q2 2026 Safety Review"
            maxLength={120}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors"
          />
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-neutral-100 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim()}
            className={[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              name.trim()
                ? 'bg-brand-primary text-white hover:bg-brand-primary-dark'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed',
            ].join(' ')}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface ChatAgentsSidebarProps {
  projects: ChatProject[];
  recentChats: RecentChat[];
  activeChatId: string | null;
  activeProjectId?: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onAddProject: (name: string) => void;
  onProjectSelect?: (projectId: string) => void;
}

function ChatAgentsSidebar({
  projects,
  recentChats,
  activeChatId,
  activeProjectId,
  onChatSelect,
  onNewChat,
  onAddProject,
  onProjectSelect,
}: ChatAgentsSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['proj-001']));
  const [recentsExpanded, setRecentsExpanded] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) { next.delete(projectId); } else { next.add(projectId); }
      return next;
    });
  };

  const handleProjectCreated = (name: string) => {
    onAddProject(name);
  };

  return (
    <>
      <aside
        className={[
          'flex-shrink-0 border-r border-neutral-200 flex flex-col transition-all duration-200 bg-[var(--color-tab-bg)]',
          collapsed ? 'w-10' : 'w-60',
        ].join(' ')}
      >
        {/* ── Header ── */}
        <div
          className={[
            'flex items-center flex-shrink-0 min-h-[44px] border-b border-neutral-100',
            collapsed ? 'justify-center px-0 py-3' : 'gap-2 px-3 py-3',
          ].join(' ')}
        >
          {!collapsed && (
            <i className="bi bi-list text-base text-brand-primary flex-shrink-0" aria-hidden="true" />
          )}
          {!collapsed && (
            <span className="flex-1 text-xs font-bold text-brand-primary uppercase tracking-wide leading-snug">
              Chat &amp; Agents
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
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

        {/* ── Scrollable content — only when expanded ── */}
        {!collapsed && (
          <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin-styled">

            {/* New Chat button — AC 1.1 */}
            <div className="px-3 py-3 flex-shrink-0">
              <button
                type="button"
                onClick={onNewChat}
                className="w-full flex items-center justify-center gap-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg py-2.5 px-3 hover:bg-brand-primary-dark transition-colors"
              >
                <i className="bi bi-plus text-base leading-none" aria-hidden="true" />
                New Chat
              </button>
            </div>

            {/* ── Projects section — AC 1.2 ── */}
            <div className="flex items-center justify-between px-4 pt-1 pb-1 flex-shrink-0">
              <span className="text-[10px] font-bold font-heading text-rd-section-label uppercase tracking-widest">
                Projects
              </span>
              {/* AC 3: + button opens New Project modal */}
              <button
                type="button"
                onClick={() => setShowNewProjectModal(true)}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-neutral-200 text-neutral-500 transition-colors"
                aria-label="Add new project"
                title="New Project"
              >
                <i className="bi bi-plus text-sm leading-none" aria-hidden="true" />
              </button>
            </div>

            {/* AC 4 / 5 / 6 / 7 / 8 / 15: expandable project rows with children */}
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              return (
                <div key={project.id}>
                  {/* Project folder row */}
                  <button
                    type="button"
                    onClick={() => { toggleProject(project.id); onProjectSelect?.(project.id); }}
                    className={[
                      'w-full flex items-center gap-2 text-left pl-3 pr-3 py-2 text-xs font-semibold transition-colors',
                      activeProjectId === project.id
                        ? 'text-brand-primary bg-brand-primary/5'
                        : 'text-neutral-700 hover:bg-neutral-100',
                    ].join(' ')}
                  >
                    {/* AC 15: indicator reflects state */}
                    <i
                      className={[
                        'bi text-brand-primary text-sm flex-shrink-0',
                        isExpanded ? 'bi-folder2-open' : 'bi-folder',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                    {/* AC 6: text truncation */}
                    <span className="flex-1 truncate min-w-0">{project.name}</span>
                    {/* AC 15: chevron direction reflects state */}
                    <i
                      className={[
                        'bi text-[10px] text-neutral-400 flex-shrink-0 transition-transform duration-150',
                        isExpanded ? 'bi-chevron-down' : 'bi-chevron-right',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  </button>

                  {/* AC 5: child items shown when expanded */}
                  {isExpanded &&
                    (project.chats.length > 0 ? (
                      project.chats.map((chat) => {
                        const isActive = activeChatId === chat.id;
                        return (
                          <button
                            key={chat.id}
                            type="button"
                            onClick={() => onChatSelect(chat.id)}
                            className={[
                              'w-full flex items-center gap-2 text-left pl-8 pr-3 py-2 text-xs transition-colors border-l-[3px]',
                              isActive
                                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold'
                                : 'border-transparent text-neutral-500 font-normal hover:bg-neutral-50',
                            ].join(' ')}
                          >
                            <i className="bi bi-file-text text-[11px] flex-shrink-0" aria-hidden="true" />
                            {/* AC 6: truncate long titles */}
                            <span className="flex-1 truncate min-w-0">{chat.title}</span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="pl-8 pr-3 py-2 text-[11px] text-neutral-400 italic">
                        No items yet
                      </p>
                    ))}
                </div>
              );
            })}

            <hr className="my-2 mx-4 border-0 border-t border-rd-divider flex-shrink-0" />

            {/* ── Recents section — AC 1.3 / 9 / 10 / 11 ── */}
            <button
              type="button"
              onClick={() => setRecentsExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-4 pt-1 pb-1 flex-shrink-0 hover:bg-neutral-50 transition-colors"
            >
              <span className="text-[10px] font-bold font-heading text-rd-section-label uppercase tracking-widest">
                Recents
              </span>
              <i
                className={[
                  'bi text-[10px] text-neutral-400 transition-transform duration-150',
                  recentsExpanded ? 'bi-chevron-down' : 'bi-chevron-right',
                ].join(' ')}
                aria-hidden="true"
              />
            </button>

            {/* AC 11: open recent items */}
            {recentsExpanded &&
              recentChats.map((chat) => {
                const isActive = activeChatId === chat.id;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => onChatSelect(chat.id)}
                    className={[
                      'w-full flex items-center gap-2 text-left pl-3 pr-3 py-2 text-xs transition-colors border-l-[3px]',
                      isActive
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold'
                        : 'border-transparent text-neutral-500 font-normal hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    <i className="bi bi-file-text text-[11px] flex-shrink-0" aria-hidden="true" />
                    <span className="flex-1 truncate min-w-0">{chat.title}</span>
                  </button>
                );
              })}

            {/* Bottom padding so last item isn't flush against edge */}
            <div className="pb-3 flex-shrink-0" />
          </div>
        )}
      </aside>

      {/* AC 3: New Project modal */}
      {showNewProjectModal && (
        <NewProjectModal
          onCreate={handleProjectCreated}
          onClose={() => setShowNewProjectModal(false)}
        />
      )}
    </>
  );
}

export default ChatAgentsSidebar;
