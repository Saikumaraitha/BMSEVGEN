import { useEffect, useRef, useState } from 'react';
import DropdownIcon from '../../assets/icons/Dropdown.svg?react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  transparent?: boolean;
  noBorder?: boolean;
  valueColor?: string;
  triggerClassName?: string;
  className?: string;
}

function Select({ value, onChange, options, placeholder = 'Select', disabled = false, transparent = false, noBorder = false, valueColor, triggerClassName, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  function close() {
    setIsOpen(false);
    setCursor(-1);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setCursor(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) { setIsOpen(true); setCursor(0); return; }
      setCursor((c) => Math.min(c + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && isOpen && cursor >= 0) {
      onChange(options[cursor].value);
      close();
    } else if (e.key === 'Escape') {
      close();
    }
  }

  function handleSelect(optValue: string) {
    onChange(optValue);
    close();
  }

  return (
    <div ref={containerRef} className={`relative${className ? ` ${className}` : ''}`}>
      <button
        type="button"
        onClick={() => { if (!disabled) setIsOpen((o) => !o); }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={[
          `w-full flex items-center justify-between px-3 py-2.5 rounded-sm font-semibold text-sm focus:outline-none ${noBorder ? 'focus:ring-0' : 'focus:ring-2 focus:ring-brand-primary-light'}`,
          (!noBorder && isOpen) ? 'border border-brand-primary bg-select-bg' : `border-0 ${(transparent || noBorder) ? 'bg-transparent' : 'bg-[#F2F6FB]'}`,
          value ? (valueColor ?? 'text-brand-primary') : 'text-select-placeholder',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          triggerClassName ?? '',
        ].join(' ')}
      >
        <span>{selectedLabel ?? placeholder}</span>
        <DropdownIcon
          className={[
            'w-3 h-3 flex-shrink-0 transition-transform duration-200',
            isOpen ? '' : 'rotate-180',
          ].join(' ')}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 w-full mt-1 z-50 bg-white border border-dropdown-border rounded-sm shadow-[0_5px_15px_0_rgba(0,0,0,0.10)] max-h-[175px] overflow-y-auto scrollbar-thin-styled">
          {options.map((opt, i) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={[
                `px-3 py-2 ${noBorder ? 'text-10' : 'text-sm'} cursor-pointer hover:bg-dropdown-value-bg hover:text-brand-primary hover:font-semibold`,
                opt.value === value || cursor === i
                  ? 'bg-dropdown-value-bg text-brand-primary font-semibold'
                  : '',
              ].join(' ')}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
