import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge, Card, AppLayout, Loader } from '../shared/ui';
import { categoryInfo, difficultyConfig, campaignStatusConfig } from '../entities/campaign';
import { getCampaignById } from '../shared/api';
import { formatDateKorean, isFuture } from '../shared/lib/date';
import type { Campaign, VerificationType } from '../shared/types';

const verificationLabels: Record<VerificationType, { label: string; description: string[] }> = {
  time_record: {
    label: '시간 기록',
    description: [
      '정해진 시간에 활동을 기록해주세요.',
      '시작 시간과 종료 시간을 입력하면 자동으로 텀이 계산됩니다.',
    ],
  },
  text_input: {
    label: '텍스트 입력',
    description: [
      '매일 내용을 직접 작성해주세요.',
      '짧은 문장이라도 좋아요. 꾸준함이 중요합니다!',
    ],
  },
  photo_upload: {
    label: '사진 인증',
    description: [
      '활동 인증 사진을 업로드해주세요.',
      '운동 기록 앱 스크린샷이나 활동 사진 모두 가능해요.',
    ],
  },
  counter_input: {
    label: '숫자 입력',
    description: [
      '목표 수치를 달성하면 숫자를 입력해주세요.',
      '건강 앱과 연동하면 더 편리하게 기록할 수 있어요.',
    ],
  },
  simple_check: {
    label: '단순 체크',
    description: [
      '활동을 완료하면 체크 버튼을 눌러주세요.',
      '하루에 한 번, 간단하게 인증하세요!',
    ],
  },
  receipt_record: {
    label: '영수증 기록',
    description: [
      '오늘 사용한 금액을 기록해주세요.',
      '영수증 사진을 함께 올리면 더 정확하게 관리할 수 있어요.',
    ],
  },
};

export function RoutineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routineType = location.state?.routineType || 'individual';

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        if (!id) return;
        const data = await getCampaignById(id);
        setCampaign(data);
      } catch (error) {
        console.error('캠페인 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCampaign();
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
          <p className="text-[14px] text-[#8B95A1] text-center mb-[24px]">
            요청하신 캠페인이 존재하지 않거나<br />삭제되었을 수 있어요.
          </p>
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

  const categoryData = categoryInfo[campaign.category];
  const difficulty = difficultyConfig[campaign.difficulty];
  const verification = verificationLabels[campaign.verificationType];
  const statusConfig = campaignStatusConfig[campaign.status];

  const canJoin =
    (campaign.status === 'published' || campaign.status === 'active') &&
    (!campaign.maxParticipants || campaign.currentParticipants < campaign.maxParticipants);

  const isEnded = campaign.status === 'ended';
  const hasNotStarted = isFuture(campaign.startDate);

  const handleJoin = () => {
    navigate(`/campaign/${campaign.id}/join`, {
      state: { routineType, campaign },
    });
  };

  const typeLabel = routineType === 'team' ? '팀' : '개인';

  const bottomCTA = canJoin ? (
    <Button
      size="large"
      variant="solid"
      onClick={handleJoin}
      className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
    >
      <span className="flex items-center justify-center gap-[8px]">
        이 캠페인 참여하기
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
  ) : null;

  return (
    <AppLayout
      bottomArea={bottomCTA}
      bottomAreaHeight={bottomCTA ? 80 : 0}
      className="bg-[#F2F4F6]"
    >
      {/* Hero Section */}
      <div className="bg-[#333D48] px-[20px] pt-[24px] pb-[32px]">
        {/* Reward Badge */}
        <div className="inline-flex items-center gap-[4px] bg-[#4E5968] rounded-full px-[12px] py-[6px] mb-[16px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1L10.163 5.279L15 6.018L11.5 9.409L12.326 14.218L8 11.972L3.674 14.218L4.5 9.409L1 6.018L5.837 5.279L8 1Z"
              fill="#FFD700"
            />
          </svg>
          <span className="text-[12px] font-medium text-white">
            리워드: {campaign.reward.name}
          </span>
        </div>

        {/* Category & Type & Status Badges */}
        <div className="flex items-center gap-[6px] mb-[8px]">
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
            className="bg-[#5B5CF9] text-white"
          >
            {categoryData.name} 카테고리
          </Badge>
          <Badge
            color="grey"
            variant="weak"
            size="small"
            className="bg-[#4E5968] text-white"
          >
            {typeLabel} 루틴
          </Badge>
        </div>

        {/* Title */}
        <div className="flex items-center gap-[10px] mb-[8px]">
          <span className="text-[28px]">{campaign.emoji}</span>
          <h2 className="text-[24px] font-bold text-white">
            {campaign.title}
          </h2>
        </div>
        <p className="text-[14px] text-[#B0B8C1]">
          {campaign.description}
        </p>
      </div>

      {/* Info Cards */}
      <div className="px-[20px] -mt-[16px]">
        {/* Campaign Period Card */}
        <Card variant="elevated" size="medium" className="mb-[16px]">
          <div className="grid grid-cols-2 gap-[16px] mb-[16px]">
            <div className="flex flex-col">
              <span className="text-[12px] text-[#8B95A1] mb-[4px]">시작일</span>
              <span className="text-[15px] font-semibold text-[#191F28]">
                {formatDateKorean(campaign.startDate)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#8B95A1] mb-[4px]">종료일</span>
              <span className="text-[15px] font-semibold text-[#191F28]">
                {formatDateKorean(campaign.endDate)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="flex flex-col">
              <span className="text-[12px] text-[#8B95A1] mb-[4px]">기간</span>
              <span className="text-[15px] font-semibold text-[#191F28]">
                {campaign.targetDays}일
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#8B95A1] mb-[4px]">난이도</span>
              <span
                className="text-[15px] font-semibold"
                style={{ color: difficulty.color }}
              >
                {difficulty.label}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#8B95A1] mb-[4px]">인증 방법</span>
              <span className="text-[15px] font-semibold text-[#191F28]">
                {verification.label}
              </span>
            </div>
          </div>
        </Card>

        {/* Achievement & Participants */}
        <Card variant="elevated" size="medium" className="mb-[16px]">
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col">
              <span className="text-[12px] text-[#8B95A1] mb-[4px]">달성 기준</span>
              <span className="text-[15px] font-semibold text-[#5B5CF9]">
                {campaign.achievementRate}% 이상
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#8B95A1] mb-[4px]">참여 인원</span>
              <span className="text-[15px] font-semibold text-[#191F28]">
                {campaign.currentParticipants}명
                {campaign.maxParticipants && ` / ${campaign.maxParticipants}명`}
              </span>
            </div>
          </div>
        </Card>

        {/* Verification Method */}
        <Card variant="elevated" size="medium" className="mb-[16px]">
          <div className="flex items-center gap-[8px] mb-[12px]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 18.333A8.333 8.333 0 1010 1.667a8.333 8.333 0 000 16.666z"
                stroke="#5B5CF9"
                strokeWidth="1.5"
              />
              <path
                d="M7.5 10l1.667 1.667L12.5 8.333"
                stroke="#5B5CF9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[15px] font-semibold text-[#191F28]">
              인증 방법: {verification.label}
            </span>
          </div>
          <div className="flex flex-col gap-[12px]">
            {verification.description.map((step, index) => (
              <div key={index} className="flex gap-[8px]">
                <span className="text-[14px] font-medium text-[#5B5CF9]">
                  {index + 1}.
                </span>
                <p className="text-[14px] text-[#4E5968] flex-1">{step}</p>
              </div>
            ))}
          </div>

          {campaign.verificationConfig.frequency === 'weekly' &&
            campaign.verificationConfig.weeklyTarget && (
              <div className="mt-[16px] p-[12px] bg-[#F0F0FF] rounded-[8px]">
                <p className="text-[13px] text-[#5B5CF9] font-medium">
                  주 {campaign.verificationConfig.weeklyTarget}회 인증이 필요해요
                </p>
              </div>
            )}
        </Card>

        {/* Reward Section */}
        <div className="mt-[24px]">
          <p className="text-[12px] text-[#8B95A1] tracking-[2px] mb-[12px]">
            FEATURED_SEASON
          </p>

          <Card variant="elevated" size="medium">
            <div className="flex items-center gap-[6px] mb-[12px]">
              <Badge
                color="grey"
                variant="weak"
                size="small"
                className="bg-[#F0F0FF] text-[#5B5CF9]"
              >
                시즌 파트너
              </Badge>
              {campaign.reward.brand && (
                <Badge color="grey" variant="weak" size="small">
                  {campaign.reward.brand}
                </Badge>
              )}
            </div>

            <div className="w-full h-[160px] bg-[#F2F4F6] rounded-[12px] mb-[16px] flex items-center justify-center">
              <span className="text-[14px] text-[#8B95A1]">
                {campaign.reward.category}
              </span>
            </div>

            <h3 className="text-[17px] font-bold text-[#191F28] mb-[12px]">
              {campaign.reward.name}
            </h3>

            <p className="text-[14px] text-[#6B7684] leading-[1.6]">
              {campaign.reward.description}
            </p>
          </Card>
        </div>

        {/* Notice */}
        <div className="mt-[16px] mb-[24px] flex items-start gap-[8px] px-[4px]">
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
            전체 참여율 {campaign.achievementRate}% 이상 달성 시 리워드가 지급됩니다.
            {isEnded && ' 이 캠페인은 종료되었습니다.'}
            {hasNotStarted && ' 아직 시작 전인 캠페인이에요.'}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
