import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardSize = 'small' | 'medium' | 'large';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  header?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      size = 'medium',
      header,
      footer,
      children,
      hoverable = false,
      clickable = false,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const variantStyles: Record<CardVariant, string> = {
      elevated: 'bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]',
      outlined: 'bg-white border border-[#E5E8EB]',
      filled: 'bg-[#F2F4F6]',
    };

    const sizeStyles: Record<CardSize, { padding: string; radius: string }> = {
      small: {
        padding: 'p-[12px]',
        radius: 'rounded-[12px]',
      },
      medium: {
        padding: 'p-[16px]',
        radius: 'rounded-[16px]',
      },
      large: {
        padding: 'p-[20px]',
        radius: 'rounded-[20px]',
      },
    };

    const styles = sizeStyles[size];

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`
          ${variantStyles[variant]}
          ${styles.radius}
          overflow-hidden
          transition-all
          ${hoverable ? 'hover:shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]' : ''}
          ${clickable || onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
          ${className}
        `}
        {...props}
      >
        {/* Header */}
        {header && (
          <div className={`${styles.padding} pb-0 border-b border-[#F2F4F6]`}>
            {header}
          </div>
        )}

        {/* Content */}
        <div className={styles.padding}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`${styles.padding} pt-0 border-t border-[#F2F4F6]`}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between gap-[12px] ${className}`}
        {...props}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] leading-[25.5px] font-bold text-[#333D48] truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-[2px] text-[13px] leading-[19.5px] font-medium text-[#8B95A1] truncate">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Content Component
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// Card Footer Component
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-[8px] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export default Card;
