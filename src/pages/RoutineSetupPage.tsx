import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Badge, Switch, AppLayout } from '../shared/ui';
import { getRoutineById, categoryInfo } from '../entities/routine';
import { getToday, addDays, formatDateKorean } from '../shared/lib/date';
import { createUserRoutine } from '../shared/api';
import type { RoutineTemplate } from '../shared/types';

const durationOptions = [
  { days: 7, label: '7일', description: '1주일 도전' },
  { days: 14, label: '14일', description: '2주 도전' },
  { days: 21, label: '21일', description: '3주 습관 형성' },
  { days: 30, label: '30일', description: '한 달 챌린지' },
];

const timeOptions = [
  '06:00', '07:00', '08:00', '09:00', '10:00',
  '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00',
];

export function RoutineSetupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routineType = location.state?.routineType || 'individual';

  const routine = getRoutineById(id || '') as RoutineTemplate | undefined;

  const [selectedDuration, setSelectedDuration] = useState(routine?.defaultDuration || 14);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [isStarting, setIsStarting] = useState(false);

  if (!routine) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-[20px]">
          <span className="text-[48px] mb-[16px]">😢</span>
          <h2 className="text-[20px] font-bold text-[#191F28] mb-[8px]">
            루틴을 찾을 수 없어요
          </h2>
          <Button
            size="medium"
            variant="solid"
            onClick={() => navigate(-1)}
            className="bg-[#5B5CF9] hover:bg-[#4A4BE8]"
          >
            이전으로 돌아가기
          </Button>
        </div>
      </AppLayout>
    );
  }

  const categoryData = categoryInfo[routine.category];
  const startDate = getToday();
  const endDate = addDays(startDate, selectedDuration - 1);

  const handleStart = async () => {
    if (isStarting) return;
    setIsStarting(true);

    try {
      await createUserRoutine({
        templateId: routine.id,
        startDate,
        endDate,
        targetDays: selectedDuration,
        notificationEnabled,
        notificationTime: notificationEnabled ? notificationTime : undefined,
      });

      navigate('/active', { replace: true });
    } catch (error) {
      console.error('루틴 시작 실패:', error);
      alert('루틴 시작에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsStarting(false);
    }
  };

  const typeLabel = routineType === 'team' ? '팀' : '개인';

  const bottomCTA = (
    <Button
      size="large"
      variant="solid"
      onClick={handleStart}
      disabled={isStarting}
      loading={isStarting}
      className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
    >
      <span className="flex items-center justify-center gap-[8px]">
        루틴 시작하기
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Button>
  );

  return (
    <AppLayout bottomArea={bottomCTA} bottomAreaHeight={80}>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="mb-[24px]">
          <div className="flex items-center gap-[6px] mb-[12px]">
            <Badge
              color="grey"
              variant="weak"
              size="small"
              className="bg-[#F0F0FF] text-[#5B5CF9]"
            >
              {categoryData.name}
            </Badge>
            <Badge
              color="grey"
              variant="weak"
              size="small"
              className="bg-[#F2F4F6] text-[#6B7684]"
            >
              {typeLabel} 루틴
            </Badge>
          </div>

          <div className="flex items-center gap-[10px] mb-[8px]">
            <span className="text-[28px]">{routine.emoji}</span>
            <h1 className="text-[24px] font-bold text-[#191F28]">
              {routine.title}
            </h1>
          </div>
          <p className="text-[14px] text-[#8B95A1]">
            루틴을 시작하기 전에 몇 가지 설정을 해주세요.
          </p>
        </div>

        {/* Duration Selection */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-[16px]">
            도전 기간
          </h3>
          <div className="grid grid-cols-2 gap-[12px]">
            {durationOptions.map((option) => (
              <button
                key={option.days}
                onClick={() => setSelectedDuration(option.days)}
                className={`
                  p-[16px] rounded-[12px] border-2 transition-all text-left
                  ${selectedDuration === option.days
                    ? 'border-[#5B5CF9] bg-[#F0F0FF]'
                    : 'border-[#E5E8EB] bg-white hover:border-[#B0B8C1]'
                  }
                `}
              >
                <span
                  className={`text-[20px] font-bold block mb-[4px] ${
                    selectedDuration === option.days
                      ? 'text-[#5B5CF9]'
                      : 'text-[#191F28]'
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-[13px] text-[#8B95A1]">
                  {option.description}
                </span>
              </button>
            ))}
          </div>

          {/* Date Preview */}
          <div className="mt-[16px] p-[12px] bg-[#F7F8F9] rounded-[8px]">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#6B7684]">시작일</span>
              <span className="text-[14px] font-medium text-[#191F28]">
                {formatDateKorean(startDate)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-[8px]">
              <span className="text-[13px] text-[#6B7684]">종료일</span>
              <span className="text-[14px] font-medium text-[#191F28]">
                {formatDateKorean(endDate)}
              </span>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <div className="flex items-center justify-between mb-[16px]">
            <div>
              <h3 className="text-[16px] font-semibold text-[#191F28]">
                알림 설정
              </h3>
              <p className="text-[13px] text-[#8B95A1] mt-[4px]">
                매일 정해진 시간에 알림을 받아보세요
              </p>
            </div>
            <Switch
              checked={notificationEnabled}
              onChange={(e) => setNotificationEnabled(e.target.checked)}
            />
          </div>

          {notificationEnabled && (
            <div className="pt-[16px] border-t border-[#E5E8EB]">
              <label className="text-[14px] text-[#6B7684] block mb-[12px]">
                알림 시간
              </label>
              <div className="relative">
                <select
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  className="
                    w-full p-[14px] rounded-[12px] border border-[#E5E8EB]
                    text-[15px] text-[#191F28] bg-white
                    appearance-none cursor-pointer
                    focus:outline-none focus:border-[#5B5CF9]
                  "
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="#8B95A1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </Card>

        {/* Reward Preview */}
        <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
          <div className="flex items-center gap-[8px] mb-[12px]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 1L12.704 6.56L18.776 7.46L14.388 11.72L15.408 17.764L10 14.88L4.592 17.764L5.612 11.72L1.224 7.46L7.296 6.56L10 1Z"
                fill="#FFD700"
              />
            </svg>
            <h3 className="text-[16px] font-semibold text-[#191F28]">
              달성 리워드
            </h3>
          </div>

          <div className="flex items-center gap-[16px]">
            <div className="w-[64px] h-[64px] rounded-[12px] bg-[#F2F4F6] flex items-center justify-center shrink-0">
              <span className="text-[10px] text-[#5B5CF9] font-medium text-center">
                {routine.reward.category}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-semibold text-[#191F28] mb-[4px]">
                {routine.reward.name}
              </h4>
              <p className="text-[13px] text-[#8B95A1] line-clamp-2">
                90% 이상 달성 시 지급
              </p>
            </div>
          </div>
        </Card>

        {/* Info Notice */}
        <div className="mt-[16px] flex items-start gap-[8px] px-[4px]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0 mt-[2px]"
          >
            <path
              d="M8 14A6 6 0 108 2a6 6 0 000 12z"
              stroke="#8B95A1"
              strokeWidth="1.5"
            />
            <path
              d="M8 5.333V8M8 10.667h.007"
              stroke="#8B95A1"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-[13px] text-[#8B95A1]">
            루틴을 시작하면 매일 체크인을 진행할 수 있어요.
            {routine.verificationConfig.frequency === 'weekly'
              ? ` 주 ${routine.verificationConfig.weeklyTarget}회 인증이 필요해요.`
              : ' 매일 인증이 필요해요.'}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
