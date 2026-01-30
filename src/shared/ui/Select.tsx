import { forwardRef, type HTMLAttributes, useState, useRef, useEffect } from 'react';

type SelectSize = 'medium' | 'large';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: SelectSize;
  disabled?: boolean;
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = '선택해주세요',
      size = 'large',
      disabled = false,
      label,
      error,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');
    const containerRef = useRef<HTMLDivElement>(null);

    const currentValue = value !== undefined ? value : internalValue;
    const selectedOption = options.find((opt) => opt.value === currentValue);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
      if (value === undefined) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
      setIsOpen(false);
    };

    const sizeStyles: Record<SelectSize, { height: string; padding: string; fontSize: string }> = {
      medium: {
        height: 'h-[44px]',
        padding: 'px-[14px]',
        fontSize: 'text-[15px]',
      },
      large: {
        height: 'h-[52px]',
        padding: 'px-[16px]',
        fontSize: 'text-[17px]',
      },
    };

    const styles = sizeStyles[size];

    return (
      <div ref={ref} className={`flex flex-col gap-[6px] ${className}`} {...props}>
        {/* Label */}
        {label && (
          <label className="text-[13px] leading-[19.5px] font-medium text-[#6B7684]">
            {label}
          </label>
        )}

        {/* Select Container */}
        <div ref={containerRef} className="relative">
          {/* Trigger */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`
              w-full
              flex items-center justify-between gap-[8px]
              bg-[#F2F4F6]
              rounded-[12px]
              transition-all
              ${styles.height}
              ${styles.padding}
              ${styles.fontSize}
              ${isOpen ? 'ring-2 ring-[#3183F6]' : ''}
              ${error ? 'ring-2 ring-[#F04452]' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span
              className={`
                font-medium leading-[1.5] truncate
                ${selectedOption ? 'text-[#333D48]' : 'text-[#B0B8C1]'}
              `}
            >
              {selectedOption?.label || placeholder}
            </span>

            {/* Arrow Icon */}
            <span
              className={`
                shrink-0 text-[#8B95A1]
                transition-transform
                ${isOpen ? 'rotate-180' : ''}
              `}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div
              className="
                absolute z-50
                top-full left-0 right-0
                mt-[4px]
                bg-white
                rounded-[12px]
                shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]
                border border-[#E5E8EB]
                overflow-hidden
                max-h-[240px]
                overflow-y-auto
              "
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={`
                    w-full
                    flex items-center
                    ${styles.height}
                    ${styles.padding}
                    ${styles.fontSize}
                    font-medium
                    text-left
                    transition-colors
                    ${option.value === currentValue
                      ? 'bg-[#F2F4F6] text-[#3183F6]'
                      : option.disabled
                        ? 'text-[#D1D6DB] cursor-not-allowed'
                        : 'text-[#333D48] hover:bg-[#F2F4F6]'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error Text */}
        {error && (
          <span className="text-[13px] leading-[19.5px] font-medium text-[#F04452]">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
