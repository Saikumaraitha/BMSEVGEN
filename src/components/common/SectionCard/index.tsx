import type { ReactNode } from 'react'

interface SectionCardProps {
  title:        string
  headerRight?: ReactNode
  children:     ReactNode
}

export default function SectionCard({ title, headerRight, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="block w-1 h-5 bg-brand-primary rounded" />
          <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
        </div>
        {headerRight && (
          <div className="flex items-center gap-4">{headerRight}</div>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
