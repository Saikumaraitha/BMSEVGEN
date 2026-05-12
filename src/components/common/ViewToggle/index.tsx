export interface ViewToggleOption {
  value: string
  label: string
}

export interface ViewToggleProps {
  options:  ViewToggleOption[]
  value:    string
  onChange: (value: string) => void
}

export default function ViewToggle({ options, value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full bg-purple-100 p-1 gap-0.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all duration-200 ${
            value === opt.value
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-brand-primary hover:text-brand-primary/80'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
