import { useState, useRef } from 'react';

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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RequestAgentFormData {
  agentName: string;
  category: string;
  description: string;
  outputFormat: string;
  dataSources: string;
}

interface RequestNewAgentModalProps {
  existingAgentNames: string[];
  onSubmit: (data: RequestAgentFormData) => void;
  onClose: () => void;
}

// ─── Field label with optional required indicator ─────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="flex items-center gap-1 text-xs font-semibold text-neutral-700 mb-1.5">
      {label}
      {required && (
        <span className="text-red-500 font-bold leading-none" aria-label="required">
          *
        </span>
      )}
    </label>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function RequestNewAgentModal({
  existingAgentNames,
  onSubmit,
  onClose,
}: RequestNewAgentModalProps) {
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

    // AC 17: Duplicate agent name check (case-insensitive)
    const nameLower = agentName.trim().toLowerCase();
    const isDuplicate = existingAgentNames.some((n) => n.toLowerCase() === nameLower);
    if (isDuplicate) {
      setDuplicateError(true);
      agentNameRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate async submission
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // 90% success rate for demo; always succeeds in practice
          if (Math.random() > 0.05) { resolve(); } else { reject(new Error('Service unavailable')); }
        }, 800);
      });

      onSubmit({ agentName: agentName.trim(), category, description: description.trim(), outputFormat, dataSources: dataSources.trim() });
    } catch {
      // AC 16: submission failure — show error, retain values
      setSubmitError('Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <h2 className="text-base font-bold text-neutral-900">Request New Agent</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
            aria-label="Close"
          >
            <i className="bi bi-x text-xl leading-none" aria-hidden="true" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5 scrollbar-thin-styled">

          {/* AC 16.1: Submission error banner */}
          {submitError && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <i className="bi bi-exclamation-circle text-sm flex-shrink-0" aria-hidden="true" />
              <span className="flex-1">{submitError}</span>
              <button
                type="button"
                onClick={() => setSubmitError('')}
                className="flex-shrink-0 hover:text-red-900 transition-colors"
                aria-label="Dismiss error"
              >
                <i className="bi bi-x text-base leading-none" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* 1. Agent Name* */}
          <div>
            <FieldLabel label="Agent Name" required />
            <input
              ref={agentNameRef}
              type="text"
              value={agentName}
              onChange={(e) => handleAgentNameChange(e.target.value)}
              placeholder="e.g. Patient Journey Mapper"
              className={[
                'w-full border rounded-lg px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-colors',
                duplicateError
                  ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-300'
                  : 'border-neutral-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30',
              ].join(' ')}
            />
            {/* AC 17: Duplicate name inline error with X */}
            {duplicateError && (
              <div className="flex items-start gap-2 mt-1.5 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <i className="bi bi-exclamation-circle text-red-500 text-xs flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="flex-1 text-xs text-red-700 leading-snug">
                  A matching Agent Name exists. Please provide a different Agent Name.
                </p>
                {/* AC 17.1: X dismisses the error */}
                <button
                  type="button"
                  onClick={() => setDuplicateError(false)}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Dismiss"
                >
                  <i className="bi bi-x text-base leading-none" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* 2. Category */}
          <div>
            <FieldLabel label="Category" />
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-800 outline-none appearance-none bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors pr-8"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <i className="bi bi-chevron-down text-neutral-400 text-xs absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* 3. Description* */}
          <div>
            <FieldLabel label="Description" required />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what this agent should do, what questions it should answer..."
              className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none resize-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors"
            />
          </div>

          {/* 4. Preferred Output Format */}
          <div>
            <FieldLabel label="Preferred Output Format" />
            <div className="relative">
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-800 outline-none appearance-none bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors pr-8"
              >
                <option value="">Select format</option>
                {OUTPUT_FORMATS.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
              </select>
              <i className="bi bi-chevron-down text-neutral-400 text-xs absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* 5. Data Sources / References */}
          <div>
            <FieldLabel label="Data Sources / References" />
            <input
              type="text"
              value={dataSources}
              onChange={(e) => setDataSources(e.target.value)}
              placeholder="e.g., Clinical trials, congress abstracts, KOL interviews, internal data..."
              className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-colors"
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex-shrink-0 rounded-b-2xl">
          {/* AC: Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium text-neutral-600 border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>

          {/* AC: Submit Request — disabled until mandatory fields complete */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isMandatoryComplete || isSubmitting}
            className={[
              'px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2',
              isMandatoryComplete && !isSubmitting
                ? 'bg-brand-primary text-white hover:bg-brand-primary-dark'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed',
            ].join(' ')}
          >
            {isSubmitting && (
              <i className="bi bi-arrow-repeat text-sm animate-spin" aria-hidden="true" />
            )}
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestNewAgentModal;
