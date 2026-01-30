import { forwardRef, type InputHTMLAttributes } from 'react';

type CheckboxShape = 'circle' | 'line';
type CheckboxSize = 'tiny' | 'small' | 'medium' | 'large';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  shape?: CheckboxShape;
  size?: CheckboxSize;
  checked?: boolean;
}

const sizeMap: Record<CheckboxSize, number> = {
  tiny: 16,
  small: 20,
  medium: 24,
  large: 30,
};

// 원형 체크박스 아이콘 (체크된 상태)
const CircleCheckedIcon = ({ size, color = '#3183f6' }: { size: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill={color} />
    <path
      d="M7 12.5L10.5 16L17 8.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 원형 체크박스 아이콘 (체크 안된 상태)
const CircleUncheckedIcon = ({ size, color = '#e5e8eb' }: { size: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="2" fill="none" />
    <path
      d="M7 12.5L10.5 16L17 8.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 라인 체크박스 아이콘 (체크된 상태)
const LineCheckedIcon = ({ size, color = '#3183f6' }: { size: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 12.5L9.5 18L20 6"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 라인 체크박스 아이콘 (체크 안된 상태)
const LineUncheckedIcon = ({ size, color = '#e5e8eb' }: { size: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 12.5L9.5 18L20 6"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      shape = 'circle',
      size = 'medium',
      checked = false,
      disabled = false,
      className = '',
      onChange,
      ...props
    },
    ref
  ) => {
    const iconSize = sizeMap[size];

    const renderIcon = () => {
      if (shape === 'circle') {
        return checked ? (
          <CircleCheckedIcon size={iconSize} />
        ) : (
          <CircleUncheckedIcon size={iconSize} />
        );
      }
      return checked ? (
        <LineCheckedIcon size={iconSize} />
      ) : (
        <LineUncheckedIcon size={iconSize} />
      );
    };

    return (
      <label
        className={`
          inline-flex items-center cursor-pointer
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <span className="inline-flex items-center justify-center">
          {renderIcon()}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
