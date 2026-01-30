import { forwardRef, type HTMLAttributes } from 'react';

type LoaderSize = 'small' | 'medium' | 'large';
type LoaderColor = 'blue' | 'dark' | 'white';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: LoaderSize;
  color?: LoaderColor;
}

const sizeMap: Record<LoaderSize, { container: number; stroke: number }> = {
  small: { container: 16, stroke: 2 },
  medium: { container: 24, stroke: 2.5 },
  large: { container: 32, stroke: 3 },
};

const colorMap: Record<LoaderColor, string> = {
  blue: '#3183f6',
  dark: '#6b7684',
  white: '#ffffff',
};

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      size = 'medium',
      color = 'blue',
      className = '',
      ...props
    },
    ref
  ) => {
    const { container, stroke } = sizeMap[size];
    const strokeColor = colorMap[color];
    const radius = (container - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
      <div
        ref={ref}
        className={`inline-flex items-center justify-center ${className}`}
        {...props}
      >
        <svg
          width={container}
          height={container}
          viewBox={`0 0 ${container} ${container}`}
          className="animate-spin"
          style={{ animationDuration: '0.8s' }}
        >
          <circle
            cx={container / 2}
            cy={container / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
          />
        </svg>
      </div>
    );
  }
);

Loader.displayName = 'Loader';

export default Loader;
