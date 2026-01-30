import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

type ProfileType = 'text' | 'icon' | 'image';
type ProfileAddon = 'none' | 'badge' | 'overlap';
type ProfileSize = 'small' | 'medium' | 'large';

interface ProfileProps extends HTMLAttributes<HTMLDivElement> {
  type?: ProfileType;
  addon?: ProfileAddon;
  size?: ProfileSize;
  text?: string;
  icon?: ReactNode;
  src?: string;
  showBackground?: boolean;
}

const sizeStyles: Record<ProfileSize, {
  container: string;
  padding: string;
  iconSize: string;
  textSize: string;
  badgeSize: string;
  badgePosition: string;
}> = {
  small: {
    container: 'w-[44px] h-[44px]',
    padding: 'p-[10px]',
    iconSize: 'w-[24px] h-[24px]',
    textSize: 'text-[13px] leading-[19.5px]',
    badgeSize: 'w-[18px] h-[18px]',
    badgePosition: 'top-[-1px] right-[-1px]',
  },
  medium: {
    container: 'w-[58px] h-[60px]',
    padding: 'p-[13px]',
    iconSize: 'w-[32px] h-[32px]',
    textSize: 'text-[17px] leading-[25.5px]',
    badgeSize: 'w-[24px] h-[24px]',
    badgePosition: 'top-[-2px] right-[-2px]',
  },
  large: {
    container: 'w-[60px] h-[60px]',
    padding: 'px-[13px] py-[17px]',
    iconSize: 'w-[40px] h-[40px]',
    textSize: 'text-[17px] leading-[25.5px]',
    badgeSize: 'w-[24px] h-[24px]',
    badgePosition: 'top-[-2px] right-[-2px]',
  },
};

// 해바라기 캐릭터 SVG
const SunflowerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 꽃잎 */}
    <g>
      <ellipse cx="20" cy="6" rx="5" ry="6" fill="#FFD93D" />
      <ellipse cx="20" cy="34" rx="5" ry="6" fill="#FFD93D" />
      <ellipse cx="6" cy="20" rx="6" ry="5" fill="#FFD93D" />
      <ellipse cx="34" cy="20" rx="6" ry="5" fill="#FFD93D" />
      <ellipse cx="9.5" cy="9.5" rx="5" ry="6" transform="rotate(-45 9.5 9.5)" fill="#FFD93D" />
      <ellipse cx="30.5" cy="30.5" rx="5" ry="6" transform="rotate(-45 30.5 30.5)" fill="#FFD93D" />
      <ellipse cx="30.5" cy="9.5" rx="5" ry="6" transform="rotate(45 30.5 9.5)" fill="#FFD93D" />
      <ellipse cx="9.5" cy="30.5" rx="5" ry="6" transform="rotate(45 9.5 30.5)" fill="#FFD93D" />
    </g>
    {/* 중심 */}
    <circle cx="20" cy="20" r="10" fill="#F5A623" />
    {/* 눈 */}
    <circle cx="16.5" cy="18" r="1.5" fill="#333" />
    <circle cx="23.5" cy="18" r="1.5" fill="#333" />
    {/* 입 */}
    <path d="M17 23c1.5 1.5 4.5 1.5 6 0" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 체크 뱃지 아이콘
const CheckBadge = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#00C853" />
    <path
      d="M7 12.5L10.5 16L17 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 이미지 플레이스홀더 아이콘
const ImagePlaceholder = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#E5E8EB" />
    <path
      d="M8 15l3-4 2 2.5 3-4 4 5.5H4l4-4z"
      fill="#ADB5BD"
    />
    <circle cx="8.5" cy="8.5" r="2" fill="#ADB5BD" />
  </svg>
);

export const Profile = forwardRef<HTMLDivElement, ProfileProps>(
  (
    {
      type = 'text',
      addon = 'none',
      size = 'medium',
      text = '000',
      icon,
      src,
      showBackground = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size];
    const hasOverlap = addon === 'overlap';
    const hasBadge = addon === 'badge';

    const renderContent = () => {
      switch (type) {
        case 'text':
          return (
            <span
              className={`
                font-bold text-[#333D48]
                ${styles.textSize}
              `}
            >
              {text}
            </span>
          );
        case 'icon':
          return icon || <SunflowerIcon className={styles.iconSize} />;
        case 'image':
          return src ? (
            <img
              src={src}
              alt=""
              className={`${styles.iconSize} object-cover`}
            />
          ) : (
            <ImagePlaceholder className={styles.iconSize} />
          );
        default:
          return null;
      }
    };

    // 배경 없이 아이콘만 표시하는 경우
    if (!showBackground && type === 'icon') {
      return (
        <div
          ref={ref}
          className={`
            relative inline-flex items-center justify-center
            ${className}
          `}
          {...props}
        >
          {icon || <SunflowerIcon className={styles.iconSize} />}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`
          relative inline-flex items-center justify-center
          bg-[#F2F4F6] rounded-full
          ${styles.padding}
          ${hasOverlap ? 'shadow-[6px_8px_0px_0px_#3182F6]' : ''}
          ${className}
        `}
        {...props}
      >
        {renderContent()}

        {/* 체크 뱃지 */}
        {hasBadge && (
          <div className={`absolute ${styles.badgePosition}`}>
            <CheckBadge className={styles.badgeSize} />
          </div>
        )}
      </div>
    );
  }
);

Profile.displayName = 'Profile';

export default Profile;
