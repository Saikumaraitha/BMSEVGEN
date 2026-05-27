import { useRef, useState } from 'react';
import type { ChatProject, RecentChat } from '../../types/chat-agents';
import SidebarCollapseIcon from '../../assets/icons/SidebarCollapse.svg?react';
import MenuIcon from '../../assets/icons/menu.svg?react';

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-bold text-neutral-900 font-sans">New Project</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
            aria-label="Close"
          >
            <i className="bi bi-x text-lg leading-none" aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-5">
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5 font-sans">
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
            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-brand-primary transition-colors font-sans"
          />
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-neutral-100 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors font-sans"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim()}
            className={[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors font-sans',
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
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) { next.delete(projectId); } else { next.add(projectId); }
      return next;
    });
  };

  return (
    <>
      <aside
        className={[
          'flex-shrink-0 border-r border-sidebar-border flex flex-col transition-all duration-200 bg-white font-sans',
          collapsed ? 'w-[61px]' : 'w-60',
        ].join(' ')}
      >
        {/* ── Header ── */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-3 py-3 border-b border-neutral-100 flex-shrink-0 min-h-[44px]`}>
          {!collapsed && (
            <span className="text-xs font-bold text-brand-primary-dark uppercase leading-snug">
              Chat Workspace
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className={[
              'flex-shrink-0 p-1 rounded hover:bg-neutral-100 text-brand-primary-dark transition-colors flex gap-2',
              collapsed ? 'mx-auto' : '',
            ].join(' ')}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed && (
              <MenuIcon
                className="w-4 h-4 transition-transform duration-200"
                aria-hidden="true"
              />
            )}
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

            {/* New Chat button */}
            <div className="px-3 py-3 flex-shrink-0">
              <button
                type="button"
                onClick={onNewChat}
                className="w-full flex items-center justify-center gap-1.5 border border-brand-primary text-brand-primary text-xs font-semibold rounded-full py-2 px-3 hover:bg-exec-icon-bg transition-colors bg-white"
              >
                <span className="w-6 h-6 rounded-full bg-exec-icon-bg flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-plus text-base text-brand-primary leading-none" aria-hidden="true" />
                </span>
                New Chat
              </button>
            </div>

            {/* Projects section */}
            <div className="flex items-center justify-between px-3 pt-2 pb-1.5 flex-shrink-0">
              <span className="text-[10px] font-bold text-rd-section-label uppercase">
                Projects
              </span>
              <button
                type="button"
                onClick={() => setShowNewProjectModal(true)}
                className="text-10 font-bold text-brand-primary-dark hover:opacity-70 transition-opacity"
                aria-label="Add new project"
              >
                + NEW
              </button>
            </div>

            {/* Project rows */}
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              return (
                <div key={project.id}>
                  <button
                    type="button"
                    onClick={() => { toggleProject(project.id); onProjectSelect?.(project.id); }}
                    className={[
                      'w-full flex items-center gap-2 text-left px-3 py-2 text-xs transition-colors font-semibold',
                      activeProjectId === project.id
                        ? 'text-brand-primary bg-exec-icon-bg'
                        : 'text-text-subtle hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    <i className="bi bi-folder text-brand-primary text-sm flex-shrink-0" aria-hidden="true" />
                    <span className="flex-1 truncate min-w-0">{project.name}</span>
                    <i
                      className={[
                        'bi text-[10px] text-brand-primary flex-shrink-0 transition-transform duration-150',
                        isExpanded ? 'bi-chevron-up' : 'bi-chevron-down',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  </button>

                  {isExpanded && (
                    project.chats.length > 0 ? (
                      project.chats.map((chat) => {
                        const isActive = activeChatId === chat.id;
                        return (
                          <button
                            key={chat.id}
                            type="button"
                            onClick={() => onChatSelect(chat.id)}
                            className={[
                              'w-full flex items-center text-left pl-8 pr-3 py-1.5 text-xs transition-colors border-l-2 mx-0',
                              isActive
                                ? 'border-brand-primary text-brand-primary font-semibold bg-exec-icon-bg'
                                : 'border-transparent text-prompt-card-text font-normal hover:bg-neutral-50',
                            ].join(' ')}
                          >
                            <span className="flex-1 truncate min-w-0">{chat.title}</span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="pl-8 pr-3 py-1.5 text-[11px] text-neutral-400 italic">No items yet</p>
                    )
                  )}
                </div>
              );
            })}

            <hr className="my-2 mx-3 border-0 border-t border-rd-divider flex-shrink-0" />

            {/* Recent section */}
            <div className="px-3 pt-1 pb-1.5 flex-shrink-0">
              <span className="text-[10px] font-bold text-rd-section-label uppercase">
                Recent
              </span>
            </div>

            {recentChats.map((chat) => {
              const isActive = activeChatId === chat.id;
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => onChatSelect(chat.id)}
                  className={[
                    'w-full text-left px-3 py-1.5 text-xs transition-colors truncate',
                    isActive
                      ? 'text-brand-primary font-semibold bg-exec-icon-bg'
                      : 'text-prompt-card-text font-normal hover:bg-neutral-50',
                  ].join(' ')}
                >
                  {chat.title}
                </button>
              );
            })}

            <div className="pb-3 flex-shrink-0" />
          </div>
        )}
      </aside>

      {showNewProjectModal && (
        <NewProjectModal
          onCreate={onAddProject}
          onClose={() => setShowNewProjectModal(false)}
        />
      )}
    </>
  );
}

export default ChatAgentsSidebar;
