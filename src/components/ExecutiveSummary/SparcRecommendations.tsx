import SparcIcon from '../../assets/icons/SPARC.svg'
import type { SparcRecommendation } from '../../types/executive-summary'

interface Props {
  recommendations: SparcRecommendation[]
}

export default function SparcRecommendations({ recommendations }: Props) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="flex items-center gap-2.5 px-4 py-2.5">
        <span className="flex items-center justify-center w-8 h-8 rounded-md bg-exec-icon-bg">
          <img src={SparcIcon} alt="" className="w-5 h-5" />
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-800">SPARC Recommendations</span>
          <span className="text-neutral-300 text-sm">|</span>
          <span className="text-xs font-bold text-neutral-800">Medsight Findings</span>
        </div>
      </div>

      <ul className="px-5 py-3 space-y-2">
        {recommendations.map((rec) => (
          <li key={rec.id} className="flex items-start gap-2 text-xs text-neutral-700 leading-relaxed">
            <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-primary" />
            {rec.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
