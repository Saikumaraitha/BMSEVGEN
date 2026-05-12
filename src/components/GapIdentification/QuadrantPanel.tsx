import type { PrioritizedGap, MatrixQuadrant } from '../../types/evidence-gap-prioritization'
import GapCard from './GapCard'

export interface QuadrantPanelProps {
  quadrant: MatrixQuadrant
  gaps:     PrioritizedGap[]
}

export default function QuadrantPanel({ quadrant, gaps }: QuadrantPanelProps) {
  return (
    <div className="flex flex-col gap-2 p-3 overflow-auto pointer-events-auto">
      <div className="flex justify-center">
        <span
          className="rounded-full px-3 py-0.5 text-[10px] font-bold text-white tracking-wide whitespace-nowrap"
          style={{ backgroundColor: quadrant.badgeColor }}
        >
          {quadrant.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 content-start">
        {gaps.map(gap => <GapCard key={gap.id} gap={gap} />)}
        {gaps.length === 0 && (
          <p className="text-xs text-neutral-400 italic px-1">No gaps</p>
        )}
      </div>
    </div>
  )
}
