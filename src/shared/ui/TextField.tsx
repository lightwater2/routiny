import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from 'react';

type TextFieldVariant = 'outlined' | 'filled';
type TextFieldSize = 'medium' | 'large';
type TextFieldState = 'default' | 'error' | 'success' | 'disabled';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  state?: TextFieldState;
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      variant = 'outlined',
      size = 'large',
      state = 'default',
      label,
      helperText,
      errorText,
      successText,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      value,
      onChange,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    const currentValue = value !== undefined ? value : internalValue;
    const isDisabled = disabled || state === 'disabled';
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

    const sizeStyles: Record<TextFieldSize, string> = {
      medium: 'h-[44px] px-[14px] text-[15px]',
      large: 'h-[52px] px-[16px] text-[17px]',
    };

    const variantStyles: Record<TextFieldVariant, string> = {
      outlined: `
        bg-white
        border
        ${state === 'error' ? 'border-[#F04452]' :
          state === 'success' ? 'border-[#15C67F]' :
          isFocused ? 'border-[#3183F6]' : 'border-[#E5E8EB]'}
      `,
      filled: `
        bg-[#F2F4F6]
        border-none
        ${isFocused ? 'ring-2 ring-[#3183F6]' : ''}
      `,
    };

    const stateTextColor = {
      default: 'text-[#333D48]',
      error: 'text-[#333D48]',
      success: 'text-[#333D48]',
      disabled: 'text-[#B0B8C1]',
    };

    const helperColor = {
      default: 'text-[#8B95A1]',
      error: 'text-[#F04452]',
      success: 'text-[#15C67F]',
      disabled: 'text-[#B0B8C1]',
    };

    const displayHelperText = state === 'error' ? errorText : state === 'success' ? successText : helperText;

    return (
      <div className={`flex flex-col gap-[6px] ${className}`}>
        {/* Label */}
        {label && (
          <label className="text-[13px] leading-[19.5px] font-medium text-[#6B7684]">
            {label}
          </label>
        )}

        {/* Input Container */}
        <div
          className={`
            relative
            flex items-center gap-[8px]
            rounded-[12px]
            transition-all
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            ${isDisabled ? 'bg-[#F2F4F6] cursor-not-allowed' : ''}
          `}
        >
          {/* Left Icon */}
          {leftIcon && (
            <span className="shrink-0 text-[#8B95A1]">
              {leftIcon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            value={currentValue}
            onChange={handleChange}
            disabled={isDisabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              flex-1
              bg-transparent
              outline-none
              leading-[1.5]
              font-medium
              placeholder:text-[#B0B8C1]
              ${stateTextColor[state]}
              ${isDisabled ? 'cursor-not-allowed' : ''}
            `}
            {...props}
          />

          {/* Clear Button */}
          {clearable && hasValue && !isDisabled && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 w-[20px] h-[20px] flex items-center justify-center rounded-full bg-[#D1D6DB]"
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

          {/* Right Icon */}
          {rightIcon && !clearable && (
            <span className="shrink-0 text-[#8B95A1]">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Helper Text */}
        {displayHelperText && (
          <span className={`text-[13px] leading-[19.5px] font-medium ${helperColor[state]}`}>
            {displayHelperText}
          </span>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
