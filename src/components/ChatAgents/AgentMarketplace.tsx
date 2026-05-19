import { useEffect, useRef, useState } from 'react';
import type { AgentCategory, AgentExecutionState } from '../../types/chat-agents';
import AgentCard from './AgentCard';
import SidebarCollapseIcon from '../../assets/icons/SidebarCollapse.svg?react';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'Disease & Treatment Landscape',
  'Competitive Benchmark',
  'Asset Strategy & Evidence',
  'Other / New Category',
] as const;

const OUTPUT_FORMATS = [
  'Table / Comparison Grid',
  'Freeform Text / Summary',
  'Charts / Visualizations',
  'Mixed (Text + Table + Chart)',
] as const;

// ─── Toast ────────────────────────────────────────────────────────────────────

type ToastKind = 'success' | 'error';

function Toast({
  kind,
  message,
  onDismiss,
}: {
  kind: ToastKind;
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={[
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium max-w-sm',
        kind === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800',
      ].join(' ')}
    >
      <i
        className={[
          'bi flex-shrink-0 text-base',
          kind === 'success' ? 'bi-check-circle-fill text-emerald-500' : 'bi-exclamation-circle-fill text-red-500',
        ].join(' ')}
        aria-hidden="true"
      />
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <i className="bi bi-x text-lg leading-none" aria-hidden="true" />
      </button>
    </div>
  );
}

// ─── Inline request form ──────────────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 mb-1.5">
      {label}
      {required && (
        <span className="text-red-500 font-bold leading-none" aria-label="required">*</span>
      )}
    </label>
  );
}

interface InlineRequestFormProps {
  existingAgentNames: string[];
  onSubmit: (agentName: string) => void;
  onClose: () => void;
}

function InlineRequestForm({ existingAgentNames, onSubmit, onClose }: InlineRequestFormProps) {
  const [agentName, setAgentName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [dataSources, setDataSources] = useState('');
  const [duplicateError, setDuplicateError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const agentNameRef = useRef<HTMLInputElement>(null);

  const isMandatoryComplete = agentName.trim() !== '' && description.trim() !== '';

  const handleAgentNameChange = (value: string) => {
    setAgentName(value);
    if (duplicateError) setDuplicateError(false);
  };

  const handleSubmit = async () => {
    if (!isMandatoryComplete || isSubmitting) return;
    const nameLower = agentName.trim().toLowerCase();
    if (existingAgentNames.some((n) => n.toLowerCase() === nameLower)) {
      setDuplicateError(true);
      agentNameRef.current?.focus();
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => { if (Math.random() > 0.05) { resolve(); } else { reject(); } }, 800);
      });
      onSubmit(agentName.trim());
    } catch {
      setSubmitError('Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 flex-shrink-0">
        <h2 className="text-sm font-bold text-neutral-900">Request New Agent</h2>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
          aria-label="Close"
        >
          <i className="bi bi-x text-base leading-none" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 scrollbar-thin-styled">
        {submitError && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <i className="bi bi-exclamation-circle text-sm flex-shrink-0" aria-hidden="true" />
            <span className="flex-1">{submitError}</span>
            <button type="button" onClick={() => setSubmitError('')} className="flex-shrink-0 hover:text-red-900">
              <i className="bi bi-x text-base leading-none" aria-hidden="true" />
            </button>
          </div>
        )}

        <div>
          <FieldLabel label="Agent Name" required />
          <input
            ref={agentNameRef}
            type="text"
            value={agentName}
            onChange={(e) => handleAgentNameChange(e.target.value)}
            placeholder="e.g., Biomarker Stratification Agent"
            className={[
              'w-full border rounded-lg px-3 py-2 text-xs text-neutral-800 placeholder-neutral-400 outline-none transition-colors',
              duplicateError
                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-300'
                : 'border-neutral-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30',
            ].join(' ')}
          />
          {duplicateError && (
            <div className="flex items-start gap-2 mt-1.5 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <i className="bi bi-exclamation-circle text-red-500 text-xs flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="flex-1 text-xs text-red-700 leading-snug">
                A matching Agent Name exists. Please provide a different one.
              </p>
              <button type="button" onClick={() => setDuplicateError(false)} className="flex-shrink-0 text-red-400 hover:text-red-600">
                <i className="bi bi-x text-base leading-none" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div>
          <FieldLabel label="Category" />
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 outline-none appearance-none bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors pr-7"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <i className="bi bi-chevron-down text-neutral-400 text-xs absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        <div>
          <FieldLabel label="Description" required />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe what this agent should do, what questions it should answer..."
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 placeholder-neutral-400 outline-none resize-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors"
          />
        </div>

        <div>
          <FieldLabel label="Preferred Output Format" />
          <div className="relative">
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 outline-none appearance-none bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors pr-7"
            >
              <option value="">Select format</option>
              {OUTPUT_FORMATS.map((fmt) => <option key={fmt} value={fmt}>{fmt}</option>)}
            </select>
            <i className="bi bi-chevron-down text-neutral-400 text-xs absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        <div>
          <FieldLabel label="Data Sources / References" />
          <input
            type="text"
            value={dataSources}
            onChange={(e) => setDataSources(e.target.value)}
            placeholder="e.g., Clinical trials, congress abstracts, KOL interviews, internal data..."
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-neutral-100 flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-600 border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isMandatoryComplete || isSubmitting}
          className={[
            'px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5',
            isMandatoryComplete && !isSubmitting
              ? 'bg-brand-primary text-white hover:bg-brand-primary-dark'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed',
          ].join(' ')}
        >
          {isSubmitting && <i className="bi bi-arrow-repeat text-xs animate-spin" aria-hidden="true" />}
          Submit Request
        </button>
      </div>
    </>
  );
}

// ─── Marketplace panel ────────────────────────────────────────────────────────

interface AgentMarketplaceProps {
  categories: AgentCategory[];
  selectedAgentIds: Set<string>;
  executionStates: Record<string, AgentExecutionState>;
  onCheckAgent: (agentId: string) => void;
  onRunAgent: (agentId: string) => void;
  onRunAll: (categoryId: string) => void;
  onRunSelected: () => void;
  onClearSelected: () => void;
}

function AgentMarketplace({
  categories,
  selectedAgentIds,
  executionStates,
  onCheckAgent,
  onRunAgent,
  onRunAll,
  onRunSelected,
  onClearSelected,
}: AgentMarketplaceProps) {
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  // All categories start collapsed (empty set) to match Figma
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [toast, setToast] = useState<{ kind: ToastKind; message: string } | null>(null);

  const selectedCount = selectedAgentIds.size;
  const existingAgentNames = categories.flatMap((c) => c.agents.map((a) => a.name));

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) { next.delete(categoryId); } else { next.add(categoryId); }
      return next;
    });
  };

  const handleRequestSubmit = (agentName: string) => {
    setShowRequestForm(false);
    setToast({ kind: 'success', message: `Agent request "${agentName}" submitted successfully.` });
  };

  // ── Collapsed strip ───────────────────────────────────────────────────────
  if (panelCollapsed) {
    return (
      <>
        <aside className="flex-shrink-0 w-10 border-l border-neutral-200 bg-white flex flex-col items-center py-3 gap-3">
          <button
            type="button"
            onClick={() => setPanelCollapsed(false)}
            className="p-1 rounded hover:bg-neutral-100 text-brand-primary-dark transition-colors"
            aria-label="Expand Agentic Marketplace"
          >
            <SidebarCollapseIcon className="w-4 h-4 rotate-180" aria-hidden="true" />
          </button>
          <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center">
            <i className="bi bi-stars text-white text-xs" aria-hidden="true" />
          </div>
          <span
            className="text-[11px] font-semibold text-brand-primary whitespace-nowrap mt-1"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Agentic Marketplace
          </span>
        </aside>
        {toast && <Toast kind={toast.kind} message={toast.message} onDismiss={() => setToast(null)} />}
      </>
    );
  }

  // ── Expanded panel ────────────────────────────────────────────────────────
  return (
    <>
      <aside className="w-72 flex-shrink-0 border-l border-neutral-200 flex flex-col bg-rd-body-bg">

        {showRequestForm ? (
          <InlineRequestForm
            existingAgentNames={existingAgentNames}
            onSubmit={handleRequestSubmit}
            onClose={() => setShowRequestForm(false)}
          />
        ) : (
          <>
            {/* ── Fixed: Agentic Marketplace header card ── */}
            <div className="px-3 pt-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setPanelCollapsed(true)}
                className="flex items-center gap-3 px-4 py-3.5 bg-primary-tint-10 border border-brand-primary/20 rounded-xl w-full text-left hover:bg-brand-primary/15 transition-colors group"
                aria-label="Collapse Agentic Marketplace"
              >
                <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                  <i className="bi bi-stars text-white text-sm" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-900 leading-tight">Agentic Marketplace</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">AI-powered analysis agents</p>
                </div>
                <i className="bi bi-chevron-right text-neutral-400 text-xs flex-shrink-0 group-hover:text-brand-primary transition-colors" aria-hidden="true" />
              </button>
            </div>

            {/* ── Fixed: Run Selected bar — only when agents selected ── */}
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 px-3 pt-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={onRunSelected}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-dark transition-colors"
                >
                  <i className="bi bi-play-fill text-sm leading-none" aria-hidden="true" />
                  Run Selected ({selectedCount})
                </button>
                <button
                  type="button"
                  onClick={onClearSelected}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors whitespace-nowrap"
                >
                  Clear
                </button>
              </div>
            )}

            {/* ── Scrollable: category cards only ── */}
            <div className="flex-1 overflow-y-scroll min-h-0 px-3 py-2.5 flex flex-col gap-2.5 scrollbar-panel">
              {categories.map((category) => (
                <AgentCard
                  key={category.id}
                  category={category}
                  expanded={expandedCategories.has(category.id)}
                  onToggleExpand={toggleCategory}
                  selectedAgentIds={selectedAgentIds}
                  executionStates={executionStates}
                  onCheckAgent={onCheckAgent}
                  onRunAgent={onRunAgent}
                  onRunAll={onRunAll}
                />
              ))}
            </div>

            {/* ── Fixed: Request New Agent footer ── */}
            <div className="px-3 py-3 border-t border-neutral-200 bg-rd-body-bg flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowRequestForm(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-brand-primary text-brand-primary text-xs font-semibold hover:bg-brand-primary/5 transition-colors"
              >
                <i className="bi bi-plus text-sm" aria-hidden="true" />
                Request New Agent
              </button>
            </div>
          </>
        )}
      </aside>

      {toast && <Toast kind={toast.kind} message={toast.message} onDismiss={() => setToast(null)} />}
    </>
  );
}

export default AgentMarketplace;
