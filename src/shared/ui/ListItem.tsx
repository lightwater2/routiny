import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

type ListItemLeftType = 'number' | 'thumbnail' | 'none';

interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  leftType?: ListItemLeftType;
  number?: number;
  thumbnail?: ReactNode;
  rightContent?: ReactNode;
  onClick?: () => void;
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      title,
      description,
      leftType = 'none',
      number = 1,
      thumbnail,
      rightContent,
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          flex items-center gap-[16px]
          bg-white
          px-[20px] py-[16px]
          ${onClick ? 'cursor-pointer' : ''}
          ${className}
        `}
        onClick={onClick}
        {...props}
      >
        {/* Left Content */}
        {leftType === 'number' && (
          <div className="
            flex items-center justify-center
            w-[32px] h-[32px]
            bg-[#F2F4F6]
            rounded-full
            shrink-0
          ">
            <span className="text-[15px] font-semibold text-[#4E5968]">
              {number}
            </span>
          </div>
        )}

        {leftType === 'thumbnail' && thumbnail && (
          <div className="
            w-[48px] h-[48px]
            bg-[#F2F4F6]
            rounded-[8px]
            overflow-hidden
            shrink-0
            flex items-center justify-center
          ">
            {thumbnail}
          </div>
        )}

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[17px] leading-[25.5px] font-bold text-[#4E5968] truncate">
            {title}
          </p>
          {description && (
            <p className="text-[15px] leading-[22.5px] font-normal text-[#6B7684] truncate">
              {description}
            </p>
          )}
        </div>

        {/* Right Content */}
        {rightContent && (
          <div className="shrink-0">
            {rightContent}
          </div>
        )}
      </div>
    );
  }
);

ListItem.displayName = 'ListItem';

export default ListItem;
