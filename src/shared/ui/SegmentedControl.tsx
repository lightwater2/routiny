import { forwardRef, type HTMLAttributes } from 'react';

type SegmentedControlSize = 'small' | 'large';

interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: string[];
  value?: number;
  size?: SegmentedControlSize;
  onChange?: (index: number) => void;
}

const sizeStyles: Record<SegmentedControlSize, {
  padding: string;
  itemPadding: string;
  fontSize: string;
  lineHeight: string;
  borderRadius: string;
  itemBorderRadius: string;
}> = {
  small: {
    padding: 'p-[3px]',
    itemPadding: 'px-[8px] py-[5px]',
    fontSize: 'text-[15px]',
    lineHeight: 'leading-[22.5px]',
    borderRadius: 'rounded-[10px]',
    itemBorderRadius: 'rounded-[8px]',
  },
  large: {
    padding: 'p-[4px]',
    itemPadding: 'px-[12px] py-[8px]',
    fontSize: 'text-[17px]',
    lineHeight: 'leading-[25.5px]',
    borderRadius: 'rounded-[14px]',
    itemBorderRadius: 'rounded-[10px]',
  },
};

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      items,
      value = 0,
      size = 'large',
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size];

    const handleItemClick = (index: number) => {
      if (onChange) {
        onChange(index);
      }
    };

    return (
      <div
        ref={ref}
        className={`
          flex items-center justify-center
          bg-[rgba(2,32,71,0.05)]
          ${styles.padding}
          ${styles.borderRadius}
          ${className}
        `}
        {...props}
      >
        {items.map((item, index) => {
          const isActive = index === value;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleItemClick(index)}
              className={`
                flex-1
                flex items-center justify-center
                ${styles.itemPadding}
                ${styles.fontSize}
                ${styles.lineHeight}
                transition-all duration-200
                ${isActive
                  ? `bg-white ${styles.itemBorderRadius} shadow-[0px_1px_2px_0px_rgba(0,0,0,0.09)] text-[#333D48] font-semibold`
                  : 'text-[#6B7684] font-medium'
                }
              `}
            >
              {item}
            </button>
          );
        })}
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';

export default SegmentedControl;
