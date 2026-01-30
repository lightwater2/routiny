import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, AppLayout } from '../shared/ui';
import type { RoutineType } from '../shared/types';

export function StartPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<RoutineType | null>(null);

  const handleSelect = (type: RoutineType) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType) {
      navigate('/category', { state: { routineType: selectedType } });
    }
  };

  const bottomCTA = (
    <Button
      size="large"
      variant="solid"
      disabled={!selectedType}
      onClick={handleNext}
      className={`
        w-full
        ${selectedType
          ? 'bg-[#5B5CF9] hover:bg-[#4A4BE8]'
          : 'bg-[#E5E8EB] text-[#B0B8C1]'
        }
      `}
    >
      선택하기
    </Button>
  );

  return (
    <AppLayout bottomArea={bottomCTA} bottomAreaHeight={80}>
      {/* Content */}
      <div className="px-[20px] pt-[24px]">
        {/* Title */}
        <div className="mb-[32px]">
          <h2 className="text-[24px] font-bold text-[#191F28] mb-[8px]">
            함께 루틴을 만들어볼까요?
          </h2>
          <p className="text-[15px] text-[#8B95A1]">
            본인에게 맞는 루틴 유형을 선택해주세요.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="flex flex-col gap-[16px]">
          {/* Individual Routine Card */}
          <Card
            variant="outlined"
            size="large"
            clickable
            onClick={() => handleSelect('individual')}
            className={`
              transition-all
              ${selectedType === 'individual'
                ? 'border-[#5B5CF9] border-2 bg-[#F0F0FF]'
                : 'border-[#E5E8EB]'
              }
            `}
          >
            <div className="flex flex-col items-center py-[24px]">
              {/* Icon */}
              <div className="w-[72px] h-[72px] rounded-[16px] bg-[#F0F0FF] flex items-center justify-center mb-[16px]">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="12" r="5" fill="#5B5CF9" />
                  <path
                    d="M8 26C8 22.134 11.134 19 15 19H17C20.866 19 24 22.134 24 26"
                    stroke="#5B5CF9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* Text */}
              <h3 className="text-[18px] font-bold text-[#191F28] mb-[4px]">
                개인 루틴
              </h3>
              <p className="text-[14px] text-[#8B95A1]">
                나만의 루틴을 만들고 보상받기
              </p>
            </div>
          </Card>

          {/* Team Routine Card */}
          <Card
            variant="outlined"
            size="large"
            clickable
            onClick={() => handleSelect('team')}
            className={`
              transition-all
              ${selectedType === 'team'
                ? 'border-[#5B5CF9] border-2 bg-[#F0F0FF]'
                : 'border-[#E5E8EB]'
              }
            `}
          >
            <div className="flex flex-col items-center py-[24px]">
              {/* Icon */}
              <div className="w-[72px] h-[72px] rounded-[16px] bg-[#F0F0FF] flex items-center justify-center mb-[16px]">
                <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                  <circle cx="20" cy="10" r="4" fill="#5B5CF9" />
                  <circle cx="10" cy="12" r="3" fill="#A0A1FF" />
                  <circle cx="30" cy="12" r="3" fill="#A0A1FF" />
                  <path
                    d="M14 24C14 21.239 16.239 19 19 19H21C23.761 19 26 21.239 26 24"
                    stroke="#5B5CF9"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 26C6 23.791 7.791 22 10 22H11"
                    stroke="#A0A1FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M34 26C34 23.791 32.209 22 30 22H29"
                    stroke="#A0A1FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* Text */}
              <h3 className="text-[18px] font-bold text-[#191F28] mb-[4px]">
                팀 루틴
              </h3>
              <p className="text-[14px] text-[#8B95A1]">
                가족/친구와 함께 챌린지하기
              </p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
