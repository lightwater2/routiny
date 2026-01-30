import { forwardRef, type HTMLAttributes, type ReactNode, useState } from 'react';

interface AccordionItemProps {
  id: string;
  title: string;
  content: ReactNode;
  description?: string;
  badge?: ReactNode;
  showCheckbox?: boolean;
  checked?: boolean;
  onCheckChange?: (checked: boolean) => void;
  disabled?: boolean;
}

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
  defaultExpandedIds?: string[];
  variant?: 'default' | 'bordered';
}

// Single Accordion Item Component
const AccordionItem = forwardRef<
  HTMLDivElement,
  AccordionItemProps & {
    isExpanded: boolean;
    onToggle: () => void;
  }
>(
  (
    {
      title,
      content,
      description,
      badge,
      showCheckbox = false,
      checked = false,
      onCheckChange,
      disabled = false,
      isExpanded,
      onToggle,
    },
    ref
  ) => {
    const handleCheckboxClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) {
        onCheckChange?.(!checked);
      }
    };

    return (
      <div ref={ref} className="flex flex-col">
        {/* Header */}
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className={`
            w-full
            flex items-center gap-[6px]
            px-[22px] py-[6px]
            text-left
            transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F2F4F6]'}
          `}
        >
          {/* Checkbox */}
          {showCheckbox && (
            <div
              onClick={handleCheckboxClick}
              className={`
                shrink-0 w-[24px] h-[24px]
                flex items-center justify-center
                rounded-full
                transition-colors
                ${checked
                  ? 'bg-[#3183F6]'
                  : 'bg-white border-2 border-[#D1D6DB]'}
              `}
            >
              {checked && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path
                    d="M1 5L4.5 8.5L11 1.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          )}

          {/* Title & Description */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center gap-[4px]">
              <span className="text-[15px] leading-[22.5px] font-semibold text-[#4E5968] truncate">
                {title}
              </span>
            </div>
            {description && !isExpanded && (
              <span className="text-[13px] leading-[19.5px] font-medium text-[#8B95A1] truncate">
                {description}
              </span>
            )}
          </div>

          {/* Badge */}
          {badge && <div className="shrink-0">{badge}</div>}

          {/* Arrow Icon */}
          <span
            className={`
              shrink-0 text-[#8B95A1]
              transition-transform duration-200
              ${isExpanded ? 'rotate-180' : ''}
            `}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {/* Content */}
        <div
          className={`
            overflow-hidden
            transition-all duration-200
            ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="px-[22px] pl-[52px] pb-[12px]">
            {typeof content === 'string' ? (
              <p className="text-[13px] leading-[19.5px] font-medium text-[#8B95A1]">
                {content}
              </p>
            ) : (
              content
            )}
          </div>
        </div>
      </div>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

// Main Accordion Component
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      allowMultiple = false,
      defaultExpandedIds = [],
      variant = 'default',
      className = '',
      ...props
    },
    ref
  ) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);

    const handleToggle = (id: string) => {
      if (allowMultiple) {
        setExpandedIds((prev) =>
          prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
      } else {
        setExpandedIds((prev) => (prev.includes(id) ? [] : [id]));
      }
    };

    const variantStyles: Record<string, string> = {
      default: 'bg-white',
      bordered: 'bg-white border border-[#E5E8EB] rounded-[16px] overflow-hidden',
    };

    return (
      <div
        ref={ref}
        className={`
          flex flex-col
          ${variantStyles[variant]}
          ${variant === 'default' ? 'divide-y divide-[#F2F4F6]' : ''}
          ${className}
        `}
        {...props}
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            {...item}
            isExpanded={expandedIds.includes(item.id)}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';

export default Accordion;
