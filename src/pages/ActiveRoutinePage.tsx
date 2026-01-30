import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, ProgressBar, AppLayout, EmptyState, Loader } from '../shared/ui';
import { getToday, formatDateKorean, getDaysRemaining, getDaysElapsed } from '../shared/lib/date';
import { calculateProgress, getProgressMessage } from '../shared/lib/calculation';
import { getActiveRoutines, isTodayCheckedIn } from '../shared/api';
import type { UserRoutine } from '../shared/types';

export function ActiveRoutinePage() {
  const navigate = useNavigate();
  const [activeRoutines, setActiveRoutines] = useState<UserRoutine[]>([]);
  const [checkInStatus, setCheckInStatus] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const today = getToday();

  useEffect(() => {
    async function fetchData() {
      try {
        const routines = await getActiveRoutines();
        setActiveRoutines(routines);

        // 각 루틴의 오늘 체크인 여부 확인
        const statusMap: Record<string, boolean> = {};
        await Promise.all(
          routines.map(async (r) => {
            statusMap[r.id] = await isTodayCheckedIn(r.id, today);
          })
        );
        setCheckInStatus(statusMap);
      } catch (error) {
        console.error('활성 루틴 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [today]);

  const handleCheckIn = (routineId: string) => {
    navigate(`/active/${routineId}/checkin`);
  };

  const handleRoutineDetail = (routineId: string) => {
    navigate(`/active/${routineId}`);
  };

  const handleExploreRoutines = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="medium" />
        </div>
      </AppLayout>
    );
  }

  if (activeRoutines.length === 0) {
    return (
      <AppLayout>
        <div className="px-[20px] pt-[24px]">
          <h1 className="text-[24px] font-bold text-[#191F28] mb-[24px]">
            내 루틴
          </h1>

          <EmptyState
            icon={
              <span className="text-[48px]">🌱</span>
            }
            title="진행 중인 루틴이 없어요"
            description="새로운 루틴을 시작하고 리워드를 받아보세요!"
            action={
              <Button
                size="medium"
                variant="solid"
                onClick={handleExploreRoutines}
                className="bg-[#5B5CF9] hover:bg-[#4A4BE8]"
              >
                루틴 둘러보기
              </Button>
            }
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="mb-[24px]">
          <h1 className="text-[24px] font-bold text-[#191F28] mb-[4px]">
            내 루틴
          </h1>
          <p className="text-[14px] text-[#8B95A1]">
            오늘도 함께 달려볼까요?
          </p>
        </div>

        {/* Today's Date */}
        <div className="mb-[16px] p-[12px] bg-[#F0F0FF] rounded-[12px]">
          <p className="text-[14px] text-[#5B5CF9] font-medium text-center">
            오늘은 {formatDateKorean(today)}이에요
          </p>
        </div>

        {/* Active Routines */}
        <div className="flex flex-col gap-[16px]">
          {activeRoutines.map((routine) => {
            const template = routine.template;
            const progress = calculateProgress(routine.completedDays, routine.targetDays);
            const daysRemaining = getDaysRemaining(routine.endDate);
            const daysElapsed = getDaysElapsed(routine.startDate);
            const progressMessage = getProgressMessage(progress);
            const isTodayChecked = checkInStatus[routine.id] ?? false;

            return (
              <Card
                key={routine.id}
                variant="elevated"
                size="medium"
                className="cursor-pointer"
                onClick={() => handleRoutineDetail(routine.id)}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-[12px]">
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[24px]">{template.emoji}</span>
                    <div>
                      <h3 className="text-[16px] font-bold text-[#191F28]">
                        {template.title}
                      </h3>
                      <p className="text-[12px] text-[#8B95A1]">
                        {daysElapsed}일차 / {routine.targetDays}일
                      </p>
                    </div>
                  </div>
                  <Badge
                    color={isTodayChecked ? 'green' : 'grey'}
                    variant="weak"
                    size="small"
                  >
                    {isTodayChecked ? '오늘 완료' : '체크인 대기'}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="mb-[12px]">
                  <div className="flex justify-between items-center mb-[8px]">
                    <span className="text-[13px] text-[#6B7684]">
                      {progressMessage}
                    </span>
                    <span className="text-[14px] font-semibold text-[#5B5CF9]">
                      {progress}%
                    </span>
                  </div>
                  <ProgressBar
                    value={progress}
                    size="normal"
                    color="blue"
                  />
                </div>

                {/* Info Row */}
                <div className="flex items-center justify-between pt-[12px] border-t border-[#F2F4F6]">
                  <div className="flex items-center gap-[12px]">
                    <div className="flex items-center gap-[4px]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 14A6 6 0 108 2a6 6 0 000 12z"
                          stroke="#8B95A1"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 4.667V8l2 2"
                          stroke="#8B95A1"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-[12px] text-[#8B95A1]">
                        {daysRemaining}일 남음
                      </span>
                    </div>
                    <div className="flex items-center gap-[4px]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 1L10.163 5.279L15 6.018L11.5 9.409L12.326 14.218L8 11.972L3.674 14.218L4.5 9.409L1 6.018L5.837 5.279L8 1Z"
                          fill="#FFD700"
                        />
                      </svg>
                      <span className="text-[12px] text-[#8B95A1]">
                        {progress >= 90 ? '리워드 달성!' : '90% 목표'}
                      </span>
                    </div>
                  </div>

                  {!isTodayChecked && (
                    <Button
                      size="tiny"
                      variant="solid"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckIn(routine.id);
                      }}
                      className="bg-[#5B5CF9] hover:bg-[#4A4BE8]"
                    >
                      체크인
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Add Routine Button */}
        <div className="mt-[24px]">
          <Button
            size="large"
            variant="outline"
            onClick={handleExploreRoutines}
            className="w-full border-[#E5E8EB] text-[#4E5968]"
          >
            새 루틴 추가하기
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
