import { useNavigate } from 'react-router-dom'
import type { SummarySection } from '../../types/executive-summary'
import { buildPath } from '../../constants/routes'
import SummaryItemRow from './SummaryItemRow'

interface Props {
  section: SummarySection
  assetId: string
}

export default function SummarySectionCard({ section, assetId }: Props) {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(buildPath(section.viewDetailsRoute, { assetId }))
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-8 h-8 rounded-md bg-exec-icon-bg">
            <img src={section.iconSrc} alt="" className="w-5 h-5" />
          </span>
          <h3 className="text-card-title font-semibold text-text-dark">{section.title}</h3>
        </div>
        <button
          onClick={handleViewDetails}
          className="flex items-center gap-1 text-detail-link font-medium text-brand-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
        >
          View Details
          <i className="bi bi-chevron-right text-detail-link" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 px-3 pt-1 pb-3">
        {section.items.map((item) => (
          <SummaryItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
