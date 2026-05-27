import type { AgentCategory } from '../../types/chat-agents';
import DiseaseIcon from '../../assets/icons/DiseaseTreatement.svg?react';
import CompetitiveIcon from '../../assets/icons/CompetitiveBenchmark.svg?react';
import AssetStrategyIcon from '../../assets/icons/AssetStrategy.svg?react';

const CATEGORY_ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'disease-treatment': DiseaseIcon,
  'competitive-benchmark': CompetitiveIcon,
  'asset-strategy': AssetStrategyIcon,
};

interface AgentRowProps {
  agent: { id: string; name: string; description: string; icon: string };
  checked: boolean;
  onCheck: (agentId: string) => void;
}

function AgentRow({ agent, checked, onCheck }: AgentRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
      <button
        type="button"
        onClick={() => onCheck(agent.id)}
        className={[
          'flex-shrink-0 mt-0.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors',
          checked
            ? 'bg-brand-primary border-brand-primary'
            : 'border-agent-checkbox-border bg-white hover:border-brand-primary',
        ].join(' ')}
        aria-checked={checked}
        role="checkbox"
        aria-label={`Select ${agent.name}`}
      >
        {checked && <i className="bi bi-check text-white text-xs leading-none" aria-hidden="true" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={['text-xs font-semibold leading-tight', checked ? 'text-agent-checked-title' : 'text-agent-category'].join(' ')}>
          {agent.name}
        </p>
        <p className={['text-10 leading-snug mt-0.5 line-clamp-2', checked ? 'text-brand-primary-dark' : 'text-neutral-400'].join(' ')}>
          {agent.description}
        </p>
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
  onCheckAgent: (agentId: string) => void;
}

function AgentCard({
  category,
  expanded,
  onToggleExpand,
  selectedAgentIds,
  onCheckAgent,
}: AgentCardProps) {
  const checkedCount = category.agents.filter((a) => selectedAgentIds.has(a.id)).length;
  const allCategoryChecked = checkedCount === category.agents.length && category.agents.length > 0;
  const anyCategoryChecked = checkedCount > 0;

  const CategoryIcon = CATEGORY_ICON_MAP[category.icon];

  const handleCategoryCheck = () => {
    if (allCategoryChecked) {
      category.agents.forEach((a) => { if (selectedAgentIds.has(a.id)) onCheckAgent(a.id); });
    } else {
      category.agents.forEach((a) => { if (!selectedAgentIds.has(a.id)) onCheckAgent(a.id); });
    }
  };

  return (
    <div className={[
      'flex-shrink-0 rounded-xl overflow-hidden bg-white border transition-colors',
      expanded ? 'border-brand-primary-dark' : anyCategoryChecked ? 'border-brand-primary' : 'border-agent-card-border',
    ].join(' ')}>

      {/* Category header row */}
      <div className={[
        'flex items-center gap-3 px-4 py-3.5 transition-colors',
        expanded ? 'bg-agent-card-expanded-bg' : 'bg-white',
      ].join(' ')}>

        {/* Category-level checkbox */}
        <button
          type="button"
          onClick={handleCategoryCheck}
          className={[
            'flex-shrink-0 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors',
            allCategoryChecked || anyCategoryChecked
              ? 'bg-brand-primary border-brand-primary'
              : 'border-agent-checkbox-border bg-white hover:border-brand-primary',
          ].join(' ')}
          aria-label={`Select all agents in ${category.name}`}
        >
          {allCategoryChecked && (
            <i className="bi bi-check text-white text-[9px] leading-none" aria-hidden="true" />
          )}
          {anyCategoryChecked && !allCategoryChecked && (
            <span className="w-2 h-[2px] bg-white rounded-full" />
          )}
        </button>

        {/* Expand toggle — icon + name + count + chevron */}
        <button
          type="button"
          onClick={() => onToggleExpand(category.id)}
          className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
        >
          <div className={[
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            expanded ? 'bg-white' : 'bg-primary-tint-10',
          ].join(' ')}>
            {CategoryIcon
              ? <CategoryIcon className="w-4 h-4" />
              : <i className={`bi ${category.icon} text-sm text-brand-primary`} aria-hidden="true" />
            }
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-agent-category leading-tight truncate">
              {category.name}
            </p>
            <p className="text-10 mt-0.5 leading-tight">
              <span className="text-agent-category font-normal">{category.agents.length} agents</span>
              {checkedCount > 0 && (
                <>
                  <span className="text-agent-category"> · </span>
                  <span className="text-brand-primary font-semibold">{checkedCount} selected</span>
                </>
              )}
            </p>
          </div>

          <i
            className={[
              'bi text-xs text-brand-primary flex-shrink-0 transition-transform duration-200',
              expanded ? 'bi-chevron-up' : 'bi-chevron-down',
            ].join(' ')}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Expanded: agent rows only (no Run All button) */}
      {expanded && (
        <div className="border-t border-neutral-100 flex flex-col divide-y divide-neutral-50">
          {category.agents.map((agent) => (
            <AgentRow
              key={agent.id}
              agent={agent}
              checked={selectedAgentIds.has(agent.id)}
              onCheck={onCheckAgent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentCard;
