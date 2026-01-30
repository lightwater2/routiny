import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, ProgressBar, AppLayout, Loader } from '../shared/ui';
import {
  getToday,
  formatDateKorean,
  getDaysRemaining,
  getDaysElapsed,
  getDateRange,
  isToday,
  isPast,
} from '../shared/lib/date';
import {
  calculateProgress,
  getProgressMessage,
  determineRewardStatus,
  getRewardStatusMessage,
} from '../shared/lib/calculation';
import { getUserRoutineById, getCheckInsByRoutine } from '../shared/api';
import type { UserRoutine, CheckIn } from '../shared/types';

export function ActiveRoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userRoutine, setUserRoutine] = useState<UserRoutine | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = getToday();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;

        const [routine, routineCheckIns] = await Promise.all([
          getUserRoutineById(id),
          getCheckInsByRoutine(id),
        ]);

        setUserRoutine(routine);
        setCheckIns(routineCheckIns);
      } catch (error) {
        console.error('루틴 상세 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="medium" />
        </div>
      </AppLayout>
    );
  }

  if (!userRoutine) {
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
            onClick={() => navigate('/active')}
            className="bg-[#5B5CF9] hover:bg-[#4A4BE8]"
          >
            내 루틴으로 돌아가기
          </Button>
        </div>
      </AppLayout>
    );
  }

  const template = userRoutine.template;
  const progress = calculateProgress(userRoutine.completedDays, userRoutine.targetDays);
  const daysRemaining = getDaysRemaining(userRoutine.endDate);
  const daysElapsed = getDaysElapsed(userRoutine.startDate);
  const progressMessage = getProgressMessage(progress);
  const rewardStatus = determineRewardStatus(progress, true);
  const rewardMessage = getRewardStatusMessage(rewardStatus);

  const isTodayChecked = checkIns.some((c) => c.date === today);
  const dateRange = getDateRange(userRoutine.startDate, userRoutine.endDate);
  const checkInDates = new Set(checkIns.map((c) => c.date));

  const handleCheckIn = () => {
    navigate(`/active/${userRoutine.id}/checkin`);
  };

  const handleRewardDetail = () => {
    navigate(`/reward/${userRoutine.id}`);
  };

  return (
    <AppLayout>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="mb-[24px]">
          <div className="flex items-center gap-[6px] mb-[12px]">
            <Badge
              color={isTodayChecked ? 'green' : 'grey'}
              variant="weak"
              size="small"
            >
              {isTodayChecked ? '오늘 완료' : '체크인 대기'}
            </Badge>
            <Badge color="grey" variant="weak" size="small">
              {daysElapsed}일차
            </Badge>
          </div>

          <div className="flex items-center gap-[10px] mb-[8px]">
            <span className="text-[32px]">{template.emoji}</span>
            <h1 className="text-[24px] font-bold text-[#191F28]">
              {template.title}
            </h1>
          </div>
          <p className="text-[14px] text-[#8B95A1]">
            {template.description}
          </p>
        </div>

        {/* Progress Card */}
        <Card variant="elevated" size="medium" className="mb-[16px]">
          <div className="flex justify-between items-center mb-[12px]">
            <span className="text-[16px] font-semibold text-[#191F28]">
              {progressMessage}
            </span>
            <span className="text-[20px] font-bold text-[#5B5CF9]">
              {progress}%
            </span>
          </div>
          <ProgressBar value={progress} size="thick" color="blue" />

          <div className="mt-[16px] grid grid-cols-3 gap-[12px]">
            <div className="text-center">
              <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
                완료
              </span>
              <span className="text-[18px] font-bold text-[#191F28]">
                {userRoutine.completedDays}일
              </span>
            </div>
            <div className="text-center">
              <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
                목표
              </span>
              <span className="text-[18px] font-bold text-[#191F28]">
                {userRoutine.targetDays}일
              </span>
            </div>
            <div className="text-center">
              <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
                남음
              </span>
              <span className="text-[18px] font-bold text-[#191F28]">
                {daysRemaining}일
              </span>
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-[16px]">
            체크인 기록
          </h3>

          <div className="grid grid-cols-7 gap-[8px]">
            {dateRange.map((date) => {
              const isChecked = checkInDates.has(date);
              const isTodayDate = isToday(date);
              const isPastDate = isPast(date) && !isTodayDate;
              const isMissed = isPastDate && !isChecked;

              return (
                <div
                  key={date}
                  className={`
                    aspect-square rounded-[8px] flex items-center justify-center
                    text-[12px] font-medium
                    ${isChecked
                      ? 'bg-[#5B5CF9] text-white'
                      : isTodayDate
                        ? 'bg-[#F0F0FF] text-[#5B5CF9] border-2 border-[#5B5CF9]'
                        : isMissed
                          ? 'bg-[#FFEBEE] text-[#F04251]'
                          : 'bg-[#F2F4F6] text-[#8B95A1]'
                    }
                  `}
                >
                  {isChecked ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8L7 11L12 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    new Date(date).getDate()
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-[16px] flex items-center gap-[16px] justify-center">
            <div className="flex items-center gap-[6px]">
              <div className="w-[12px] h-[12px] rounded-[4px] bg-[#5B5CF9]" />
              <span className="text-[12px] text-[#6B7684]">완료</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="w-[12px] h-[12px] rounded-[4px] bg-[#F0F0FF] border border-[#5B5CF9]" />
              <span className="text-[12px] text-[#6B7684]">오늘</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="w-[12px] h-[12px] rounded-[4px] bg-[#FFEBEE]" />
              <span className="text-[12px] text-[#6B7684]">미완료</span>
            </div>
          </div>
        </Card>

        {/* Reward Status */}
        <Card
          variant="outlined"
          size="medium"
          className={`mb-[24px] cursor-pointer ${
            rewardStatus === 'UNLOCK' || rewardStatus === 'APPLY'
              ? 'border-[#5B5CF9] bg-[#F0F0FF]'
              : 'border-[#E5E8EB]'
          }`}
          onClick={handleRewardDetail}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="w-[48px] h-[48px] rounded-[12px] bg-[#F2F4F6] flex items-center justify-center">
                {rewardStatus === 'UNLOCK' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L14.704 7.56L20.776 8.46L16.388 12.72L17.408 18.764L12 15.88L6.592 18.764L7.612 12.72L3.224 8.46L9.296 7.56L12 2Z"
                      fill="#FFD700"
                    />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L14.704 7.56L20.776 8.46L16.388 12.72L17.408 18.764L12 15.88L6.592 18.764L7.612 12.72L3.224 8.46L9.296 7.56L12 2Z"
                      stroke="#8B95A1"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#191F28]">
                  {template.reward.name}
                </h4>
                <p className="text-[13px] text-[#8B95A1]">
                  {rewardMessage}
                </p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="#8B95A1"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Card>

        {/* Action Button */}
        {!isTodayChecked && (
          <Button
            size="large"
            variant="solid"
            onClick={handleCheckIn}
            className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
          >
            오늘 체크인하기
          </Button>
        )}

        {isTodayChecked && rewardStatus === 'UNLOCK' && (
          <Button
            size="large"
            variant="solid"
            onClick={handleRewardDetail}
            className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
          >
            리워드 신청하기
          </Button>
        )}

        {/* Period Info */}
        <div className="mt-[16px] text-center">
          <p className="text-[13px] text-[#8B95A1]">
            {formatDateKorean(userRoutine.startDate)} ~ {formatDateKorean(userRoutine.endDate)}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
