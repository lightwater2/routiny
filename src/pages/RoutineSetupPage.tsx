import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Badge, Switch, AppLayout, Loader } from '../shared/ui';
import { categoryInfo } from '../entities/campaign';
import { formatDateKorean } from '../shared/lib/date';
import { joinCampaign, getCampaignById } from '../shared/api';
import type { Campaign } from '../shared/types';

const timeOptions = [
  '06:00', '07:00', '08:00', '09:00', '10:00',
  '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00',
];

export function RoutineSetupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routineType = location.state?.routineType || 'individual';

  const [campaign, setCampaign] = useState<Campaign | null>(location.state?.campaign || null);
  const [isLoading, setIsLoading] = useState(!campaign);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (campaign) return;
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
  }, [id, campaign]);

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

  const handleJoin = async () => {
    if (isJoining) return;
    setIsJoining(true);

    try {
      await joinCampaign({
        campaignId: campaign.id,
        notificationEnabled,
        notificationTime: notificationEnabled ? notificationTime : undefined,
      });

      navigate('/active', { replace: true });
    } catch (error) {
      console.error('캠페인 참여 실패:', error);
      alert('캠페인 참여에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsJoining(false);
    }
  };

  const typeLabel = routineType === 'team' ? '팀' : '개인';

  const bottomCTA = (
    <Button
      size="large"
      variant="solid"
      onClick={handleJoin}
      disabled={isJoining}
      loading={isJoining}
      className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
    >
      <span className="flex items-center justify-center gap-[8px]">
        캠페인 참여하기
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
  );

  return (
    <AppLayout bottomArea={bottomCTA} bottomAreaHeight={80}>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="mb-[24px]">
          <div className="flex items-center gap-[6px] mb-[12px]">
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
              className="bg-[#F2F4F6] text-[#6B7684]"
            >
              {typeLabel} 루틴
            </Badge>
          </div>

          <div className="flex items-center gap-[10px] mb-[8px]">
            <span className="text-[28px]">{campaign.emoji}</span>
            <h1 className="text-[24px] font-bold text-[#191F28]">
              {campaign.title}
            </h1>
          </div>
          <p className="text-[14px] text-[#8B95A1]">
            캠페인 정보를 확인하고 참여해주세요.
          </p>
        </div>

        {/* Campaign Info (읽기 전용) */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-[16px]">
            캠페인 정보
          </h3>

          <div className="p-[12px] bg-[#F7F8F9] rounded-[8px]">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#6B7684]">시작일</span>
              <span className="text-[14px] font-medium text-[#191F28]">
                {formatDateKorean(campaign.startDate)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-[8px]">
              <span className="text-[13px] text-[#6B7684]">종료일</span>
              <span className="text-[14px] font-medium text-[#191F28]">
                {formatDateKorean(campaign.endDate)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-[8px]">
              <span className="text-[13px] text-[#6B7684]">기간</span>
              <span className="text-[14px] font-medium text-[#191F28]">
                {campaign.targetDays}일
              </span>
            </div>
            <div className="flex justify-between items-center mt-[8px]">
              <span className="text-[13px] text-[#6B7684]">달성 기준</span>
              <span className="text-[14px] font-medium text-[#5B5CF9]">
                {campaign.achievementRate}% 이상
              </span>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <div className="flex items-center justify-between mb-[16px]">
            <div>
              <h3 className="text-[16px] font-semibold text-[#191F28]">
                알림 설정
              </h3>
              <p className="text-[13px] text-[#8B95A1] mt-[4px]">
                매일 정해진 시간에 알림을 받아보세요
              </p>
            </div>
            <Switch
              checked={notificationEnabled}
              onChange={(e) => setNotificationEnabled(e.target.checked)}
            />
          </div>

          {notificationEnabled && (
            <div className="pt-[16px] border-t border-[#E5E8EB]">
              <label className="text-[14px] text-[#6B7684] block mb-[12px]">
                알림 시간
              </label>
              <div className="relative">
                <select
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  className="
                    w-full p-[14px] rounded-[12px] border border-[#E5E8EB]
                    text-[15px] text-[#191F28] bg-white
                    appearance-none cursor-pointer
                    focus:outline-none focus:border-[#5B5CF9]
                  "
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="#8B95A1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </Card>

        {/* Reward Preview */}
        <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
          <div className="flex items-center gap-[8px] mb-[12px]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 1L12.704 6.56L18.776 7.46L14.388 11.72L15.408 17.764L10 14.88L4.592 17.764L5.612 11.72L1.224 7.46L7.296 6.56L10 1Z"
                fill="#FFD700"
              />
            </svg>
            <h3 className="text-[16px] font-semibold text-[#191F28]">
              달성 리워드
            </h3>
          </div>

          <div className="flex items-center gap-[16px]">
            <div className="w-[64px] h-[64px] rounded-[12px] bg-[#F2F4F6] flex items-center justify-center shrink-0">
              <span className="text-[10px] text-[#5B5CF9] font-medium text-center">
                {campaign.reward.category}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-[15px] font-semibold text-[#191F28] mb-[4px]">
                {campaign.reward.name}
              </h4>
              <p className="text-[13px] text-[#8B95A1] line-clamp-2">
                {campaign.achievementRate}% 이상 달성 시 지급
              </p>
            </div>
          </div>
        </Card>

        {/* Info Notice */}
        <div className="mt-[16px] flex items-start gap-[8px] px-[4px]">
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
            캠페인에 참여하면 매일 체크인을 진행할 수 있어요.
            {campaign.verificationConfig.frequency === 'weekly'
              ? ` 주 ${campaign.verificationConfig.weeklyTarget}회 인증이 필요해요.`
              : ' 매일 인증이 필요해요.'}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
