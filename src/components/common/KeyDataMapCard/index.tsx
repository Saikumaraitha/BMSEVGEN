import SparkleIconSvg from '../../../assets/icons/sparkle.svg?react'
import GearIconSvg from '../../../assets/icons/gear.svg?react'

export const TRIAL_SNAPSHOT_COLORS = {
  tealDark:  '#0E6B6B',
  teal:      '#00A3A3',
  tealLight: '#80D4D4',
  mauve:     '#C4A5A5',
  primary:   '#BE2BBB',
  pinkLight: '#F4B8C8',
} as const

export const REGION_CHART_COLORS = {
  northAmerica: '#0047BB',
  europe:       '#3A86FF',
  asiaPacific:  '#48CAE4',
  latinAmerica: '#90E0EF',
  mea:          '#ADE8F4',
}

export const SEVERITY_CHART_COLORS = {
  mild:        '#ADE8F4',
  moderate:    '#48CAE4',
  severe:      '#0077B6',
  refractory:  '#03045E',
}

export const MARKET_SHARE_COLORS = {
  risankizumab:    '#6A0572',
  secukinumab:     '#1D3557',
  ixekizumab:      '#457B9D',
  guselkumab:      '#A8DADC',
  bimekizumab:     '#2EC4B6',
  ustekinumab:     '#FFBF69',
  adalimumab:      '#FF9F1C',
  deucravacitinib: '#0047BB',
  other:           '#CCC',
}

// Priority badge colours
const PRIORITY_STYLES: Record<string, string> = {
  High:                 'bg-kdm-priority-high-bg    text-kdm-priority-high-text',
  Medium:               'bg-kdm-priority-medium-bg  text-kdm-priority-medium-text',
  Low:                  'bg-kdm-priority-low-bg     text-kdm-priority-low-text',
  'Special Population': 'bg-kdm-priority-sp-bg      text-kdm-priority-sp-text',
}

// Fixed colours for known tag names; unknown tags cycle through the fallback list
const NAMED_TAG_STYLES: Record<string, string> = {
  'Brain Mets': 'bg-tag-teal-bg   text-tag-teal-text',
  'VEGF':       'bg-tag-violet-bg text-tag-violet-text',
  '2L':         'bg-tag-indigo-bg text-tag-indigo-text',
}
const FALLBACK_TAG_STYLES = [
  'bg-tag-pink-bg text-tag-pink-text',
  'bg-tag-cyan-bg text-tag-cyan-text',
  'bg-tag-rose-bg text-tag-rose-text',
]

export interface KeyDataMapCardProps {
  indication: string
  type:       'Existing Gap' | 'AI-Driven'
  gap:        string
  rationale:  string
  priority:   string
  tags:       string[]
  isLinked?:  boolean
  onClick?:   () => void
}

function SparkleIcon() {
  return <SparkleIconSvg className="flex-shrink-0 mt-0.5 w-4 h-4" aria-hidden="true" />
}

function GearIcon() {
  return <GearIconSvg className="flex-shrink-0 mt-0.5 w-4 h-4" aria-hidden="true" />
}

let fallbackIndex = 0

export default function KeyDataMapCard({
  indication,
  type,
  gap,
  rationale,
  priority,
  tags,
  isLinked = false,
  onClick,
}: KeyDataMapCardProps) {
  const priorityStyle = PRIORITY_STYLES[priority] ?? 'bg-kdm-priority-low-bg text-kdm-priority-low-text'

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden shadow-sm border-2 transition-all
        ${isLinked ? 'border-brand-primary shadow-md' : 'border-neutral-200'}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-brand-primary/60' : ''}`}
      onClick={onClick}
    >

      {/* ── Header — bg: --color-primary-light (#F8F3F2), text: --color-card-header-text (#785253) ── */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-brand-primary-light border-b border-brand-primary-light">
        <span className="text-sm font-semibold text-card-header-text">{indication}</span>
        <span className="text-xs font-medium text-card-header-text">{type}</span>
      </div>

      {/* ── Body — bg: white ── */}
      <div className="flex flex-col gap-3 px-4 py-3 flex-1 bg-white">

        {/* GAP */}
        <div className="flex flex-col gap-1 border border-neutral-200 rounded-lg px-2.5 py-2">
          <div className="flex items-start gap-1.5 text-brand-primary">
            <SparkleIcon />
            <span className="text-xs font-bold tracking-wide leading-none pt-0.5">GAP:</span>
          </div>
          <p className="text-xs leading-snug pl-5 text-card-body-text">{gap}</p>
        </div>

        {/* Separator */}
        <div className="border-t border-neutral-200" />

        {/* RATIONALE */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-1.5 text-neutral-900">
            <GearIcon />
            <span className="text-xs font-bold tracking-wide leading-none pt-0.5">RATIONALE:</span>
          </div>
          <p className="text-xs leading-snug pl-5 text-card-body-text">{rationale}</p>
        </div>

      </div>

      {/* ── Footer tags — right-aligned ── */}
      <div className="flex flex-wrap items-center justify-end gap-1.5 px-4 py-2.5 bg-white border-t border-neutral-100">
        {tags.map((tag) => {
          const style = NAMED_TAG_STYLES[tag] ?? FALLBACK_TAG_STYLES[fallbackIndex++ % FALLBACK_TAG_STYLES.length]
          return (
            <span key={tag} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
              {tag}
            </span>
          )
        })}
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityStyle}`}>
          {priority}
        </span>
      </div>

    </div>
  )
}
