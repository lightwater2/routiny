import { forwardRef, type HTMLAttributes } from 'react';

type NumberInputSize = 'medium' | 'large';

interface NumberInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: NumberInputSize;
  disabled?: boolean;
}

export const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>(
  (
    {
      value = 0,
      onChange,
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      step = 1,
      size = 'large',
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const handleDecrease = () => {
      if (disabled) return;
      const newValue = Math.max(min, value - step);
      onChange?.(newValue);
    };

    const handleIncrease = () => {
      if (disabled) return;
      const newValue = Math.min(max, value + step);
      onChange?.(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const inputValue = e.target.value;
      if (inputValue === '' || inputValue === '-') {
        onChange?.(0);
        return;
      }
      const parsed = parseInt(inputValue, 10);
      if (!isNaN(parsed)) {
        const clampedValue = Math.min(max, Math.max(min, parsed));
        onChange?.(clampedValue);
      }
    };

    const isMinDisabled = value <= min;
    const isMaxDisabled = value >= max;

    const sizeStyles: Record<NumberInputSize, { height: string; padding: string; fontSize: string; buttonSize: string }> = {
      medium: {
        height: 'h-[40px]',
        padding: 'px-[4px]',
        fontSize: 'text-[15px]',
        buttonSize: 'w-[32px] h-[32px]',
      },
      large: {
        height: 'h-[48px]',
        padding: 'px-[4px]',
        fontSize: 'text-[17px]',
        buttonSize: 'w-[40px] h-[40px]',
      },
    };

    const styles = sizeStyles[size];

    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center gap-[4px]
          bg-[#F2F4F6]
          rounded-[12px]
          ${styles.height}
          ${styles.padding}
          ${disabled ? 'opacity-50' : ''}
          ${className}
        `}
        {...props}
      >
        {/* Decrease Button */}
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled || isMinDisabled}
          className={`
            ${styles.buttonSize}
            flex items-center justify-center
            rounded-[8px]
            transition-colors
            ${disabled || isMinDisabled
              ? 'text-[#D1D6DB] cursor-not-allowed'
              : 'text-[#4E5968] hover:bg-[#E5E8EB] active:bg-[#D1D6DB]'}
          `}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 10H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Value Input */}
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className={`
            w-[60px]
            text-center
            bg-transparent
            outline-none
            font-semibold
            ${styles.fontSize}
            text-[#333D48]
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        />

        {/* Increase Button */}
        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled || isMaxDisabled}
          className={`
            ${styles.buttonSize}
            flex items-center justify-center
            rounded-[8px]
            transition-colors
            ${disabled || isMaxDisabled
              ? 'text-[#D1D6DB] cursor-not-allowed'
              : 'text-[#4E5968] hover:bg-[#E5E8EB] active:bg-[#D1D6DB]'}
          `}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 5V15M5 10H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
