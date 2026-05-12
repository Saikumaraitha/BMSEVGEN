import { useState, useEffect } from 'react'
import SparkleIconSvg from '../../../assets/icons/sparkle.svg?react'
import CloseIcon from '../../../assets/icons/close.svg?react'
import type { GapDetailRationaleData } from '../../../types/evidence-gap-summary'


interface GapDetailModalProps {
  data:    GapDetailRationaleData
  onClose: () => void
}

function SparkleIcon() {
  return <SparkleIconSvg className="flex-shrink-0 mt-px w-[14px] h-[14px]" aria-hidden="true" />
}

export default function GapDetailModal({ data, onClose }: GapDetailModalProps) {
  const [activeTab, setActiveTab] = useState(data.tabs[0]?.id ?? '')

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const currentTab = data.tabs.find(t => t.id === activeTab)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* ── Header: title + gap statement stacked, X on the right ── */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-neutral-200" style={{ backgroundColor: 'var(--color-modal-header-bg)' }}>
          <div className="flex flex-col gap-2 flex-1 pr-4">
            <span className="text-sm font-bold text-neutral-800 tracking-wide">Detailed Rationale</span>
            <div className="flex items-start gap-1.5 text-brand-primary">
              <SparkleIcon />
              <span className="text-xs font-bold tracking-wide leading-none pt-px">GAP:</span>
              <span className="text-xs leading-snug text-card-body-text font-medium">{data.gapStatement}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-[15px] h-[15px]" aria-hidden="true" />
          </button>
        </div>

        {/* ── Tabs: underline style ── */}
        <div className="flex border-b border-neutral-200 px-5">
          {data.tabs.map(tab => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'px-3 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px',
                  isActive
                    ? 'text-brand-primary border-brand-primary'
                    : 'text-neutral-400 border-transparent hover:text-neutral-600',
                ].join(' ')}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ── Tab content: each item as a card ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {currentTab?.items.map((item, i) => (
            <div key={i} className="flex flex-col gap-2 border border-neutral-200 rounded-lg px-4 py-3 bg-white">

              {/* Optional drug/entity title */}
              {item.title && (
                <span className="text-xs font-bold text-brand-primary">{item.title}</span>
              )}

              {/* Body text */}
              <p className="text-xs leading-relaxed text-neutral-700">{item.text}</p>

              {/* Study links */}
              {item.studyLinks && item.studyLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 px-2 py-1.5 rounded" >
                  <div style={{ backgroundColor: 'var(--color-modal-studies-bg)' }}><span className="text-xs font-semibold text-neutral-500">Studies:</span></div>
                  {item.studyLinks.map((link, j) => (
                    <a
                      key={j}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-primary hover:underline break-all"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
