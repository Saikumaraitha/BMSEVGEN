import type { MedicalObjective } from '../../../types/medical-strategic-context'

interface MORowProps {
  mo:  MedicalObjective
  alt: boolean
}

export default function MORow({ mo, alt }: MORowProps) {
  return (
    <div className={`flex items-start gap-3 px-3 py-2.5 ${alt ? 'bg-neutral-50' : 'bg-white'}`}>
      <span className="text-xs font-semibold text-mo-badge-text bg-mo-badge-bg px-2 py-0.5 rounded-lg whitespace-nowrap flex-shrink-0 leading-relaxed">
        {mo.id}
      </span>
      <p className="text-xs text-black leading-relaxed">{mo.description}</p>
    </div>
  )
}
