import { useRef } from 'react'
import PageHeader from '../common/PageHeader'
import ModalityLabel from './ModalityLabel'
import SummarySectionCard from './SummarySectionCard'
import SparcRecommendations from './SparcRecommendations'
import type { ExecutiveSummaryPageData } from '../../types/executive-summary'

interface Props {
  data:    ExecutiveSummaryPageData
  assetId: string
}

export default function ExecutiveSummaryContent({ data, assetId }: Props) {
  const topRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={topRef} className="flex flex-col gap-5 pb-8">
      <PageHeader title="Executive Summary" onExport={() => {}} />

      <ModalityLabel modality={data.modality} />

      <div className="grid grid-cols-2 gap-4 px-6">
        {data.sections.map((section) => (
          <SummarySectionCard key={section.id} section={section} assetId={assetId} />
        ))}
      </div>

      <div className="px-6">
        <SparcRecommendations recommendations={data.sparcRecommendations} />
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={() => topRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="text-sm font-medium text-brand-primary underline underline-offset-2 hover:opacity-80 transition-opacity bg-transparent border-0 cursor-pointer"
        >
          Back to Top
        </button>
      </div>
    </div>
  )
}
