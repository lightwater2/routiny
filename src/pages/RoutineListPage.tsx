import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Card, Badge, AppLayout, Loader } from '../shared/ui';
import type { CategoryType, RoutineType, Campaign } from '../shared/types';
import { categoryInfo, difficultyConfig, campaignStatusConfig } from '../entities/campaign';
import { getCampaignsByCategory } from '../shared/api';
import { formatDateKorean } from '../shared/lib/date';

export function RoutineListPage() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const routineType: RoutineType = location.state?.routineType || 'individual';

  const currentCategory = (category as CategoryType) || 'health';
  const info = categoryInfo[currentCategory];

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const data = await getCampaignsByCategory(currentCategory, routineType);
        setCampaigns(data);
      } catch (error) {
        console.error('캠페인 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCampaigns();
  }, [currentCategory, routineType]);

  const handleCampaignClick = (campaignId: string) => {
    navigate(`/campaign/${campaignId}`, {
      state: { routineType, category: currentCategory },
    });
  };

  const typeLabel = routineType === 'team' ? '팀' : '개인';

  return (
    <AppLayout>
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
            캠페인에 참여하고 루틴을 완주하면 실제 선물을 보내드려요.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-[48px]">
            <Loader size="medium" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-[48px]">
            <span className="text-[48px] mb-[16px]">🔍</span>
            <p className="text-[16px] text-[#8B95A1] text-center">
              아직 준비된 캠페인이 없어요.
              <br />
              곧 새로운 캠페인이 추가될 예정이에요!
            </p>
          </div>
        )}

        {/* Campaign Cards */}
        <div className="flex flex-col gap-[16px] pb-[24px]">
          {campaigns.map((campaign) => {
            const difficulty = difficultyConfig[campaign.difficulty];
            const statusConfig = campaignStatusConfig[campaign.status];
            const hasSpots = !campaign.maxParticipants ||
              campaign.currentParticipants < campaign.maxParticipants;

            return (
              <Card
                key={campaign.id}
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
                      backgroundColor: statusConfig.bgColor,
                      color: statusConfig.color,
                    }}
                  >
                    {statusConfig.label}
                  </Badge>
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
                    {campaign.targetDays}일 동안
                  </Badge>
                  {campaign.subCategory && (
                    <Badge
                      color="grey"
                      variant="weak"
                      size="small"
                      className="bg-[#F2F4F6] text-[#6B7684]"
                    >
                      {campaign.subCategory === 'baby' && '육아'}
                      {campaign.subCategory === 'pet' && '반려동물'}
                      {campaign.subCategory === 'senior' && '시니어'}
                    </Badge>
                  )}
                </div>

                {/* Content Row */}
                <div className="flex items-start justify-between gap-[12px]">
                  {/* Text Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-[8px] mb-[4px]">
                      <span className="text-[20px]">{campaign.emoji}</span>
                      <h3 className="text-[17px] font-bold text-[#191F28]">
                        {campaign.title}
                      </h3>
                    </div>
                    <p className="text-[14px] text-[#8B95A1] mb-[8px]">
                      {campaign.description}
                    </p>

                    {/* Period */}
                    <p className="text-[12px] text-[#6B7684] mb-[4px]">
                      {formatDateKorean(campaign.startDate)} ~ {formatDateKorean(campaign.endDate)}
                    </p>

                    {/* Reward & Participants */}
                    <div className="flex items-center gap-[12px]">
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
                          리워드: {campaign.reward.name}
                        </span>
                      </div>
                      {campaign.maxParticipants && (
                        <span className="text-[12px] text-[#8B95A1]">
                          {campaign.currentParticipants}/{campaign.maxParticipants}명
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reward Image Placeholder */}
                  <div className="w-[72px] h-[72px] rounded-[12px] bg-[#F2F4F6] flex items-center justify-center overflow-hidden shrink-0">
                    <div className="text-[10px] text-[#5B5CF9] font-medium text-center px-[4px]">
                      {campaign.reward.category}
                    </div>
                  </div>
                </div>

                {/* Button */}
                <Button
                  size="medium"
                  variant="outline"
                  onClick={() => handleCampaignClick(campaign.id)}
                  className="w-full mt-[12px] border-[#E5E8EB] text-[#4E5968]"
                  disabled={!hasSpots}
                >
                  {hasSpots ? '캠페인 상세보기' : '모집 마감'}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
