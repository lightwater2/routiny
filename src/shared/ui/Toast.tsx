import { forwardRef, type HTMLAttributes } from 'react';

type ToastVariant = 'info' | 'success' | 'error';

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: ToastVariant;
  icon?: boolean;
}

const variantStyles: Record<ToastVariant, {
  iconColor: string;
  iconBg: string;
}> = {
  info: {
    iconColor: '#6B7684',
    iconBg: '#F2F4F6',
  },
  success: {
    iconColor: '#15C67F',
    iconBg: '#E8F8F2',
  },
  error: {
    iconColor: '#F04251',
    iconBg: '#FEE9EB',
  },
};

const InfoIcon = ({ color }: { color: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path
      d="M12 8V8.01M12 11V16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path
      d="M8 12L11 15L16 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ErrorIcon = ({ color }: { color: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path
      d="M15 9L9 15M9 9L15 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      message,
      variant = 'info',
      icon = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const styles = variantStyles[variant];

    const renderIcon = () => {
      if (!icon) return null;

      switch (variant) {
        case 'success':
          return <CheckIcon color={styles.iconColor} />;
        case 'error':
          return <ErrorIcon color={styles.iconColor} />;
        default:
          return <InfoIcon color={styles.iconColor} />;
      }
    };

    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center gap-[8px]
          bg-[#F3F5F7]
          px-[16px] py-[12px]
          rounded-[12px]
          shadow-[0px_4px_16px_rgba(0,0,0,0.08)]
          ${className}
        `}
        role="alert"
        {...props}
      >
        {icon && (
          <div className="shrink-0">
            {renderIcon()}
          </div>
        )}
        <p className="text-[15px] leading-[22.5px] font-medium text-[#333D48]">
          {message}
        </p>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export default Toast;
