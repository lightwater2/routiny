import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      title,
      description,
      icon,
      action,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          flex flex-col items-center
          px-[24px] pt-[24px] pb-[8px]
          text-center
          ${className}
        `}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <div className="mb-[16px]">
            {icon}
          </div>
        )}

        {/* Title */}
        <h3 className="text-[20px] leading-[29px] font-bold text-[#333D48]">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-[8px] text-[15px] leading-[22.5px] font-normal text-[#6B7684]">
            {description}
          </p>
        )}

        {/* Action */}
        {action && (
          <div className="mt-[24px]">
            {action}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
