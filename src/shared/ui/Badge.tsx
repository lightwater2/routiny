import { forwardRef, type HTMLAttributes } from 'react';

type BadgeSize = 'small' | 'medium' | 'large';
type BadgeVariant = 'fill' | 'weak';
type BadgeColor = 'blue' | 'dark' | 'yellow' | 'red' | 'green' | 'teal' | 'grey';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  size?: BadgeSize;
  variant?: BadgeVariant;
  color?: BadgeColor;
}

const sizeStyles: Record<BadgeSize, { padding: string; text: string; radius: string }> = {
  small: {
    padding: 'px-[7px] py-[3px]',
    text: 'text-[12px] leading-[18px]',
    radius: 'rounded-[11px]',
  },
  medium: {
    padding: 'px-[7px] py-[3px]',
    text: 'text-[13px] leading-[19.5px]',
    radius: 'rounded-[12px]',
  },
  large: {
    padding: 'px-[8px] py-[4px]',
    text: 'text-[14px] leading-[21px]',
    radius: 'rounded-[13px]',
  },
};

const colorStyles: Record<BadgeColor, { fill: { bg: string; text: string }; weak: { bg: string; text: string } }> = {
  blue: {
    fill: { bg: 'bg-[#3183f6]', text: 'text-white' },
    weak: { bg: 'bg-[rgba(49,130,246,0.16)]', text: 'text-[#1b64da]' },
  },
  dark: {
    fill: { bg: 'bg-[#4e5968]', text: 'text-white' },
    weak: { bg: 'bg-[rgba(78,89,104,0.16)]', text: 'text-[#4e5968]' },
  },
  yellow: {
    fill: { bg: 'bg-[#ffc342]', text: 'text-[#333d48]' },
    weak: { bg: 'bg-[rgba(255,179,49,0.16)]', text: 'text-[#de7f02]' },
  },
  red: {
    fill: { bg: 'bg-[#f04251]', text: 'text-white' },
    weak: { bg: 'bg-[rgba(240,68,82,0.16)]', text: 'text-[#d11f2e]' },
  },
  green: {
    fill: { bg: 'bg-[#02a262]', text: 'text-white' },
    weak: { bg: 'bg-[rgba(2,162,98,0.16)]', text: 'text-[#029258]' },
  },
  teal: {
    fill: { bg: 'bg-[#109494]', text: 'text-white' },
    weak: { bg: 'bg-[rgba(16,149,149,0.16)]', text: 'text-[#0c8383]' },
  },
  grey: {
    fill: { bg: 'bg-[#8B95A1]', text: 'text-white' },
    weak: { bg: 'bg-[#F2F4F6]', text: 'text-[#6B7684]' },
  },
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      size = 'small',
      variant = 'fill',
      color = 'blue',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const sizeStyle = sizeStyles[size];
    const colorStyle = colorStyles[color][variant];

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center justify-center
          font-bold whitespace-nowrap
          ${sizeStyle.padding}
          ${sizeStyle.text}
          ${sizeStyle.radius}
          ${colorStyle.bg}
          ${colorStyle.text}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
