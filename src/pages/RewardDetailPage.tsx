import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Badge, ProgressBar, AppLayout, Loader } from '../shared/ui';
import {
  calculateProgress,
  determineRewardStatus,
  getRewardStatusMessage,
} from '../shared/lib/calculation';
import { getParticipationById, getRewardByParticipation } from '../shared/api';
import type { CampaignParticipation, RewardStatus } from '../shared/types';

const statusSteps: { status: RewardStatus; label: string }[] = [
  { status: 'LOCK', label: '시작 전' },
  { status: 'PROGRESS', label: '진행 중' },
  { status: 'UNLOCK', label: '달성' },
  { status: 'APPLY', label: '신청 완료' },
  { status: 'SHIPPING', label: '배송 중' },
  { status: 'DELIVERED', label: '배송 완료' },
];

export function RewardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participation, setParticipation] = useState<CampaignParticipation | null>(null);
  const [currentStatus, setCurrentStatus] = useState<RewardStatus>('LOCK');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;

        const data = await getParticipationById(id);
        if (data) {
          setParticipation(data);
          const progress = calculateProgress(data.completedDays, data.campaign.targetDays);
          setCurrentStatus(determineRewardStatus(progress, true));
        }

        // 리워드 상태 조회
        const rewardData = await getRewardByParticipation(id);
        if (rewardData) {
          setCurrentStatus(rewardData.status);
        }
      } catch (error) {
        console.error('리워드 조회 실패:', error);
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

  if (!participation) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-[20px]">
          <span className="text-[48px] mb-[16px]">😢</span>
          <h2 className="text-[20px] font-bold text-[#191F28] mb-[8px]">
            리워드를 찾을 수 없어요
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

  const campaign = participation.campaign;
  const progress = calculateProgress(participation.completedDays, campaign.targetDays);
  const rewardMessage = getRewardStatusMessage(currentStatus);

  const currentStepIndex = statusSteps.findIndex((s) => s.status === currentStatus);
  const canApply = currentStatus === 'UNLOCK';

  const handleApply = () => {
    navigate(`/reward/${id}/apply`);
  };

  return (
    <AppLayout>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="mb-[24px]">
          <Badge
            color={canApply ? 'green' : 'grey'}
            variant="weak"
            size="small"
            className="mb-[12px]"
          >
            {rewardMessage}
          </Badge>

          <h1 className="text-[24px] font-bold text-[#191F28] mb-[8px]">
            리워드 상세
          </h1>
          <p className="text-[14px] text-[#8B95A1]">
            {campaign.title} 루틴의 리워드예요
          </p>
        </div>

        {/* Reward Card */}
        <Card variant="elevated" size="medium" className="mb-[16px]">
          {/* Reward Image */}
          <div className="w-full h-[200px] bg-[#F2F4F6] rounded-[12px] mb-[16px] flex items-center justify-center">
            <span className="text-[14px] text-[#8B95A1]">
              {campaign.reward.category}
            </span>
          </div>

          {/* Reward Info */}
          <div className="flex items-center gap-[6px] mb-[12px]">
            {campaign.reward.brand && (
              <Badge color="grey" variant="weak" size="small">
                {campaign.reward.brand}
              </Badge>
            )}
            <Badge color="grey" variant="weak" size="small">
              {campaign.reward.category}
            </Badge>
          </div>

          <h2 className="text-[20px] font-bold text-[#191F28] mb-[8px]">
            {campaign.reward.name}
          </h2>
          <p className="text-[14px] text-[#6B7684] leading-[1.6]">
            {campaign.reward.description}
          </p>
        </Card>

        {/* Progress Status */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-[16px]">
            달성 현황
          </h3>

          <div className="flex justify-between items-center mb-[12px]">
            <span className="text-[14px] text-[#6B7684]">진행률</span>
            <span className="text-[18px] font-bold text-[#5B5CF9]">
              {progress}%
            </span>
          </div>
          <ProgressBar value={progress} size="normal" color="blue" />

          {progress < campaign.achievementRate && (
            <p className="mt-[12px] text-[13px] text-[#8B95A1]">
              {campaign.achievementRate}% 이상 달성하면 리워드를 신청할 수 있어요!
              <br />
              현재 {Math.max(0, Math.ceil((campaign.achievementRate - progress) / 100 * campaign.targetDays))}일 더 완료하면 돼요.
            </p>
          )}
        </Card>

        {/* Status Steps */}
        <Card variant="outlined" size="medium" className="mb-[24px] border-[#E5E8EB]">
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-[16px]">
            리워드 상태
          </h3>

          <div className="flex flex-col gap-[12px]">
            {statusSteps.slice(1).map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex - 1;

              return (
                <div key={step.status} className="flex items-center gap-[12px]">
                  <div
                    className={`
                      w-[24px] h-[24px] rounded-full flex items-center justify-center
                      ${isCompleted || isCurrent
                        ? 'bg-[#5B5CF9]'
                        : 'bg-[#E5E8EB]'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M3 6L5 8L9 4"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : isCurrent ? (
                      <div className="w-[8px] h-[8px] rounded-full bg-white" />
                    ) : (
                      <div className="w-[8px] h-[8px] rounded-full bg-[#B0B8C1]" />
                    )}
                  </div>
                  <span
                    className={`text-[14px] ${
                      isCompleted || isCurrent
                        ? 'text-[#191F28] font-medium'
                        : 'text-[#8B95A1]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Button */}
        {canApply && (
          <Button
            size="large"
            variant="solid"
            onClick={handleApply}
            className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
          >
            리워드 신청하기
          </Button>
        )}

        {currentStatus === 'APPLY' && (
          <div className="text-center">
            <p className="text-[14px] text-[#5B5CF9] font-medium">
              리워드 신청이 완료되었어요!
            </p>
            <p className="text-[13px] text-[#8B95A1] mt-[4px]">
              곧 배송이 시작될 예정이에요.
            </p>
          </div>
        )}

        {currentStatus === 'SHIPPING' && (
          <div className="text-center">
            <p className="text-[14px] text-[#5B5CF9] font-medium">
              리워드가 배송 중이에요!
            </p>
            <p className="text-[13px] text-[#8B95A1] mt-[4px]">
              조금만 기다려주세요.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
