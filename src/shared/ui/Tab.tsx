import { forwardRef, type HTMLAttributes } from 'react';

type TabSize = 'small' | 'large';
type TabBackground = 'white' | 'gray' | 'custom';

interface TabProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: string[];
  value?: number;
  size?: TabSize;
  background?: TabBackground;
  leftAlign?: boolean;
  onChange?: (index: number) => void;
}

const sizeStyles: Record<TabSize, {
  height: string;
  padding: string;
  fontSize: string;
  lineHeight: string;
}> = {
  small: {
    height: 'h-[39px]',
    padding: 'pt-[8px] pb-[10px] px-[6px]',
    fontSize: 'text-[15px]',
    lineHeight: 'leading-[22.5px]',
  },
  large: {
    height: 'h-[51.5px]',
    padding: 'pt-[12px] pb-[14px] px-[8px]',
    fontSize: 'text-[17px]',
    lineHeight: 'leading-[25.5px]',
  },
};

const backgroundStyles: Record<TabBackground, string> = {
  white: 'bg-white',
  gray: 'bg-[#F2F4F6]',
  custom: 'bg-transparent',
};

export const Tab = forwardRef<HTMLDivElement, TabProps>(
  (
    {
      items,
      value = 0,
      size = 'large',
      background = 'white',
      leftAlign = false,
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
          relative
          flex
          ${leftAlign ? 'justify-start overflow-x-auto' : 'justify-center'}
          ${backgroundStyles[background]}
          px-[20px]
          ${className}
        `}
        {...props}
      >
        {/* Bottom border line */}
        <div className="absolute bottom-[1.5px] left-0 right-0 h-px bg-[rgba(0,27,55,0.1)]" />

        {items.map((item, index) => {
          const isActive = index === value;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleItemClick(index)}
              className={`
                ${leftAlign ? 'shrink-0' : 'flex-1'}
                flex flex-col items-center
                ${styles.height}
                min-w-0
              `}
            >
              <div
                className={`
                  flex-1 flex items-center justify-center
                  ${styles.padding}
                  ${styles.fontSize}
                  ${styles.lineHeight}
                  text-center
                  whitespace-nowrap
                  ${isActive
                    ? 'text-[#333D48] font-bold'
                    : 'text-[#6B7684] font-semibold'
                  }
                `}
              >
                {item}
              </div>
              {/* Active indicator */}
              <div
                className={`
                  w-full h-[2px] rounded-[10px]
                  transition-colors duration-200
                  ${isActive ? 'bg-[#333D48]' : 'bg-transparent'}
                `}
              />
            </button>
          );
        })}
      </div>
    );
  }
);

Tab.displayName = 'Tab';

export default Tab;
