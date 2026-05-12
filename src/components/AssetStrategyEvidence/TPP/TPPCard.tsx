import type { TPPSection } from '../../../types/tpp'

export default function TPPCard({ section }: { section: TPPSection }) {
  return (
    <div className="relative bg-white rounded-xl border-t border-r border-b border-neutral-200 p-4 pl-5 flex flex-col gap-1.5 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-brand-primary-vivid" />
      <h3 className="text-sm font-bold leading-snug text-text-heading">{section.title}</h3>
      <p className="text-xs leading-relaxed text-text-dark">{section.content}</p>
    </div>
  )
}
