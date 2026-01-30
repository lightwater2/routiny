import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{
        background: 'linear-gradient(135deg, #7B7CFA 0%, #5B5CF9 50%, #4A4BE8 100%)',
      }}
    >
      {/* Logo - 1/4 크기 (원본 600px 기준 150px) */}
      <div className="mb-[28px]">
        <img
          src="/logo.png"
          alt="루티니"
          className="w-[150px] h-[150px] rounded-[36px]"
        />
      </div>

      {/* App Name */}
      <h1 className="text-[32px] font-bold text-white mb-[8px]">
        루티니
      </h1>

      {/* Tagline */}
      <p className="text-[14px] text-white/80">
        루틴을 실천하면, 진짜 보상이 따라옵니다
      </p>

      {/* Loading dots */}
      <div className="absolute bottom-[80px] flex gap-[8px]">
        <div
          className="w-[8px] h-[8px] rounded-full bg-white/60 animate-pulse"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-[8px] h-[8px] rounded-full bg-white/60 animate-pulse"
          style={{ animationDelay: '150ms' }}
        />
        <div
          className="w-[8px] h-[8px] rounded-full bg-white/60 animate-pulse"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
