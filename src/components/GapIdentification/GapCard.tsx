import type { PrioritizedGap } from '../../types/evidence-gap-prioritization'

export interface GapCardProps {
  gap: PrioritizedGap
}

export default function GapCard({ gap }: GapCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 max-w-[200px]">
      <p className="text-[9px] font-semibold uppercase tracking-wide mb-0.5 leading-tight text-brand-primary">
        {gap.segment}
      </p>
      <p className="text-[10px] text-neutral-800 leading-snug">{gap.title}</p>
    </div>
  )
}
