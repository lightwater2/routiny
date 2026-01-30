import { useState } from 'react';
import { Button, Card } from '../../../shared/ui';
import type { SimpleCheckData } from '../../../shared/types';

interface SimpleCheckProps {
  title: string;
  emoji: string;
  onSubmit: (data: SimpleCheckData) => void;
}

export function SimpleCheck({ title, emoji, onSubmit }: SimpleCheckProps) {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
  };

  const handleSubmit = () => {
    onSubmit({
      type: 'simple_check',
      checked: true,
    });
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
        <div className="flex flex-col items-center py-[24px]">
          <span className="text-[64px] mb-[16px]">{emoji}</span>
          <h3 className="text-[18px] font-bold text-[#191F28] mb-[8px]">
            {title}
          </h3>
          <p className="text-[14px] text-[#8B95A1] text-center mb-[24px]">
            오늘도 잘하셨나요?
          </p>

          <button
            onClick={handleToggle}
            className={`
              w-[120px] h-[120px] rounded-full
              border-4 transition-all
              flex items-center justify-center
              ${checked
                ? 'bg-[#5B5CF9] border-[#5B5CF9]'
                : 'bg-white border-[#E5E8EB] hover:border-[#5B5CF9]'
              }
            `}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              className={`transition-all ${checked ? 'opacity-100' : 'opacity-30'}`}
            >
              <path
                d="M16 32L28 44L48 20"
                stroke={checked ? 'white' : '#8B95A1'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <p className="text-[14px] text-[#8B95A1] mt-[16px]">
            {checked ? '완료되었어요!' : '터치하여 체크'}
          </p>
        </div>
      </Card>

      <Button
        size="large"
        variant="solid"
        onClick={handleSubmit}
        disabled={!checked}
        className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
      >
        체크인 완료
      </Button>
    </div>
  );
}
