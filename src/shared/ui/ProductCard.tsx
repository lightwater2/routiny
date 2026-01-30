import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

type ProductCardLayout = 'horizontal' | 'vertical';

interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  layout?: ProductCardLayout;
  title: string;
  price: string;
  discountRate?: number;
  description?: string;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  thumbnail?: string;
  badges?: Array<{
    label: string;
    color?: 'blue' | 'dark' | 'red';
  }>;
  onFavoriteClick?: () => void;
  showFavorite?: boolean;
  topLeftBadge?: ReactNode;
  topRightBadge?: ReactNode;
  bottomLeftBadge?: ReactNode;
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      layout = 'horizontal',
      title,
      price,
      discountRate,
      description,
      rating,
      reviewCount,
      viewCount,
      thumbnail,
      badges = [],
      onFavoriteClick,
      showFavorite = false,
      topLeftBadge,
      topRightBadge,
      bottomLeftBadge,
      className = '',
      ...props
    },
    ref
  ) => {
    const badgeColorMap = {
      blue: {
        bg: 'bg-[rgba(49,131,246,0.16)]',
        text: 'text-[#1B64DA]',
      },
      dark: {
        bg: 'bg-[rgba(78,89,104,0.16)]',
        text: 'text-[#4E5968]',
      },
      red: {
        bg: 'bg-[rgba(240,68,82,0.16)]',
        text: 'text-[#D11F2E]',
      },
    };

    const ThumbnailContent = () => (
      <div
        className={`
          relative
          ${layout === 'horizontal' ? 'w-[104px] h-[104px]' : 'w-full h-[102px]'}
          rounded-[10px]
          overflow-hidden
          bg-[#F2F4F6]
          shrink-0
        `}
      >
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {topLeftBadge && (
          <div className="absolute top-[4.5px] left-[4.5px]">
            {topLeftBadge}
          </div>
        )}
        {topRightBadge && (
          <div className="absolute top-[6px] right-[6px] bg-white rounded-[4px]">
            {topRightBadge}
          </div>
        )}
        {bottomLeftBadge && (
          <div className="absolute bottom-[6px] left-[6px] bg-white rounded-[4px]">
            {bottomLeftBadge}
          </div>
        )}
        {showFavorite && (
          <button
            type="button"
            onClick={onFavoriteClick}
            className="
              absolute bottom-[6px] right-[6px]
              w-[32px] h-[32px]
              bg-white rounded-[7px]
              shadow-[0px_1px_3px_0px_rgba(0,27,55,0.1)]
              flex items-center justify-center
            "
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 17.5L8.79167 16.4083C4.5 12.5 1.66667 9.91667 1.66667 6.75C1.66667 4.16667 3.68333 2.08333 6.16667 2.08333C7.58333 2.08333 8.94167 2.73333 10 3.78333C11.0583 2.73333 12.4167 2.08333 13.8333 2.08333C16.3167 2.08333 18.3333 4.16667 18.3333 6.75C18.3333 9.91667 15.5 12.5 11.2083 16.4167L10 17.5Z"
                stroke="#6B7684"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        )}
      </div>
    );

    const ContentArea = () => (
      <div className="flex-1 flex flex-col px-[2px] min-w-0">
        {/* Title */}
        {layout === 'horizontal' && (
          <p className="text-[14px] leading-[20px] font-medium text-[#333D48] line-clamp-2">
            {title}
          </p>
        )}

        {/* Price & Discount */}
        <div className="flex flex-wrap items-start gap-[2px]">
          {discountRate !== undefined && discountRate > 0 && (
            <span className="text-[15px] leading-[22.5px] font-extrabold text-[#F04452]">
              {discountRate}%
            </span>
          )}
          <span className="text-[15px] leading-[22.5px] font-extrabold text-[#191F28]">
            {price}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[12px] leading-[18px] font-medium text-[#4E5968] truncate">
            {description}
          </p>
        )}

        {/* Rating & Review */}
        {(rating !== undefined || reviewCount !== undefined || viewCount !== undefined) && (
          <div className="flex items-center gap-[2px] text-[12px] leading-[18px] font-medium text-[#4E5968]">
            {rating !== undefined && (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z"
                    fill="#FFCE21"
                  />
                </svg>
                <span>{rating}</span>
              </>
            )}
            {reviewCount !== undefined && (
              <span> ({reviewCount.toLocaleString()})</span>
            )}
            {viewCount !== undefined && (
              <span> · {viewCount.toLocaleString()}명 구경함</span>
            )}
          </div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-[3px] pt-[2px] pb-[4px]">
            {badges.map((badge, index) => {
              const colors = badgeColorMap[badge.color || 'blue'];
              return (
                <span
                  key={index}
                  className={`
                    inline-flex items-center justify-center
                    min-h-[18px] min-w-[18px]
                    px-[4px]
                    rounded-[4px]
                    text-[10px] leading-[15px] font-semibold
                    ${colors.bg}
                    ${colors.text}
                  `}
                >
                  {badge.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );

    if (layout === 'vertical') {
      return (
        <div
          ref={ref}
          className={`
            flex flex-col gap-[6px]
            ${className}
          `}
          {...props}
        >
          <ThumbnailContent />
          <ContentArea />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`
          bg-white
          flex gap-[12px] items-start
          px-[24px] py-[10px]
          ${className}
        `}
        {...props}
      >
        <ThumbnailContent />
        <ContentArea />
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
