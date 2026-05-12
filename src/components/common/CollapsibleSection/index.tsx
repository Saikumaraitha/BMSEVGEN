import { useState } from 'react'

export interface CollapsibleSectionProps {
  title:            string
  children:         React.ReactNode
  defaultExpanded?: boolean
  /** Controlled expanded state — when provided, internal state is ignored */
  expanded?:        boolean
  /** Called when the user clicks the toggle button */
  onToggle?:        (next: boolean) => void
  /** When true the section is locked collapsed and the expand button is disabled */
  disableExpand?:   boolean
}

export default function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
  expanded:        controlledExpanded,
  onToggle,
  disableExpand = false,
}: CollapsibleSectionProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)

  const isControlled = controlledExpanded !== undefined
  const expanded     = isControlled ? controlledExpanded : internalExpanded

  function handleToggle() {
    const next = !expanded
    if (isControlled) {
      onToggle?.(next)
    } else {
      setInternalExpanded(next)
      onToggle?.(next)
    }
  }

  const canExpand = expanded || !disableExpand

  return (
    <div className="w-full">

      {/* Section header */}
      <div className="relative flex items-center w-full py-1">

        {/* Dotted line — full width behind everything */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dotted border-section-divider" />

        {/* Centred title badge */}
        <div className="relative mx-auto">
          <span className="bg-section-title text-white text-[11px] font-bold tracking-widest uppercase rounded-full px-5 py-1.5 whitespace-nowrap">
            {title}
          </span>
        </div>

        {/* Collapse / Expand toggle */}
        <button
          type="button"
          onClick={canExpand ? handleToggle : undefined}
          disabled={!canExpand && !expanded}
          className={[
            'relative flex items-center gap-1 text-xs transition-colors whitespace-nowrap bg-white pl-2',
            canExpand
              ? 'text-neutral-400 hover:text-neutral-600 cursor-pointer'
              : 'text-neutral-300 cursor-not-allowed',
          ].join(' ')}
          aria-expanded={expanded}
        >
          {expanded ? '— COLLAPSE' : '+ EXPAND'}
        </button>

      </div>

      {/* Collapsible content */}
      {expanded && (
        <div className="mt-4">
          {children}
        </div>
      )}

    </div>
  )
}
