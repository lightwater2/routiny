import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Dialog, AppLayout, Loader } from '../../../shared/ui';
import { categoryInfo, difficultyConfig, campaignStatusConfig } from '../../../entities/campaign';
import {
  getCampaignById,
} from '../../../shared/api';
import {
  publishCampaign,
  unpublishCampaign,
  endCampaign,
  getCampaignParticipantCount,
} from '../api/adminCampaigns';
import { formatDateKorean } from '../../../shared/lib/date';
import type { Campaign } from '../../../shared/types';

const verificationTypeLabels: Record<string, string> = {
  simple_check: '단순 체크',
  text_input: '텍스트 입력',
  photo_upload: '사진 인증',
  counter_input: '숫자 입력',
  time_record: '시간 기록',
  receipt_record: '영수증 기록',
};

export function AdminCampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [publishDialog, setPublishDialog] = useState(false);
  const [unpublishDialog, setUnpublishDialog] = useState(false);
  const [endDialog, setEndDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;
        const [campaignData, count] = await Promise.all([
          getCampaignById(id),
          getCampaignParticipantCount(id),
        ]);
        setCampaign(campaignData);
        setParticipantCount(count);
      } catch (error) {
        console.error('캠페인 조회 실패:', error);
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

  if (!campaign) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-[20px]">
          <span className="text-[48px] mb-[16px]">😢</span>
          <h2 className="text-[20px] font-bold text-[#191F28] mb-[8px]">
            캠페인을 찾을 수 없어요
          </h2>
          <Button
            size="medium"
            variant="solid"
            onClick={() => navigate('/admin/campaigns')}
            className="bg-[#5B5CF9] hover:bg-[#4A4BE8]"
          >
            목록으로 돌아가기
          </Button>
        </div>
      </AppLayout>
    );
  }

  const categoryData = categoryInfo[campaign.category];
  const difficulty = difficultyConfig[campaign.difficulty];
  const statusCfg = campaignStatusConfig[campaign.status];

  const handlePublish = async () => {
    setPublishDialog(false);
    setIsActionLoading(true);
    try {
      const updated = await publishCampaign(campaign.id);
      setCampaign(updated);
    } catch (error) {
      console.error('캠페인 발행 실패:', error);
      alert('캠페인 발행에 실패했어요.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUnpublish = async () => {
    setUnpublishDialog(false);
    setIsActionLoading(true);
    try {
      const updated = await unpublishCampaign(campaign.id);
      setCampaign(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : '발행 취소에 실패했어요.';
      alert(message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEnd = async () => {
    setEndDialog(false);
    setIsActionLoading(true);
    try {
      const updated = await endCampaign(campaign.id);
      setCampaign(updated);
    } catch (error) {
      console.error('캠페인 종료 실패:', error);
      alert('캠페인 종료에 실패했어요.');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[20px]">
          <button
            type="button"
            onClick={() => navigate('/admin/campaigns')}
            className="text-[14px] text-[#6B7684]"
          >
            ← 목록
          </button>
          {campaign.status !== 'ended' && (
            <Button
              size="medium"
              variant="outline"
              onClick={() => navigate(`/admin/campaigns/${campaign.id}/edit`)}
              className="border-[#E5E8EB] text-[#4E5968]"
            >
              수정
            </Button>
          )}
        </div>

        {/* Status & Title */}
        <div className="mb-[24px]">
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
            <Badge
              color="grey"
              variant="weak"
              size="small"
              className="bg-[#F2F4F6] text-[#6B7684]"
            >
              {campaign.type === 'team' ? '팀' : '개인'}
            </Badge>
          </div>

          <div className="flex items-center gap-[10px] mb-[4px]">
            <span className="text-[28px]">{campaign.emoji}</span>
            <h1 className="text-[24px] font-bold text-[#191F28]">
              {campaign.title}
            </h1>
          </div>
          <p className="text-[14px] text-[#8B95A1]">{campaign.description}</p>
        </div>

        {/* Status Actions */}
        {campaign.status !== 'ended' && (
          <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
            <h3 className="text-[16px] font-semibold text-[#191F28] mb-[12px]">
              상태 관리
            </h3>
            <div className="flex gap-[8px]">
              {campaign.status === 'draft' && (
                <Button
                  size="medium"
                  variant="solid"
                  onClick={() => setPublishDialog(true)}
                  disabled={isActionLoading}
                  className="flex-1 bg-[#5B5CF9] hover:bg-[#4A4BE8]"
                >
                  발행하기
                </Button>
              )}
              {campaign.status === 'published' && (
                <>
                  <Button
                    size="medium"
                    variant="outline"
                    onClick={() => setUnpublishDialog(true)}
                    disabled={isActionLoading}
                    className="flex-1 border-[#E5E8EB] text-[#6B7684]"
                  >
                    발행 취소
                  </Button>
                  <Button
                    size="medium"
                    variant="solid"
                    onClick={() => setEndDialog(true)}
                    disabled={isActionLoading}
                    className="flex-1 bg-[#F04251] hover:bg-[#D93843]"
                  >
                    종료하기
                  </Button>
                </>
              )}
              {campaign.status === 'active' && (
                <Button
                  size="medium"
                  variant="solid"
                  onClick={() => setEndDialog(true)}
                  disabled={isActionLoading}
                  className="flex-1 bg-[#F04251] hover:bg-[#D93843]"
                >
                  종료하기
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* 불변 필드 - 캠페인 핵심 정보 */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <div className="flex items-center gap-[6px] mb-[12px]">
            <h3 className="text-[16px] font-semibold text-[#191F28]">
              캠페인 핵심 정보
            </h3>
            {campaign.status !== 'draft' && (
              <Badge color="grey" variant="weak" size="small" className="bg-[#F2F4F6] text-[#8B95A1]">
                수정 불가
              </Badge>
            )}
          </div>

          <div className="p-[12px] bg-[#F7F8F9] rounded-[8px] flex flex-col gap-[8px]">
            <InfoRow label="시작일" value={formatDateKorean(campaign.startDate)} />
            <InfoRow label="종료일" value={formatDateKorean(campaign.endDate)} />
            <InfoRow label="목표 일수" value={`${campaign.targetDays}일`} />
            <InfoRow label="인증 방법" value={verificationTypeLabels[campaign.verificationType]} />
            <InfoRow
              label="인증 주기"
              value={
                campaign.verificationConfig.frequency === 'weekly'
                  ? `주 ${campaign.verificationConfig.weeklyTarget}회`
                  : '매일'
              }
            />
            <InfoRow label="달성 기준" value={`${campaign.achievementRate}%`} highlight />
            <InfoRow label="유형" value={campaign.type === 'team' ? '팀' : '개인'} />
          </div>
        </Card>

        {/* 참여 현황 */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-[12px]">
            참여 현황
          </h3>
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="p-[16px] bg-[#F0F0FF] rounded-[12px] text-center">
              <p className="text-[24px] font-bold text-[#5B5CF9]">
                {participantCount}
              </p>
              <p className="text-[12px] text-[#6B7684] mt-[4px]">현재 참여자</p>
            </div>
            <div className="p-[16px] bg-[#F2F4F6] rounded-[12px] text-center">
              <p className="text-[24px] font-bold text-[#191F28]">
                {campaign.maxParticipants ?? '∞'}
              </p>
              <p className="text-[12px] text-[#6B7684] mt-[4px]">최대 인원</p>
            </div>
          </div>
        </Card>

        {/* 리워드 정보 */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <div className="flex items-center gap-[6px] mb-[12px]">
            <h3 className="text-[16px] font-semibold text-[#191F28]">
              리워드 정보
            </h3>
            {campaign.status !== 'draft' && (
              <Badge color="grey" variant="weak" size="small" className="bg-[#F2F4F6] text-[#8B95A1]">
                수정 불가
              </Badge>
            )}
          </div>

          <div className="p-[12px] bg-[#F7F8F9] rounded-[8px] flex flex-col gap-[8px]">
            <InfoRow label="이름" value={campaign.reward.name} />
            <InfoRow label="카테고리" value={campaign.reward.category} />
            {campaign.reward.brand && (
              <InfoRow label="브랜드" value={campaign.reward.brand} />
            )}
            {campaign.reward.description && (
              <InfoRow label="설명" value={campaign.reward.description} />
            )}
          </div>
        </Card>

        {/* 메타 정보 */}
        <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-[12px]">
            메타 정보
          </h3>
          <div className="p-[12px] bg-[#F7F8F9] rounded-[8px] flex flex-col gap-[8px]">
            <InfoRow label="ID" value={campaign.id} />
            <InfoRow label="Featured" value={campaign.isFeatured ? '예' : '아니오'} />
            {campaign.publishedAt && (
              <InfoRow label="발행일" value={campaign.publishedAt} />
            )}
            <InfoRow label="생성일" value={campaign.createdAt} />
            <InfoRow label="수정일" value={campaign.updatedAt} />
          </div>
        </Card>
      </div>

      {/* Publish Dialog */}
      <Dialog
        open={publishDialog}
        title="캠페인을 발행할까요?"
        description="발행 후에는 기간, 인증 방법, 달성 기준, 리워드 등 핵심 정보를 수정할 수 없습니다."
        primaryLabel="발행하기"
        secondaryLabel="취소"
        onPrimaryClick={handlePublish}
        onSecondaryClick={() => setPublishDialog(false)}
        onClose={() => setPublishDialog(false)}
      />

      {/* Unpublish Dialog */}
      <Dialog
        open={unpublishDialog}
        title="발행을 취소할까요?"
        description="참여자가 없는 경우에만 발행 취소가 가능합니다. 초안 상태로 돌아갑니다."
        primaryLabel="발행 취소"
        secondaryLabel="닫기"
        onPrimaryClick={handleUnpublish}
        onSecondaryClick={() => setUnpublishDialog(false)}
        onClose={() => setUnpublishDialog(false)}
      />

      {/* End Dialog */}
      <Dialog
        open={endDialog}
        title="캠페인을 종료할까요?"
        description="종료하면 모든 참여자가 강제 종료되며 되돌릴 수 없습니다."
        primaryLabel="종료하기"
        secondaryLabel="취소"
        onPrimaryClick={handleEnd}
        onSecondaryClick={() => setEndDialog(false)}
        onClose={() => setEndDialog(false)}
      />
    </AppLayout>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px] text-[#6B7684]">{label}</span>
      <span
        className={`text-[14px] font-medium ${highlight ? 'text-[#5B5CF9]' : 'text-[#191F28]'}`}
      >
        {value}
      </span>
    </div>
  );
}
