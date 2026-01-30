import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge, ProgressBar, AppLayout, Profile, Loader } from '../shared/ui';
import { calculateProgress } from '../shared/lib/calculation';
import {
  getAllUserRoutines,
  getTotalCheckInCount,
  getUnlockedRewardCount,
} from '../shared/api';
import type { UserRoutine } from '../shared/types';

interface UserStats {
  totalRoutines: number;
  completedRoutines: number;
  activeRoutines: number;
  totalCheckIns: number;
  unlockedRewards: number;
}

export function MyPage() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<UserRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalRoutines: 0,
    completedRoutines: 0,
    activeRoutines: 0,
    totalCheckIns: 0,
    unlockedRewards: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [allRoutines, checkInCount, rewardCount] = await Promise.all([
          getAllUserRoutines(),
          getTotalCheckInCount(),
          getUnlockedRewardCount(),
        ]);

        setRoutines(allRoutines);

        const activeCount = allRoutines.filter((r) => r.status === 'active').length;
        const completedCount = allRoutines.filter((r) => r.status === 'completed').length;

        setStats({
          totalRoutines: allRoutines.length,
          activeRoutines: activeCount,
          completedRoutines: completedCount,
          totalCheckIns: checkInCount,
          unlockedRewards: rewardCount,
        });
      } catch (error) {
        console.error('마이페이지 데이터 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleExploreRoutines = () => {
    navigate('/');
  };

  const handleActiveRoutines = () => {
    navigate('/active');
  };

  // 완료율 계산
  const overallProgress = routines.length > 0
    ? Math.round(
        routines.reduce((sum, r) => sum + calculateProgress(r.completedDays, r.targetDays), 0) /
          routines.length
      )
    : 0;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="medium" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Profile Header */}
        <div className="flex items-center gap-[16px] mb-[24px]">
          <Profile
            size="large"
            text="루"
          />
          <div>
            <h1 className="text-[20px] font-bold text-[#191F28]">
              루티니 사용자
            </h1>
            <p className="text-[14px] text-[#8B95A1]">
              함께 루틴을 만들어가요!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-[12px] mb-[24px]">
          <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
            <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
              진행 중인 루틴
            </span>
            <span className="text-[24px] font-bold text-[#5B5CF9]">
              {stats.activeRoutines}
            </span>
          </Card>
          <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
            <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
              완료한 루틴
            </span>
            <span className="text-[24px] font-bold text-[#15C67F]">
              {stats.completedRoutines}
            </span>
          </Card>
          <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
            <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
              총 체크인
            </span>
            <span className="text-[24px] font-bold text-[#191F28]">
              {stats.totalCheckIns}
            </span>
          </Card>
          <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
            <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
              획득한 리워드
            </span>
            <span className="text-[24px] font-bold text-[#FFD700]">
              {stats.unlockedRewards}
            </span>
          </Card>
        </div>

        {/* Overall Progress */}
        {routines.length > 0 && (
          <Card variant="elevated" size="medium" className="mb-[24px]">
            <div className="flex justify-between items-center mb-[12px]">
              <h3 className="text-[16px] font-semibold text-[#191F28]">
                전체 달성률
              </h3>
              <span className="text-[18px] font-bold text-[#5B5CF9]">
                {overallProgress}%
              </span>
            </div>
            <ProgressBar value={overallProgress} size="normal" color="blue" />
          </Card>
        )}

        {/* Recent Routines */}
        <div className="mb-[24px]">
          <div className="flex justify-between items-center mb-[16px]">
            <h3 className="text-[16px] font-semibold text-[#191F28]">
              내 루틴
            </h3>
            {routines.length > 0 && (
              <button
                onClick={handleActiveRoutines}
                className="text-[14px] text-[#5B5CF9] font-medium"
              >
                전체보기
              </button>
            )}
          </div>

          {routines.length === 0 ? (
            <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
              <div className="text-center py-[24px]">
                <span className="text-[48px] block mb-[12px]">🌱</span>
                <p className="text-[14px] text-[#8B95A1] mb-[16px]">
                  아직 시작한 루틴이 없어요
                </p>
                <Button
                  size="medium"
                  variant="solid"
                  onClick={handleExploreRoutines}
                  className="bg-[#5B5CF9] hover:bg-[#4A4BE8]"
                >
                  루틴 둘러보기
                </Button>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col gap-[12px]">
              {routines.slice(0, 3).map((routine) => {
                const progress = calculateProgress(
                  routine.completedDays,
                  routine.targetDays
                );
                return (
                  <Card
                    key={routine.id}
                    variant="outlined"
                    size="medium"
                    className="border-[#E5E8EB] cursor-pointer"
                    onClick={() => navigate(`/active/${routine.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[12px]">
                        <span className="text-[24px]">
                          {routine.template.emoji}
                        </span>
                        <div>
                          <h4 className="text-[15px] font-semibold text-[#191F28]">
                            {routine.template.title}
                          </h4>
                          <p className="text-[13px] text-[#8B95A1]">
                            {routine.completedDays}/{routine.targetDays}일 완료
                          </p>
                        </div>
                      </div>
                      <Badge
                        color={routine.status === 'active' ? 'blue' : 'green'}
                        variant="weak"
                        size="small"
                      >
                        {routine.status === 'active' ? `${progress}%` : '완료'}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-[12px]">
          <Button
            size="large"
            variant="outline"
            onClick={handleExploreRoutines}
            className="w-full border-[#E5E8EB] text-[#4E5968]"
          >
            새 루틴 시작하기
          </Button>
        </div>

        {/* App Info */}
        <div className="mt-[32px] text-center">
          <p className="text-[12px] text-[#B0B8C1]">
            루티니 v1.0.0
          </p>
          <p className="text-[12px] text-[#B0B8C1] mt-[4px]">
            루틴을 실천하면, 진짜 보상이 따라옵니다.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
