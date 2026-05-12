import type { SummaryItem } from '../../types/executive-summary'

interface Props {
  item: SummaryItem
}

export default function SummaryItemRow({ item }: Props) {
  return (
    <div className="flex gap-3 px-4 py-3 bg-exec-row-bg rounded-xl">
      <div className="flex-1 min-w-0">
        {item.title && (
          <p className="text-xs font-semibold text-brand-primary mb-1">{item.title}</p>
        )}
        <p className="text-xs text-neutral-700 leading-relaxed">
          {item.body}
          {item.url && (
            <>
              {' '}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link hover:underline break-all"
              >
                {item.url}
              </a>
            </>
          )}
        </p>
      </div>
      {item.isNew && (
        <div className="shrink-0 mt-0.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-brand-primary bg-exec-new-badge-bg">
            New
          </span>
        </div>
      )}
    </div>
  )
}
