import { forwardRef, type HTMLAttributes } from 'react';

type RatingSize = 'small' | 'medium' | 'large';

interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  size?: RatingSize;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const sizeMap: Record<RatingSize, { star: number; gap: number }> = {
  small: { star: 20, gap: 4 },
  medium: { star: 28, gap: 6 },
  large: { star: 36, gap: 8 },
};

const FILLED_COLOR = '#FFCF57';
const EMPTY_COLOR = '#E5E8EB';

const StarIcon = ({ filled, size }: { filled: boolean; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? FILLED_COLOR : EMPTY_COLOR}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = 0,
      size = 'medium',
      onChange,
      readOnly = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const { star: starSize, gap } = sizeMap[size];

    const handleClick = (starValue: number) => {
      if (!readOnly && onChange) {
        onChange(starValue);
      }
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center ${className}`}
        style={{ gap }}
        {...props}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(star)}
            className={`
              transition-transform
              ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              ${readOnly ? '' : 'focus:outline-none'}
            `}
          >
            <StarIcon filled={star <= value} size={starSize} />
          </button>
        ))}
      </div>
    );
  }
);

Rating.displayName = 'Rating';

export default Rating;
