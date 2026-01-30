import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Card, Badge, AppLayout } from '../shared/ui';
import type { CategoryType, RoutineType } from '../shared/types';
import {
  getRoutinesByCategory,
  categoryInfo,
  difficultyConfig,
} from '../entities/routine';

export function RoutineListPage() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const routineType: RoutineType = location.state?.routineType || 'individual';

  const currentCategory = (category as CategoryType) || 'health';
  const info = categoryInfo[currentCategory];
  const routines = getRoutinesByCategory(currentCategory, routineType);

  const handleRoutineClick = (routineId: string) => {
    navigate(`/routine/${routineId}`, {
      state: { routineType, category: currentCategory },
    });
  };

  const handleCreateRoutine = () => {
    console.log('Create custom routine');
  };

  const typeLabel = routineType === 'team' ? '팀' : '개인';

  const bottomCTA = (
    <Button
      size="large"
      variant="solid"
      onClick={handleCreateRoutine}
      className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
    >
      원하는 루틴이 없나요? 직접 만들기
    </Button>
  );

  return (
    <AppLayout bottomArea={bottomCTA} bottomAreaHeight={80}>
      <div className="px-[20px] pt-[16px]">
        {/* Type Badge */}
        <div className="mb-[12px]">
          <Badge
            color="grey"
            variant="weak"
            size="small"
            className="bg-[#F0F0FF] text-[#5B5CF9]"
          >
            {typeLabel} 루틴
          </Badge>
        </div>

        {/* Category Icon & Title */}
        <div className="mb-[24px]">
          <span className="text-[32px] block mb-[8px]">{info.emoji}</span>
          <h2 className="text-[24px] font-bold text-[#191F28] leading-[1.3]">
            {info.title}
            <br />
            <span className="text-[#5B5CF9]">{info.subtitle}</span>
          </h2>
          <p className="text-[14px] text-[#8B95A1] mt-[8px]">
            루틴을 완주하면 실제 선물을 보내드려요.
          </p>
        </div>

        {/* Empty State */}
        {routines.length === 0 && (
          <div className="flex flex-col items-center justify-center py-[48px]">
            <span className="text-[48px] mb-[16px]">🔍</span>
            <p className="text-[16px] text-[#8B95A1] text-center">
              아직 준비된 루틴이 없어요.
              <br />
              곧 새로운 루틴이 추가될 예정이에요!
            </p>
          </div>
        )}

        {/* Routine Cards */}
        <div className="flex flex-col gap-[16px] pb-[24px]">
          {routines.map((routine) => {
            const difficulty = difficultyConfig[routine.difficulty];
            return (
              <Card
                key={routine.id}
                variant="outlined"
                size="medium"
                className="border-[#E5E8EB]"
              >
                {/* Badges */}
                <div className="flex items-center gap-[6px] mb-[12px]">
                  <Badge
                    color="grey"
                    variant="weak"
                    size="small"
                    style={{
                      backgroundColor: difficulty.bgColor,
                      color: difficulty.color,
                    }}
                  >
                    {difficulty.label}
                  </Badge>
                  <Badge color="grey" variant="weak" size="small">
                    {routine.defaultDuration}일 동안
                  </Badge>
                  {routine.subCategory && (
                    <Badge
                      color="grey"
                      variant="weak"
                      size="small"
                      className="bg-[#F2F4F6] text-[#6B7684]"
                    >
                      {routine.subCategory === 'baby' && '육아'}
                      {routine.subCategory === 'pet' && '반려동물'}
                      {routine.subCategory === 'senior' && '시니어'}
                    </Badge>
                  )}
                </div>

                {/* Content Row */}
                <div className="flex items-start justify-between gap-[12px]">
                  {/* Text Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-[8px] mb-[4px]">
                      <span className="text-[20px]">{routine.emoji}</span>
                      <h3 className="text-[17px] font-bold text-[#191F28]">
                        {routine.title}
                      </h3>
                    </div>
                    <p className="text-[14px] text-[#8B95A1] mb-[12px]">
                      {routine.description}
                    </p>
                    <div className="flex items-center gap-[4px]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 1L10.163 5.279L15 6.018L11.5 9.409L12.326 14.218L8 11.972L3.674 14.218L4.5 9.409L1 6.018L5.837 5.279L8 1Z"
                          fill="#FFD700"
                        />
                      </svg>
                      <span className="text-[12px] text-[#6B7684]">
                        리워드: {routine.reward.name}
                      </span>
                    </div>
                  </div>

                  {/* Reward Image Placeholder */}
                  <div className="w-[72px] h-[72px] rounded-[12px] bg-[#F2F4F6] flex items-center justify-center overflow-hidden shrink-0">
                    <div className="text-[10px] text-[#5B5CF9] font-medium text-center px-[4px]">
                      {routine.reward.category}
                    </div>
                  </div>
                </div>

                {/* Button */}
                <Button
                  size="medium"
                  variant="outline"
                  onClick={() => handleRoutineClick(routine.id)}
                  className="w-full mt-[12px] border-[#E5E8EB] text-[#4E5968]"
                >
                  루틴 상세보기
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
