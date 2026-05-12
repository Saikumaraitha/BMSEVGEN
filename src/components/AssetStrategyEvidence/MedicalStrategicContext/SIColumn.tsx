import type { StrategicImperative } from '../../../types/medical-strategic-context'
import MORow from './MORow'

const SI_CONFIGS = [
  { headerBg: 'bg-si-header-1', labelColor: 'text-si-1-label', titleColor: 'text-si-1-title' },
  { headerBg: 'bg-si-header-2', labelColor: 'text-si-2-label', titleColor: 'text-si-2-title' },
  { headerBg: 'bg-si-header-3', labelColor: 'text-si-3-label', titleColor: 'text-si-3-title' },
] as const

interface SIColumnProps {
  imperative: StrategicImperative
  index:      number
}

export default function SIColumn({ imperative, index }: SIColumnProps) {
  const { headerBg, labelColor, titleColor } = SI_CONFIGS[index] ?? SI_CONFIGS[0]

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-neutral-200">
      <div className={`${headerBg} px-4 py-3`}>
        <p className={`text-xs font-bold ${labelColor} mb-1`}>{imperative.id}</p>
        <h3 className={`text-sm font-semibold ${titleColor} leading-snug`}>{imperative.title}</h3>
      </div>

      <div className="flex-1 divide-y divide-neutral-100">
        {imperative.objectives.map((mo, i) => (
          <MORow key={mo.id} mo={mo} alt={i % 2 !== 0} />
        ))}
      </div>
    </div>
  )
}
