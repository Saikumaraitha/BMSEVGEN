export interface EGOCardProps {
  label:     string
  title:     string
  bullets:   string[]
  selected?: boolean
  onClick?:  () => void
}

export default function EGOCard({
  label,
  title,
  bullets,
  selected = false,
  onClick,
}: EGOCardProps) {
  // Top section (header + title) background
  const topBg      = selected ? 'bg-brand-primary'       : 'bg-brand-primary-light'
  // Bottom section (bullets) background
  const bottomBg   = selected ? 'bg-brand-primary-light' : 'bg-white'
  // Divider matches the top section background colour
  const dividerBg  = selected ? 'bg-brand-primary'       : 'bg-brand-primary-light'

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`flex flex-col rounded-2xl overflow-hidden h-full transition-all
        ${selected ? 'border-2 border-brand-primary' : 'border border-brand-primary'}
        ${onClick ? ' cursor-pointer' : ''}`}
    >

      {/* ── Header + Title (same bg, no gap between them) ── */}
      <div className={`flex flex-col items-center px-4 pt-4 pb-3 gap-1.5 ${topBg}`}>
        <span className={`text-sm font-bold tracking-wide
          ${selected ? 'text-white' : 'text-brand-primary'}`}
        >
          {label}
        </span>
        <p className={`font-bold leading-snug text-center
          ${selected ? 'text-base text-white' : 'text-sm text-neutral-900'}`}
        >
          {title}
        </p>
      </div>

      {/* ── Divider — same colour as the top section ── */}
      <div className={`h-px ${dividerBg}`} />

      {/* ── Bullets ── */}
      <ul className={`flex flex-col gap-2 px-4 py-3 flex-1 ${bottomBg}`}>
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="mt-1 w-1 h-1 rounded-full bg-neutral-900 flex-shrink-0" />
            <span className="text-xs leading-snug text-neutral-700">
              {bullet}
            </span>
          </li>
        ))}
      </ul>

    </div>
  )
}
