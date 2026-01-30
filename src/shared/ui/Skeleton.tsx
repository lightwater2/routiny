import { forwardRef, type HTMLAttributes } from 'react';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const variantStyles: Record<SkeletonVariant, string> = {
      text: 'rounded-[4px]',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-[8px]',
    };

    const animationStyles: Record<string, string> = {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer',
      none: '',
    };

    const defaultDimensions: Record<SkeletonVariant, { width: string; height: string }> = {
      text: { width: '100%', height: '16px' },
      circular: { width: '40px', height: '40px' },
      rectangular: { width: '100%', height: '100px' },
      rounded: { width: '100%', height: '100px' },
    };

    const computedWidth = width ?? defaultDimensions[variant].width;
    const computedHeight = height ?? defaultDimensions[variant].height;

    return (
      <div
        ref={ref}
        className={`
          bg-[#E5E8EB]
          ${variantStyles[variant]}
          ${animationStyles[animation]}
          ${className}
        `}
        style={{
          width: typeof computedWidth === 'number' ? `${computedWidth}px` : computedWidth,
          height: typeof computedHeight === 'number' ? `${computedHeight}px` : computedHeight,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Skeleton Group for common patterns
interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
  lastLineWidth?: string;
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, lastLineWidth = '60%', className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`space-y-[8px] ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={index === lines - 1 ? lastLineWidth : '100%'}
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = 'SkeletonText';

// Card Skeleton
export const SkeletonCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-[12px] p-[16px] ${className}`}
        {...props}
      >
        <Skeleton variant="rounded" height={120} className="mb-[12px]" />
        <Skeleton variant="text" width="70%" className="mb-[8px]" />
        <Skeleton variant="text" width="40%" />
      </div>
    );
  }
);

SkeletonCard.displayName = 'SkeletonCard';

// List Item Skeleton
export const SkeletonListItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-[12px] px-[20px] py-[12px] ${className}`}
        {...props}
      >
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={14} className="mb-[6px]" />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
    );
  }
);

SkeletonListItem.displayName = 'SkeletonListItem';

export default Skeleton;
