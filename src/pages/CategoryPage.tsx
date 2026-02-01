import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Badge, AppLayout } from '../shared/ui';
import type { CategoryType } from '../shared/types';

interface CategoryData {
  id: CategoryType;
  name: string;
  description: string;
  emoji: string;
  routines: string[];
}

const categories: CategoryData[] = [
  {
    id: 'care',
    name: '케어',
    description: '건강하고 행복한 일상을 위한 루틴',
    emoji: '💝',
    routines: ['아기 분유 체크', '반려동물 산책', '약 챙겨먹기'],
  },
  {
    id: 'health',
    name: '헬스',
    description: '활력있고 건강한 생활 습관',
    emoji: '💪',
    routines: ['5천보 걷기', '10분 스트레칭', '식단 관리'],
  },
  {
    id: 'daily',
    name: '데일리',
    description: '일상을 특별하게 만드는 작은 습관',
    emoji: '✨',
    routines: ['일기 쓰기', '칭찬하기', '절약하기'],
  },
];

export function CategoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routineType = location.state?.routineType || 'individual';
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  const handleSelect = (categoryId: CategoryType) => {
    setSelectedCategory(categoryId);
  };

  const handleNext = () => {
    if (selectedCategory) {
      navigate(`/campaigns/${selectedCategory}`, {
        state: { routineType, category: selectedCategory }
      });
    }
  };

  const bottomCTA = (
    <Button
      size="large"
      variant="solid"
      disabled={!selectedCategory}
      onClick={handleNext}
      className={`
        w-full
        ${selectedCategory
          ? 'bg-[#5B5CF9] hover:bg-[#4A4BE8]'
          : 'bg-[#E5E8EB] text-[#B0B8C1]'
        }
      `}
    >
      카테고리 선택
    </Button>
  );

  return (
    <AppLayout bottomArea={bottomCTA} bottomAreaHeight={80}>
      {/* Content */}
      <div className="px-[20px] pt-[24px]">
        {/* Title */}
        <div className="mb-[24px]">
          <h2 className="text-[24px] font-bold text-[#191F28]">
            어떤 카테고리의 루틴을 찾으시나요?
          </h2>
        </div>

        {/* Category Cards */}
        <div className="flex flex-col gap-[16px]">
          {categories.map((category) => (
            <Card
              key={category.id}
              variant="outlined"
              size="medium"
              clickable
              onClick={() => handleSelect(category.id)}
              className={`
                transition-all
                ${selectedCategory === category.id
                  ? 'border-[#5B5CF9] border-2'
                  : 'border-[#E5E8EB]'
                }
              `}
            >
              <div className="flex flex-col gap-[12px]">
                {/* Header */}
                <div className="flex items-center gap-[8px]">
                  <span className="text-[24px]">{category.emoji}</span>
                  <span className="text-[18px] font-bold text-[#191F28]">
                    {category.name}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[14px] text-[#8B95A1]">
                  {category.description}
                </p>

                {/* Routine Tags */}
                <div className="flex flex-wrap gap-[8px]">
                  {category.routines.map((routine) => (
                    <Badge
                      key={routine}
                      color="grey"
                      variant="weak"
                      size="medium"
                    >
                      {routine}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
