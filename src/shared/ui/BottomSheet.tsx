import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

interface BottomSheetProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  showHandle?: boolean;
}

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open = true,
      title,
      description,
      children,
      footer,
      onClose,
      showHandle = true,
      className = '',
      ...props
    },
    ref
  ) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={`
          fixed inset-0 z-50
          flex items-end justify-center
          ${className}
        `}
        {...props}
      >
        {/* Dim Background */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Bottom Sheet Content */}
        <div
          className="
            relative
            bg-white
            w-full
            max-h-[90vh]
            rounded-t-[20px]
            overflow-hidden
            flex flex-col
          "
        >
          {/* Handle */}
          {showHandle && (
            <div className="flex justify-center pt-[12px] pb-[8px]">
              <div className="w-[36px] h-[5px] bg-[#E5E8EB] rounded-full" />
            </div>
          )}

          {/* Header */}
          {(title || description) && (
            <div className="px-[24px] py-[16px]">
              {title && (
                <h3 className="text-[20px] leading-[29px] font-bold text-[#333D48]">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-[8px] text-[15px] leading-[22.5px] font-normal text-[#6B7684]">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          {children && (
            <div className="flex-1 overflow-y-auto px-[24px]">
              {children}
            </div>
          )}

          {/* Footer */}
          {footer && (
            <div className="px-[24px] py-[16px] pb-[34px]">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
