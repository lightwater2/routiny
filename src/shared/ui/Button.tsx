import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonSize = 'tiny' | 'medium' | 'large' | 'big';
type ButtonVariant = 'fill' | 'weak' | 'solid' | 'outline';
type ButtonColor = 'primary' | 'dark' | 'red' | 'light' | 'gray' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const sizeStyles: Record<ButtonSize, { padding: string; text: string; height: string; minWidth: string; radius: string }> = {
  tiny: {
    padding: 'px-[16px] py-[8px]',
    text: 'text-[13px] leading-[19.5px]',
    height: 'h-[32px]',
    minWidth: 'min-w-[52px]',
    radius: 'rounded-[8px]',
  },
  medium: {
    padding: 'px-[20px] py-[10px]',
    text: 'text-[15px] leading-[22.5px]',
    height: 'h-[38px]',
    minWidth: 'min-w-[64px]',
    radius: 'rounded-[10px]',
  },
  large: {
    padding: 'px-[24px] py-[12px]',
    text: 'text-[17px] leading-[25.5px]',
    height: 'h-[48px]',
    minWidth: 'min-w-[80px]',
    radius: 'rounded-[12px]',
  },
  big: {
    padding: 'px-[28px] py-[14px]',
    text: 'text-[17px] leading-[25.5px]',
    height: 'h-[56px]',
    minWidth: 'min-w-[98px]',
    radius: 'rounded-[14px]',
  },
};

type StyleDef = { bg: string; text: string; pressed: string };
const colorStyles: Record<ButtonColor, Record<string, StyleDef>> = {
  primary: {
    fill: { bg: 'bg-[#5B5CF9]', text: 'text-white', pressed: 'active:bg-[#4A4BE8]' },
    weak: { bg: 'bg-[rgba(91,92,249,0.15)]', text: 'text-[#5B5CF9]', pressed: 'active:bg-[rgba(91,92,249,0.25)]' },
    solid: { bg: 'bg-[#5B5CF9]', text: 'text-white', pressed: 'active:bg-[#4A4BE8]' },
    outline: { bg: 'bg-transparent border border-[#E5E8EB]', text: 'text-[#4E5968]', pressed: 'active:bg-[#F2F4F6]' },
  },
  blue: {
    fill: { bg: 'bg-[#3183f6]', text: 'text-white', pressed: 'active:bg-[#1b64da]' },
    weak: { bg: 'bg-[rgba(100,168,255,0.15)]', text: 'text-[#2473eb]', pressed: 'active:bg-[rgba(100,168,255,0.25)]' },
    solid: { bg: 'bg-[#3183f6]', text: 'text-white', pressed: 'active:bg-[#1b64da]' },
    outline: { bg: 'bg-transparent border border-[#E5E8EB]', text: 'text-[#4E5968]', pressed: 'active:bg-[#F2F4F6]' },
  },
  dark: {
    fill: { bg: 'bg-[#4e5968]', text: 'text-white', pressed: 'active:bg-[#333d48]' },
    weak: { bg: 'bg-[rgba(2,32,71,0.05)]', text: 'text-[#4e5968]', pressed: 'active:bg-[rgba(2,32,71,0.1)]' },
  },
  gray: {
    fill: { bg: 'bg-[#4e5968]', text: 'text-white', pressed: 'active:bg-[#333d48]' },
    weak: { bg: 'bg-[rgba(2,32,71,0.05)]', text: 'text-[#4e5968]', pressed: 'active:bg-[rgba(2,32,71,0.1)]' },
  },
  red: {
    fill: { bg: 'bg-[#f04251]', text: 'text-white', pressed: 'active:bg-[#d11f2e]' },
    weak: { bg: 'bg-[rgba(251,136,144,0.15)]', text: 'text-[#e42939]', pressed: 'active:bg-[rgba(251,136,144,0.25)]' },
  },
  light: {
    fill: { bg: 'bg-white', text: 'text-[#1b64da]', pressed: 'active:bg-[#f2f4f6]' },
    weak: { bg: 'bg-[rgba(222,222,255,0.19)]', text: 'text-white', pressed: 'active:bg-[rgba(222,222,255,0.3)]' },
  },
  orange: {
    fill: { bg: 'bg-[#ff8a3d]', text: 'text-white', pressed: 'active:bg-[#e67a35]' },
    weak: { bg: 'bg-[rgba(255,138,61,0.16)]', text: 'text-[#e67a35]', pressed: 'active:bg-[rgba(255,138,61,0.25)]' },
  },
  yellow: {
    fill: { bg: 'bg-[#ffc342]', text: 'text-[#333d48]', pressed: 'active:bg-[#e6af3b]' },
    weak: { bg: 'bg-[rgba(255,195,66,0.16)]', text: 'text-[#de7f02]', pressed: 'active:bg-[rgba(255,195,66,0.25)]' },
  },
  green: {
    fill: { bg: 'bg-[#02a262]', text: 'text-white', pressed: 'active:bg-[#029258]' },
    weak: { bg: 'bg-[rgba(2,162,98,0.16)]', text: 'text-[#029258]', pressed: 'active:bg-[rgba(2,162,98,0.25)]' },
  },
  teal: {
    fill: { bg: 'bg-[#109494]', text: 'text-white', pressed: 'active:bg-[#0c8383]' },
    weak: { bg: 'bg-[rgba(16,149,149,0.16)]', text: 'text-[#0c8383]', pressed: 'active:bg-[rgba(16,149,149,0.25)]' },
  },
  purple: {
    fill: { bg: 'bg-[#8b5cf6]', text: 'text-white', pressed: 'active:bg-[#7c4dff]' },
    weak: { bg: 'bg-[rgba(139,92,246,0.16)]', text: 'text-[#7c4dff]', pressed: 'active:bg-[rgba(139,92,246,0.25)]' },
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'large',
      variant = 'fill',
      color = 'primary',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const sizeStyle = sizeStyles[size];
    // Map solid to fill and outline to weak for colors that don't have explicit definitions
    const mappedVariant = variant === 'solid' ? 'fill' : variant === 'outline' ? 'weak' : variant;
    const colorDef = colorStyles[color];
    const colorStyle = colorDef[variant] || colorDef[mappedVariant];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-[6px]
          font-semibold whitespace-nowrap
          transition-colors duration-150
          ${sizeStyle.padding}
          ${sizeStyle.text}
          ${sizeStyle.height}
          ${sizeStyle.minWidth}
          ${sizeStyle.radius}
          ${colorStyle.bg}
          ${colorStyle.text}
          ${!disabled && !loading ? colorStyle.pressed : ''}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="50.26"
              strokeDashoffset="37.7"
              opacity="0.8"
            />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
