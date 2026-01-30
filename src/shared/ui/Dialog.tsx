import { forwardRef, type HTMLAttributes } from 'react';
import { Button } from './Button';

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  title: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onClose?: () => void;
  showDim?: boolean;
  showSecondaryButton?: boolean;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open = true,
      title,
      description,
      primaryLabel = '확인',
      secondaryLabel = '닫기',
      onPrimaryClick,
      onSecondaryClick,
      onClose,
      showDim = true,
      showSecondaryButton = true,
      className = '',
      ...props
    },
    ref
  ) => {
    if (!open) return null;

    const handleDimClick = () => {
      if (onClose) {
        onClose();
      }
    };

    return (
      <div
        ref={ref}
        className={`
          fixed inset-0 z-50
          flex items-center justify-center
          ${className}
        `}
        {...props}
      >
        {/* Dim Background */}
        {showDim && (
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleDimClick}
          />
        )}

        {/* Dialog Content */}
        <div
          className="
            relative
            bg-white
            rounded-[20px]
            mx-[24px]
            w-full max-w-[327px]
            shadow-[0px_8px_24px_rgba(0,0,0,0.12)]
          "
        >
          {/* Text Content */}
          <div className="px-[24px] pt-[28px] pb-[20px]">
            <h2 className="text-[20px] leading-[29px] font-bold text-[#333D48]">
              {title}
            </h2>
            {description && (
              <p className="mt-[8px] text-[15px] leading-[22.5px] font-medium text-[#6B7684]">
                {description}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-[8px] px-[16px] pb-[16px]">
            {showSecondaryButton && (
              <Button
                variant="weak"
                color="gray"
                size="large"
                className="flex-1"
                onClick={onSecondaryClick || onClose}
              >
                {secondaryLabel}
              </Button>
            )}
            <Button
              variant="fill"
              color="primary"
              size="large"
              className="flex-1"
              onClick={onPrimaryClick}
            >
              {primaryLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

Dialog.displayName = 'Dialog';

export default Dialog;
