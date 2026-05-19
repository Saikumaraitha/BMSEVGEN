import type { AgentExecutionState, AgentCategory } from '../../types/chat-agents';

interface AgentRowProps {
  agent: { id: string; name: string; description: string; icon: string };
  checked: boolean;
  executionState: AgentExecutionState;
  onCheck: (agentId: string) => void;
  onRun: (agentId: string) => void;
}

function AgentRow({ agent, checked, executionState, onCheck, onRun }: AgentRowProps) {
  const isRunning = executionState === 'running';
  const isDone = executionState === 'done';

  return (
    <div
      className={[
        'flex items-start gap-2.5 px-3 py-2.5 transition-colors',
        checked ? 'bg-brand-primary/5' : 'hover:bg-neutral-50',
      ].join(' ')}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onCheck(agent.id)}
        className={[
          'flex-shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
          checked
            ? 'bg-brand-primary border-brand-primary'
            : 'border-neutral-300 bg-white hover:border-brand-primary',
        ].join(' ')}
        aria-checked={checked}
        role="checkbox"
        aria-label={`Select ${agent.name}`}
      >
        {checked && <i className="bi bi-check text-white text-[9px] leading-none" aria-hidden="true" />}
      </button>

      {/* Agent icon */}
      <div className="flex-shrink-0 w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center mt-0.5">
        <i className={`bi ${agent.icon} text-xs text-neutral-500`} aria-hidden="true" />
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-neutral-800 leading-tight">{agent.name}</p>
        <p className="text-[11px] text-neutral-400 leading-snug mt-0.5 line-clamp-2">
          {agent.description}
        </p>
      </div>

      {/* Execution state */}
      <div className="flex-shrink-0 flex items-center mt-0.5">
        {isDone ? (
          <i className="bi bi-check-circle text-emerald-500 text-base flex-shrink-0" title="Complete" aria-hidden="true" />
        ) : isRunning ? (
          <span
            className="w-7 h-7 rounded-full bg-brand-primary/10 flex items-center justify-center"
            title="Running…"
          >
            <i className="bi bi-arrow-repeat text-brand-primary text-sm animate-spin" aria-hidden="true" />
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onRun(agent.id)}
            className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center hover:bg-brand-primary-dark transition-colors"
            title={`Run ${agent.name}`}
            aria-label={`Run ${agent.name}`}
          >
            <i className="bi bi-play-fill text-[11px] text-white" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Category card ────────────────────────────────────────────────────────────

interface AgentCardProps {
  category: AgentCategory;
  expanded: boolean;
  onToggleExpand: (categoryId: string) => void;
  selectedAgentIds: Set<string>;
  executionStates: Record<string, AgentExecutionState>;
  onCheckAgent: (agentId: string) => void;
  onRunAgent: (agentId: string) => void;
  onRunAll: (categoryId: string) => void;
}

function AgentCard({
  category,
  expanded,
  onToggleExpand,
  selectedAgentIds,
  executionStates,
  onCheckAgent,
  onRunAgent,
  onRunAll,
}: AgentCardProps) {
  const checkedCount = category.agents.filter((a) => selectedAgentIds.has(a.id)).length;
  const doneCount = category.agents.filter((a) => executionStates[a.id] === 'done').length;
  const allDone = doneCount === category.agents.length;
  const anyRunning = category.agents.some((a) => executionStates[a.id] === 'running');
  const hasProgress = doneCount > 0 || anyRunning;

  return (
    <div className="flex-shrink-0 border border-neutral-200 rounded-xl overflow-hidden bg-white">
      {/* Category header row */}
      <button
        type="button"
        onClick={() => onToggleExpand(category.id)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary-tint-10 flex items-center justify-center flex-shrink-0">
          <i className={`bi ${category.icon} text-sm text-brand-primary`} aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-neutral-900 leading-tight truncate">
            {category.name}
          </p>
            <p className="text-[11px] leading-tight mt-0.5">
            {hasProgress ? (
              <span className={allDone ? 'text-emerald-600 font-medium' : 'text-brand-primary font-medium'}>
                {doneCount}/{category.agents.length} complete
              </span>
            ) : (
              <span className="text-neutral-400">
                {category.agents.length} agents
                {checkedCount > 0 && ` · ${checkedCount} selected`}
              </span>
            )}
          </p>
        </div>

        {allDone ? (
          <i className="bi bi-check-circle text-emerald-500 text-base flex-shrink-0" aria-hidden="true" />
        ) : (
          <i
            className={[
              'bi text-xs text-neutral-400 flex-shrink-0 transition-transform duration-200',
              expanded ? 'bi-chevron-up' : 'bi-chevron-right',
            ].join(' ')}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Expanded: Run All at top, then agent rows */}
      {expanded && (
        <div className="border-t border-neutral-100">
          {/* Run All Agents — top of expanded content */}
          <div className="px-3 py-2 border-b border-neutral-100">
            <button
              type="button"
              onClick={() => onRunAll(category.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors bg-brand-primary text-white hover:bg-brand-primary-dark"
            >
              {anyRunning ? (
                <>
                  <i className="bi bi-arrow-repeat text-sm animate-spin" aria-hidden="true" />
                  Running…
                </>
              ) : (
                <>
                  <i className="bi bi-play-fill text-sm" aria-hidden="true" />
                  Run All Agents
                </>
              )}
            </button>
          </div>

          {/* Agent rows */}
          <div className="flex flex-col divide-y divide-neutral-50">
            {category.agents.map((agent) => (
              <AgentRow
                key={agent.id}
                agent={agent}
                checked={selectedAgentIds.has(agent.id)}
                executionState={executionStates[agent.id] ?? 'idle'}
                onCheck={onCheckAgent}
                onRun={onRunAgent}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentCard;
