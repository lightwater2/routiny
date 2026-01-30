import { forwardRef, type HTMLAttributes } from 'react';

type ProgressBarSize = 'thin' | 'normal' | 'thick';
type ProgressBarColor = 'blue' | 'red' | 'green' | 'gray';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: ProgressBarSize;
  color?: ProgressBarColor;
}

const sizeMap: Record<ProgressBarSize, string> = {
  thin: 'h-[4px]',
  normal: 'h-[8px]',
  thick: 'h-[12px]',
};

const colorMap: Record<ProgressBarColor, string> = {
  blue: 'bg-[#3183F6]',
  red: 'bg-[#F04251]',
  green: 'bg-[#15C67F]',
  gray: 'bg-[#6B7684]',
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      size = 'normal',
      color = 'blue',
      className = '',
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={`
          w-full
          ${sizeMap[size]}
          bg-[#E5E8EB]
          rounded-full
          overflow-hidden
          ${className}
        `}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div
          className={`
            h-full
            ${colorMap[color]}
            rounded-full
            transition-all duration-300 ease-out
          `}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
