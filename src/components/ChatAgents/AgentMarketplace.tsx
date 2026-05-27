import { useState, useEffect, useRef } from 'react';
import type { AgentCategory, AgentExecutionState } from '../../types/chat-agents';
import AgentCard from './AgentCard';
import SidebarCollapseIcon from '../../assets/icons/SidebarCollapse.svg?react';
import RobotIcon from '../../assets/icons/Robot.svg?react';

interface AgentMarketplaceProps {
  categories: AgentCategory[];
  selectedAgentIds: Set<string>;
  executionStates: Record<string, AgentExecutionState>;
  onCheckAgent: (agentId: string) => void;
  onRunSelected: () => void;
  onClearSelected: () => void;
  onRunComplete: () => void;
}

function AgentMarketplace({
  categories,
  selectedAgentIds,
  executionStates,
  onCheckAgent,
  onRunSelected,
  onClearSelected,
  onRunComplete,
}: AgentMarketplaceProps) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [lastRunCount, setLastRunCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const wasRunningRef = useRef(false);

  const selectedCount = selectedAgentIds.size;

  // Detect when a run completes (running → all done)
  useEffect(() => {
    const anyRunning = Object.values(executionStates).some((s) => s === 'running');
    const anyDone = Object.values(executionStates).some((s) => s === 'done');
    if (wasRunningRef.current && !anyRunning && anyDone && lastRunCount > 0) {
      setShowSuccess(true);
      onRunComplete();
    }
    wasRunningRef.current = anyRunning;
  }, [executionStates, lastRunCount, onRunComplete]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) { next.delete(categoryId); } else { next.add(categoryId); }
      return next;
    });
  };

  const handleRunClick = () => {
    if (selectedCount === 0) return;
    setLastRunCount(selectedCount);
    setShowSuccess(false);
    wasRunningRef.current = false;
    onRunSelected();
  };

  const handleRunAgain = () => {
    setShowSuccess(false);
    setLastRunCount(0);
  };

  // ── Collapsed strip ───────────────────────────────────────────────────────
  if (panelCollapsed) {
    return (
      <aside className="flex-shrink-0 w-[72px] border-l border-sidebar-border flex flex-col font-sans">
        <button
          type="button"
          onClick={() => setPanelCollapsed(false)}
          className="agent-header-bg flex items-center justify-between px-3 py-4 border-b border-sidebar-border hover:opacity-90 transition-opacity w-full"
          aria-label="Expand Agentic Workspace"
        >
          <SidebarCollapseIcon className="w-4 h-4 text-brand-primary" aria-hidden="true" />
          <RobotIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </aside>
    );
  }

  // ── Expanded panel ────────────────────────────────────────────────────────
  return (
    <aside className="w-[360px] flex-shrink-0 border-l border-neutral-200 flex flex-col bg-white font-sans">

      {/* Header */}
      <div className="flex-shrink-0 agent-header-bg border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPanelCollapsed(true)}
            className="flex-shrink-0 p-1 rounded hover:bg-brand-primary/10 transition-colors text-brand-primary"
            aria-label="Collapse Agentic Workspace"
          >
            <SidebarCollapseIcon className="w-4 h-4 rotate-180" aria-hidden="true" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-13 font-bold text-brand-primary">Agentic Workspace</p>
            <p className="text-9-5 font-normal text-agent-subtitle mt-0.5">AI-powered analysis agent</p>
          </div>
        </div>
      </div>

      {/* Run bar — only when agents are selected and run hasn't completed */}
      {selectedCount > 0 && !showSuccess && (
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-3">
          <button
            type="button"
            onClick={handleRunClick}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-dark transition-colors"
          >
            <i className="bi bi-play-fill text-sm leading-none" aria-hidden="true" />
            Run {selectedCount} Selected {selectedCount === 1 ? 'Agent' : 'Agents'}
          </button>
          <button
            type="button"
            onClick={onClearSelected}
            className="px-4 py-2.5 rounded-md text-xs font-semibold text-brand-primary border border-brand-primary bg-white hover:bg-exec-icon-bg transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Success banner */}
      {showSuccess && (
        <div className="flex-shrink-0 flex items-center gap-2 m-3 px-3 py-2.5 bg-success-banner-bg rounded-md">
          <div className="success-check-icon flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center">
            <i className="bi bi-check text-white text-xs font-bold leading-none" aria-hidden="true" />
          </div>
          <span className="flex-1 text-xs font-bold text-success-text font-sans">
            {lastRunCount} {lastRunCount === 1 ? 'Agent' : 'Agents'} Successfully Run
          </span>
          <button
            type="button"
            onClick={handleRunAgain}
            className="text-2xs font-medium text-run-again underline hover:opacity-80 transition-opacity flex-shrink-0 font-sans"
          >
            Run Again
          </button>
        </div>
      )}

      {/* Instruction text — only in idle state */}
      {selectedCount === 0 && !showSuccess && (
        <div className="flex-shrink-0 px-4 py-6">
          <p className="text-3xs font-normal text-agent-select-label text-center">
            Select a category or individual agents to run
          </p>
        </div>
      )}

      {/* Scrollable category cards */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 pb-2 flex flex-col gap-2.5 scrollbar-panel">
        {categories.map((category) => (
          <AgentCard
            key={category.id}
            category={category}
            expanded={expandedCategories.has(category.id)}
            onToggleExpand={toggleCategory}
            selectedAgentIds={selectedAgentIds}
            onCheckAgent={onCheckAgent}
          />
        ))}
      </div>

    </aside>
  );
}

export default AgentMarketplace;
