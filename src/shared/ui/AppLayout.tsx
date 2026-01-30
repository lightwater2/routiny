import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

interface AppLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** 토스 앱 헤더를 사용하는 경우 true (커스텀 헤더 숨김) */
  useTossHeader?: boolean;
  /** 하단 고정 영역 (CTA 버튼 등) */
  bottomArea?: ReactNode;
  /** 하단 고정 영역 높이 (기본: 100px) */
  bottomAreaHeight?: number;
}

/**
 * 앱인토스 미니앱용 레이아웃 컴포넌트
 * - 토스 앱 상단 헤더 영역 고려
 * - Safe area inset 적용
 * - 하단 고정 영역 지원
 */
export const AppLayout = forwardRef<HTMLDivElement, AppLayoutProps>(
  (
    {
      useTossHeader = true,
      bottomArea,
      bottomAreaHeight = 100,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          min-h-screen
          bg-white
          flex flex-col
          ${className}
        `}
        style={{
          // 토스 앱 상단 safe area
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
        {...props}
      >
        {/* 메인 컨텐츠 영역 */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            // 하단 고정 영역이 있으면 그만큼 패딩 추가
            paddingBottom: bottomArea ? `${bottomAreaHeight}px` : 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {children}
        </main>

        {/* 하단 고정 영역 */}
        {bottomArea && (
          <div
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F2F4F6]"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom, 20px)',
              height: `calc(${bottomAreaHeight}px + env(safe-area-inset-bottom, 20px))`,
            }}
          >
            <div className="px-[20px] pt-[16px]">
              {bottomArea}
            </div>
          </div>
        )}
      </div>
    );
  }
);

AppLayout.displayName = 'AppLayout';

export default AppLayout;
