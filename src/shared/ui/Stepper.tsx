import { forwardRef, type HTMLAttributes } from 'react';

type StepperSize = 'tiny' | 'small' | 'medium' | 'large';

interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  size?: StepperSize;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

const sizeStyles: Record<StepperSize, {
  height: string;
  valueWidth: string;
  buttonPadding: string;
  fontSize: string;
  lineHeight: string;
  iconSize: number;
  borderRadius: string;
}> = {
  tiny: {
    height: 'h-[32px]',
    valueWidth: 'w-[32px]',
    buttonPadding: 'px-[8px]',
    fontSize: 'text-[13px]',
    lineHeight: 'leading-[19.5px]',
    iconSize: 14,
    borderRadius: 'rounded-[8px]',
  },
  small: {
    height: 'h-[38px]',
    valueWidth: 'w-[40px]',
    buttonPadding: 'px-[10px]',
    fontSize: 'text-[15px]',
    lineHeight: 'leading-[22.5px]',
    iconSize: 16,
    borderRadius: 'rounded-[10px]',
  },
  medium: {
    height: 'h-[46px]',
    valueWidth: 'w-[48px]',
    buttonPadding: 'px-[12px]',
    fontSize: 'text-[17px]',
    lineHeight: 'leading-[25.5px]',
    iconSize: 18,
    borderRadius: 'rounded-[12px]',
  },
  large: {
    height: 'h-[56px]',
    valueWidth: 'w-[56px]',
    buttonPadding: 'px-[14px]',
    fontSize: 'text-[17px]',
    lineHeight: 'leading-[25.5px]',
    iconSize: 20,
    borderRadius: 'rounded-[14px]',
  },
};

const MinusIcon = ({ size, disabled }: { size: number; disabled: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19"
      stroke={disabled ? '#B0B8C1' : '#4E5968'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const PlusIcon = ({ size, disabled }: { size: number; disabled: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5V19M5 12H19"
      stroke={disabled ? '#B0B8C1' : '#4E5968'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      value = 0,
      size = 'medium',
      min = 0,
      max = 999,
      disabled = false,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size];
    const isMinDisabled = disabled || value <= min;
    const isMaxDisabled = disabled || value >= max;

    const handleDecrement = () => {
      if (!isMinDisabled && onChange) {
        onChange(Math.max(min, value - 1));
      }
    };

    const handleIncrement = () => {
      if (!isMaxDisabled && onChange) {
        onChange(Math.min(max, value + 1));
      }
    };

    const displayValue = value > 999 ? '999+' : value;

    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center
          bg-[#F2F4F6]
          ${styles.height}
          ${styles.borderRadius}
          ${disabled ? 'opacity-50' : ''}
          ${className}
        `}
        {...props}
      >
        {/* Minus Button */}
        <button
          type="button"
          disabled={isMinDisabled}
          onClick={handleDecrement}
          className={`
            flex items-center justify-center
            ${styles.height}
            ${styles.buttonPadding}
            ${isMinDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            transition-opacity
          `}
        >
          <MinusIcon size={styles.iconSize} disabled={isMinDisabled} />
        </button>

        {/* Value Display */}
        <div
          className={`
            flex items-center justify-center
            ${styles.valueWidth}
            ${styles.height}
            ${styles.fontSize}
            ${styles.lineHeight}
            font-semibold
            text-[#333D48]
            bg-white
            ${styles.borderRadius}
          `}
        >
          {displayValue}
        </div>

        {/* Plus Button */}
        <button
          type="button"
          disabled={isMaxDisabled}
          onClick={handleIncrement}
          className={`
            flex items-center justify-center
            ${styles.height}
            ${styles.buttonPadding}
            ${isMaxDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            transition-opacity
          `}
        >
          <PlusIcon size={styles.iconSize} disabled={isMaxDisabled} />
        </button>
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

export default Stepper;
