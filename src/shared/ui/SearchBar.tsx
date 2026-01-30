import { forwardRef, type InputHTMLAttributes, useState } from 'react';

type SearchBarSize = 'medium' | 'large';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: SearchBarSize;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      size = 'large',
      placeholder = '검색어를 입력하세요',
      value,
      onChange,
      onSearch,
      onClear,
      showClearButton = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue && String(currentValue).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue('');
      }
      onClear?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(String(currentValue));
      }
    };

    const sizeStyles: Record<SearchBarSize, string> = {
      medium: 'h-[44px] px-[16px] text-[15px]',
      large: 'h-[52px] px-[20px] text-[17px]',
    };

    return (
      <div
        className={`
          relative
          flex items-center gap-[12px]
          bg-[#F2F4F6]
          rounded-[12px]
          transition-all
          ${sizeStyles[size]}
          ${isFocused ? 'ring-2 ring-[#3183F6]' : ''}
          ${className}
        `}
      >
        {/* Search Icon */}
        <span className="shrink-0 text-[#3183F6]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 18L14 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            flex-1
            bg-transparent
            outline-none
            leading-[1.5]
            font-medium
            text-[#333D48]
            placeholder:text-[#B0B8C1]
          `}
          {...props}
        />

        {/* Clear Button */}
        {showClearButton && hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 w-[20px] h-[20px] flex items-center justify-center rounded-full bg-[#B0B8C1]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 3L9 9M9 3L3 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
