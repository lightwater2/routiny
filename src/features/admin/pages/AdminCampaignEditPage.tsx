import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Badge, Switch, Card, AppLayout, Loader } from '../../../shared/ui';
import { getCampaignById } from '../../../shared/api';
import { updateCampaign } from '../api/adminCampaigns';
import { campaignStatusConfig } from '../../../entities/campaign';
import { formatDateKorean } from '../../../shared/lib/date';
import type { Campaign, CategoryType, DifficultyLevel } from '../../../shared/types';

const categoryOptions: { value: CategoryType; label: string }[] = [
  { value: 'care', label: '케어' },
  { value: 'health', label: '헬스' },
  { value: 'daily', label: '데일리' },
];

const difficultyOptions: { value: DifficultyLevel; label: string }[] = [
  { value: 'easy', label: '하' },
  { value: 'medium', label: '중' },
  { value: 'hard', label: '상' },
];

const verificationTypeLabels: Record<string, string> = {
  simple_check: '단순 체크',
  text_input: '텍스트 입력',
  photo_upload: '사진 인증',
  counter_input: '숫자 입력',
  time_record: '시간 기록',
  receipt_record: '영수증 기록',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[16px] font-semibold text-[#191F28] mb-[12px]">
      {children}
    </h3>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[13px] font-medium text-[#6B7684] mb-[6px] block">
      {children}
      {required && <span className="text-[#F04452] ml-[2px]">*</span>}
    </label>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[13px] text-[#6B7684]">{label}</span>
      <span className="text-[14px] font-medium text-[#191F28]">{value}</span>
    </div>
  );
}

export function AdminCampaignEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 수정 가능 필드
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');
  const [category, setCategory] = useState<CategoryType>('health');
  const [subCategory, setSubCategory] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        if (!id) return;
        const data = await getCampaignById(id);
        if (data) {
          setCampaign(data);
          setTitle(data.title);
          setDescription(data.description);
          setEmoji(data.emoji);
          setCategory(data.category);
          setSubCategory(data.subCategory || '');
          setDifficulty(data.difficulty);
          setIsFeatured(data.isFeatured);
        }
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

  if (campaign.status === 'ended') {
    navigate(`/admin/campaigns/${campaign.id}`, { replace: true });
    return null;
  }

  const isDraft = campaign.status === 'draft';
  const statusCfg = campaignStatusConfig[campaign.status];

  const isFormValid = title.trim() && description.trim();

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateCampaign(campaign.id, {
        title: title.trim(),
        description: description.trim(),
        emoji,
        category,
        subCategory: subCategory || null,
        difficulty,
        isFeatured,
      });

      navigate(`/admin/campaigns/${campaign.id}`, { replace: true });
    } catch (error) {
      console.error('캠페인 수정 실패:', error);
      alert('캠페인 수정에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bottomCTA = (
    <Button
      size="large"
      variant="solid"
      onClick={handleSubmit}
      disabled={!isFormValid || isSubmitting}
      loading={isSubmitting}
      className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
    >
      수정 완료
    </Button>
  );

  return (
    <AppLayout bottomArea={bottomCTA} bottomAreaHeight={80}>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[24px]">
          <h1 className="text-[24px] font-bold text-[#191F28]">
            캠페인 수정
          </h1>
          <Badge
            color="grey"
            variant="weak"
            size="small"
            style={{ backgroundColor: statusCfg.bgColor, color: statusCfg.color }}
          >
            {statusCfg.label}
          </Badge>
        </div>

        {/* 수정 가능 필드 */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <SectionTitle>수정 가능 항목</SectionTitle>

          <div className="flex flex-col gap-[16px]">
            <div className="flex gap-[12px]">
              <div className="w-[80px]">
                <TextField
                  label="이모지"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  variant="outlined"
                  size="medium"
                />
              </div>
              <div className="flex-1">
                <TextField
                  label="캠페인 이름"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                  size="medium"
                />
              </div>
            </div>

            <div>
              <FieldLabel required>설명</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="
                  w-full p-[14px] rounded-[12px] border border-[#E5E8EB]
                  text-[15px] text-[#191F28] bg-white resize-none
                  focus:outline-none focus:border-[#5B5CF9]
                "
              />
            </div>

            <div className="grid grid-cols-2 gap-[12px]">
              <div>
                <FieldLabel required>카테고리</FieldLabel>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="
                    w-full h-[44px] px-[14px] rounded-[12px] border border-[#E5E8EB]
                    text-[15px] text-[#191F28] bg-white appearance-none cursor-pointer
                    focus:outline-none focus:border-[#5B5CF9]
                  "
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel required>난이도</FieldLabel>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="
                    w-full h-[44px] px-[14px] rounded-[12px] border border-[#E5E8EB]
                    text-[15px] text-[#191F28] bg-white appearance-none cursor-pointer
                    focus:outline-none focus:border-[#5B5CF9]
                  "
                >
                  {difficultyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {category === 'care' && (
              <div>
                <FieldLabel>세부 카테고리</FieldLabel>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="
                    w-full h-[44px] px-[14px] rounded-[12px] border border-[#E5E8EB]
                    text-[15px] text-[#191F28] bg-white appearance-none cursor-pointer
                    focus:outline-none focus:border-[#5B5CF9]
                  "
                >
                  <option value="">없음</option>
                  <option value="baby">육아</option>
                  <option value="pet">반려동물</option>
                  <option value="senior">시니어</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-[8px]">
              <Switch
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span className="text-[14px] text-[#4E5968]">Featured 캠페인</span>
            </div>
          </div>
        </Card>

        {/* 불변 필드 (읽기 전용) */}
        {!isDraft && (
          <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB] bg-[#F7F8F9]">
            <div className="flex items-center gap-[6px] mb-[12px]">
              <SectionTitle>핵심 정보 (수정 불가)</SectionTitle>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path
                  d="M12 5.333H4M12 5.333V12a1.333 1.333 0 01-1.333 1.333H5.333A1.333 1.333 0 014 12V5.333M5.333 5.333V4a2.667 2.667 0 015.334 0v1.333"
                  stroke="#8B95A1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex flex-col gap-[8px]">
              <ReadOnlyRow label="시작일" value={formatDateKorean(campaign.startDate)} />
              <ReadOnlyRow label="종료일" value={formatDateKorean(campaign.endDate)} />
              <ReadOnlyRow label="목표 일수" value={`${campaign.targetDays}일`} />
              <ReadOnlyRow label="인증 방법" value={verificationTypeLabels[campaign.verificationType]} />
              <ReadOnlyRow
                label="인증 주기"
                value={
                  campaign.verificationConfig.frequency === 'weekly'
                    ? `주 ${campaign.verificationConfig.weeklyTarget}회`
                    : '매일'
                }
              />
              <ReadOnlyRow label="달성 기준" value={`${campaign.achievementRate}%`} />
              <ReadOnlyRow label="유형" value={campaign.type === 'team' ? '팀' : '개인'} />
              <ReadOnlyRow label="리워드" value={campaign.reward.name} />
              {campaign.maxParticipants && (
                <ReadOnlyRow label="최대 참여자" value={`${campaign.maxParticipants}명`} />
              )}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
