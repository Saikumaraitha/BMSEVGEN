const COLOR_SCHEMES = {
  orange: {
    card:  'bg-si-card-orange-bg border-si-card-orange-border',
    badge: 'bg-si-card-orange-badge text-white',
  },
  blue: {
    card:  'bg-si-card-blue-bg border-si-card-blue-border',
    badge: 'bg-si-card-blue-badge text-white',
  },
  teal: {
    card:  'bg-si-card-teal-bg border-si-card-teal-border',
    badge: 'bg-si-card-teal-badge text-white',
  },
} as const

type ColorScheme = keyof typeof COLOR_SCHEMES

export interface StrategicImperativeCardProps {
  label:       string
  title:       string
  colorScheme: ColorScheme
}

export default function StrategicImperativeCard({
  label,
  title,
  colorScheme,
}: StrategicImperativeCardProps) {
  const colors = COLOR_SCHEMES[colorScheme]

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 h-full ${colors.card}`}>
      <span
        className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold leading-none ${colors.badge}`}
      >
        {label}
      </span>
      <p className="text-sm text-neutral-700 leading-snug">{title}</p>
    </div>
  )
}
