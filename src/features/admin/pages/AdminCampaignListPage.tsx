import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, AppLayout, Loader } from '../../../shared/ui';
import { categoryInfo, difficultyConfig, campaignStatusConfig } from '../../../entities/campaign';
import { getAllCampaigns } from '../api/adminCampaigns';
import { formatDateKorean } from '../../../shared/lib/date';
import type { Campaign, CampaignStatus } from '../../../shared/types';

const statusTabs: { value: CampaignStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'draft', label: '초안' },
  { value: 'published', label: '모집중' },
  { value: 'active', label: '진행중' },
  { value: 'ended', label: '종료' },
];

export function AdminCampaignListPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CampaignStatus | 'all'>('all');

  useEffect(() => {
    async function fetchCampaigns() {
      setIsLoading(true);
      try {
        const status = activeTab === 'all' ? undefined : activeTab;
        const data = await getAllCampaigns(status);
        setCampaigns(data);
      } catch (error) {
        console.error('캠페인 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCampaigns();
  }, [activeTab]);

  return (
    <AppLayout>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[20px]">
          <h1 className="text-[24px] font-bold text-[#191F28]">
            캠페인 관리
          </h1>
          <Button
            size="medium"
            variant="solid"
            onClick={() => navigate('/admin/campaigns/new')}
            className="bg-[#5B5CF9] hover:bg-[#4A4BE8]"
          >
            + 새 캠페인
          </Button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-[8px] mb-[20px] overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`
                px-[14px] py-[8px] rounded-full text-[14px] font-medium
                whitespace-nowrap transition-colors shrink-0
                ${activeTab === tab.value
                  ? 'bg-[#191F28] text-white'
                  : 'bg-[#F2F4F6] text-[#6B7684]'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-[48px]">
            <Loader size="medium" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-[48px]">
            <span className="text-[48px] mb-[16px]">📋</span>
            <p className="text-[16px] text-[#8B95A1] text-center">
              {activeTab === 'all'
                ? '아직 생성된 캠페인이 없어요.'
                : `${statusTabs.find((t) => t.value === activeTab)?.label} 상태의 캠페인이 없어요.`}
            </p>
          </div>
        )}

        {/* Campaign List */}
        <div className="flex flex-col gap-[12px]">
          {campaigns.map((campaign) => {
            const categoryData = categoryInfo[campaign.category];
            const difficulty = difficultyConfig[campaign.difficulty];
            const statusCfg = campaignStatusConfig[campaign.status];

            return (
              <Card
                key={campaign.id}
                variant="outlined"
                size="medium"
                className="border-[#E5E8EB] cursor-pointer active:bg-[#F7F8F9]"
                onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}
              >
                {/* Badges */}
                <div className="flex items-center gap-[6px] mb-[8px]">
                  <Badge
                    color="grey"
                    variant="weak"
                    size="small"
                    style={{ backgroundColor: statusCfg.bgColor, color: statusCfg.color }}
                  >
                    {statusCfg.label}
                  </Badge>
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
                    style={{ backgroundColor: difficulty.bgColor, color: difficulty.color }}
                  >
                    {difficulty.label}
                  </Badge>
                  {campaign.isFeatured && (
                    <Badge
                      color="grey"
                      variant="weak"
                      size="small"
                      className="bg-[#FFF3E0] text-[#FF9100]"
                    >
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <div className="flex items-center gap-[8px] mb-[4px]">
                  <span className="text-[18px]">{campaign.emoji}</span>
                  <h3 className="text-[16px] font-bold text-[#191F28] flex-1 truncate">
                    {campaign.title}
                  </h3>
                </div>

                {/* Info */}
                <div className="flex items-center gap-[16px] text-[12px] text-[#8B95A1] mt-[8px]">
                  <span>
                    {formatDateKorean(campaign.startDate)} ~ {formatDateKorean(campaign.endDate)}
                  </span>
                  <span>{campaign.targetDays}일</span>
                  <span>
                    {campaign.currentParticipants}명
                    {campaign.maxParticipants && ` / ${campaign.maxParticipants}명`}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
