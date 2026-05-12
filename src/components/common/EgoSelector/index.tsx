import { useState, useRef, useEffect } from 'react'
import ChevronDownIcon from '../../../assets/icons/chevron-down.svg?react'

export interface EgoOption {
  id:    string
  label: string
  title: string
}

export interface EgoSelectorProps {
  egos:     EgoOption[]
  value:    string
  onChange: (id: string) => void
}

export default function EgoSelector({ egos, value, onChange }: Readonly<EgoSelectorProps>) {
  const [open, setOpen] = useState(false)
  const ref             = useRef<HTMLDivElement>(null)

  const selected = egos.find(e => e.id === value)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleSelect(id: string) {
    onChange(id)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative inline-block">

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="inline-flex items-stretch border-[1.5px] border-brand-primary rounded-full overflow-hidden cursor-pointer transition-[filter] hover:brightness-95 focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center px-3 py-[0.3rem] bg-brand-primary text-white text-xs font-semibold whitespace-nowrap tracking-[0.03em]">
          EGO View
        </span>
        <span className="flex items-center gap-1.5 px-3 py-[0.3rem] bg-brand-primary-light text-brand-primary text-sm font-medium whitespace-nowrap">
          {selected ? `${selected.label}:  ${selected.title}` : 'Select EGO'}
          <ChevronDownIcon
            className={`flex-shrink-0 w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          aria-label="Select EGO"
          className="absolute left-0 top-full mt-1.5 z-50 min-w-full w-max max-w-sm bg-white rounded-xl shadow-lg border border-neutral-200 py-1 overflow-hidden"
        >
          {egos.map(ego => {
            const isSelected = ego.id === value
            return (
              <button
                key={ego.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(ego.id)}
                className={[
                  'w-full text-left px-4 py-2.5 text-sm transition-colors flex items-baseline gap-1.5',
                  isSelected
                    ? 'bg-brand-primary-light text-brand-primary font-medium'
                    : 'text-neutral-700 hover:bg-neutral-50',
                ].join(' ')}
              >
                <span className="font-semibold whitespace-nowrap flex-shrink-0">{ego.label}:</span>
                <span className="leading-snug">{ego.title}</span>
              </button>
            )
          })}
        </div>
      )}

    </div>
  )
}
