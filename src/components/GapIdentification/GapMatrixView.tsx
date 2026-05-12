import type { PrioritizedGap, MatrixQuadrant } from '../../types/evidence-gap-prioritization'
import QuadrantPanel from './QuadrantPanel'

const TIME_HORIZON_LABELS: Record<string, string> = {
  'Short-term': 'Short-term (<2 years)',
  'Long-term':  'Long-term (2+ years)',
}

export interface GapMatrixViewProps {
  readonly gaps:        PrioritizedGap[]
  readonly quadrants:   MatrixQuadrant[]
  readonly egoLabel?:   string
  readonly yAxisLabel?: string
  readonly xAxisLabel?: string
}

export default function GapMatrixView({
  gaps,
  quadrants,
  egoLabel,
  yAxisLabel = 'EXPECTED IMPACT',
  xAxisLabel = 'URGENCY',
}: GapMatrixViewProps) {
  const topLeft  = quadrants.find(q => q.impact === 'High'       && q.timeHorizon === 'Short-term')!
  const topRight = quadrants.find(q => q.impact === 'High'       && q.timeHorizon === 'Long-term')!
  const botLeft  = quadrants.find(q => q.impact === 'Low-Medium' && q.timeHorizon === 'Short-term')!
  const botRight = quadrants.find(q => q.impact === 'Low-Medium' && q.timeHorizon === 'Long-term')!

  const yTopLabel    = topLeft.impact
  const yBottomLabel = botLeft.impact
  const xLeftLabel   = TIME_HORIZON_LABELS[topLeft.timeHorizon]  ?? topLeft.timeHorizon
  const xRightLabel  = TIME_HORIZON_LABELS[topRight.timeHorizon] ?? topRight.timeHorizon

  function gapsFor(q: MatrixQuadrant) {
    return gaps.filter(g => g.impact === q.impact && g.timeHorizon === q.timeHorizon)
  }

  return (
    <div className="overflow-x-auto">
    <div className="flex flex-col gap-3 p-4 min-w-[520px]">

      {egoLabel && (
        <p className="text-base font-semibold text-center m-0 text-[var(--color-primary)]">
          {egoLabel}
        </p>
      )}

      {/* Outer wrapper reserves space for axis strips */}
      <div className="relative ps-[72px] pb-[48px]">

        {/* ── Y-axis strip (left) ── */}
        <div className="absolute start-0 top-0 bottom-[48px] w-[72px] flex flex-col items-center pt-[2px]">
          <span className="text-[9px] font-bold whitespace-nowrap text-brand-primary">{yTopLabel}</span>
          <div className="flex-1 flex items-center">
            <span
              className="rounded-full text-white text-[9px] font-bold tracking-widest whitespace-nowrap bg-[var(--color-primary)] [writing-mode:vertical-rl] rotate-180 block py-3 px-1"
            >
              {yAxisLabel}
            </span>
          </div>
          <span className="text-[9px] font-bold whitespace-nowrap text-center leading-tight text-brand-primary">
            {yBottomLabel.split('-').map((part, i) => (
              <span key={i}>{i > 0 && <br />}{part}{i < yBottomLabel.split('-').length - 1 ? '-' : ''}</span>
            ))}
          </span>
        </div>

        {/* ── Chart area ── no outer box; only left + bottom axis lines ── */}
        <div className="relative min-h-[550px] overflow-visible">

          {/* Quadrant background fills */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
            <div style={{ backgroundColor: topLeft.bgColor }} />
            <div style={{ backgroundColor: topRight.bgColor }} />
            <div style={{ backgroundColor: botLeft.bgColor }} />
            <div style={{ backgroundColor: botRight.bgColor }} />
          </div>

          {/* Y-axis line — left edge only */}
          <div className="absolute top-0 bottom-0 start-0 w-[1.5px] bg-[var(--color-primary)] pointer-events-none" />
          {/* Y-axis arrowhead — top of line */}
          <div className="absolute top-[-7px] start-[-3.25px] w-0 h-0 border-s-[4px] border-s-transparent border-e-[4px] border-e-transparent border-b-[7px] border-b-[var(--color-primary)] pointer-events-none" />

          {/* X-axis line — bottom edge only */}
          <div className="absolute start-0 end-0 bottom-0 h-[1.5px] bg-[var(--color-primary)] pointer-events-none" />
          {/* X-axis arrowhead — right end of line */}
          <div className="absolute end-[-7px] bottom-[-3.25px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-s-[7px] border-s-[var(--color-primary)] pointer-events-none" />

          {/* Center dividing lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 bottom-0 start-[50%] w-px bg-[var(--color-neutral-300)]" />
            <div className="absolute start-0 end-0 top-[50%] h-px bg-[var(--color-neutral-300)]" />
          </div>

          {/* Card overlay — 2×2 grid */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
            <QuadrantPanel quadrant={topLeft}  gaps={gapsFor(topLeft)}  />
            <QuadrantPanel quadrant={topRight} gaps={gapsFor(topRight)} />
            <QuadrantPanel quadrant={botLeft}  gaps={gapsFor(botLeft)}  />
            <QuadrantPanel quadrant={botRight} gaps={gapsFor(botRight)} />
          </div>
        </div>

        {/* ── X-axis strip (bottom) ── */}
        <div className="absolute bottom-0 start-[72px] end-0 h-[48px] flex items-center gap-2">
          <span className="text-[9px] font-bold whitespace-nowrap text-brand-primary">{xLeftLabel}</span>
          <div className="flex-1 flex justify-center">
            <span
              className="rounded-full text-white text-[9px] font-bold tracking-widest whitespace-nowrap bg-[var(--color-primary)] py-1 px-4"
            >
              {xAxisLabel}
            </span>
          </div>
          <span className="text-[9px] font-bold whitespace-nowrap text-brand-primary">{xRightLabel}</span>
        </div>

      </div>
    </div>
    </div>
  )
}
