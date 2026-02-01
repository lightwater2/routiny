import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Switch, Card, AppLayout } from '../../../shared/ui';
import { createCampaign } from '../api/adminCampaigns';
import type {
  CategoryType,
  RoutineType,
  DifficultyLevel,
  VerificationType,
  VerificationConfig,
} from '../../../shared/types';

const categoryOptions: { value: CategoryType; label: string }[] = [
  { value: 'care', label: '케어' },
  { value: 'health', label: '헬스' },
  { value: 'daily', label: '데일리' },
];

const typeOptions: { value: RoutineType; label: string }[] = [
  { value: 'individual', label: '개인' },
  { value: 'team', label: '팀' },
];

const difficultyOptions: { value: DifficultyLevel; label: string }[] = [
  { value: 'easy', label: '하' },
  { value: 'medium', label: '중' },
  { value: 'hard', label: '상' },
];

const verificationOptions: { value: VerificationType; label: string }[] = [
  { value: 'simple_check', label: '단순 체크' },
  { value: 'text_input', label: '텍스트 입력' },
  { value: 'photo_upload', label: '사진 인증' },
  { value: 'counter_input', label: '숫자 입력' },
  { value: 'time_record', label: '시간 기록' },
  { value: 'receipt_record', label: '영수증 기록' },
];

const frequencyOptions: { value: 'daily' | 'weekly'; label: string }[] = [
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '주간' },
];

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

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full h-[44px] px-[14px] rounded-[12px] border border-[#E5E8EB]
        text-[15px] text-[#191F28] bg-white appearance-none cursor-pointer
        focus:outline-none focus:border-[#5B5CF9]
      "
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function AdminCampaignCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기본 정보
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [category, setCategory] = useState<CategoryType>('health');
  const [subCategory, setSubCategory] = useState('');
  const [type, setType] = useState<RoutineType>('individual');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isFeatured, setIsFeatured] = useState(false);

  // 기간
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetDays, setTargetDays] = useState('');

  // 인증
  const [verificationType, setVerificationType] = useState<VerificationType>('simple_check');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [weeklyTarget, setWeeklyTarget] = useState('3');
  const [placeholder, setPlaceholder] = useState('');
  const [unit, setUnit] = useState('');

  // 달성
  const [achievementRate, setAchievementRate] = useState('80');
  const [maxParticipants, setMaxParticipants] = useState('');

  // 리워드
  const [rewardName, setRewardName] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardCategory, setRewardCategory] = useState('');
  const [rewardBrand, setRewardBrand] = useState('');

  const isFormValid =
    title.trim() &&
    description.trim() &&
    startDate &&
    endDate &&
    targetDays &&
    achievementRate &&
    rewardName.trim() &&
    rewardCategory.trim();

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const verificationConfig: VerificationConfig = {
        frequency,
        ...(frequency === 'weekly' && { weeklyTarget: Number(weeklyTarget) }),
        ...(placeholder && { placeholder }),
        ...(unit && { unit }),
      };

      const campaign = await createCampaign({
        title: title.trim(),
        description: description.trim(),
        category,
        subCategory: subCategory || undefined,
        type,
        difficulty,
        emoji,
        startDate,
        endDate,
        targetDays: Number(targetDays),
        verificationType,
        verificationConfig,
        achievementRate: Number(achievementRate),
        rewardName: rewardName.trim(),
        rewardDescription: rewardDescription.trim(),
        rewardCategory: rewardCategory.trim(),
        rewardBrand: rewardBrand.trim() || undefined,
        maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
        isFeatured,
      });

      navigate(`/admin/campaigns/${campaign.id}`, { replace: true });
    } catch (error) {
      console.error('캠페인 생성 실패:', error);
      alert('캠페인 생성에 실패했어요. 다시 시도해주세요.');
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
      캠페인 초안 생성
    </Button>
  );

  return (
    <AppLayout bottomArea={bottomCTA} bottomAreaHeight={80}>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        <h1 className="text-[24px] font-bold text-[#191F28] mb-[24px]">
          새 캠페인 만들기
        </h1>

        {/* 기본 정보 */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <SectionTitle>기본 정보</SectionTitle>

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
                  placeholder="예: 매일 아침 6시 기상하기"
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
                placeholder="캠페인 설명을 입력해주세요"
                rows={3}
                className="
                  w-full p-[14px] rounded-[12px] border border-[#E5E8EB]
                  text-[15px] text-[#191F28] bg-white resize-none
                  focus:outline-none focus:border-[#5B5CF9]
                  placeholder:text-[#B0B8C1]
                "
              />
            </div>

            <div className="grid grid-cols-2 gap-[12px]">
              <div>
                <FieldLabel required>카테고리</FieldLabel>
                <SelectField
                  value={category}
                  onChange={(v) => setCategory(v as CategoryType)}
                  options={categoryOptions}
                />
              </div>
              <div>
                <FieldLabel required>유형</FieldLabel>
                <SelectField
                  value={type}
                  onChange={(v) => setType(v as RoutineType)}
                  options={typeOptions}
                />
              </div>
            </div>

            {category === 'care' && (
              <div>
                <FieldLabel>세부 카테고리</FieldLabel>
                <SelectField
                  value={subCategory}
                  onChange={setSubCategory}
                  options={[
                    { value: '', label: '없음' },
                    { value: 'baby', label: '육아' },
                    { value: 'pet', label: '반려동물' },
                    { value: 'senior', label: '시니어' },
                  ]}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-[12px]">
              <div>
                <FieldLabel required>난이도</FieldLabel>
                <SelectField
                  value={difficulty}
                  onChange={(v) => setDifficulty(v as DifficultyLevel)}
                  options={difficultyOptions}
                />
              </div>
              <div className="flex items-end pb-[2px]">
                <div className="flex items-center gap-[8px]">
                  <Switch
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span className="text-[14px] text-[#4E5968]">Featured</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 기간 설정 */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <SectionTitle>기간 설정</SectionTitle>

          <div className="flex flex-col gap-[16px]">
            <div className="grid grid-cols-2 gap-[12px]">
              <div>
                <FieldLabel required>시작일</FieldLabel>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="
                    w-full h-[44px] px-[14px] rounded-[12px] border border-[#E5E8EB]
                    text-[15px] text-[#191F28] bg-white
                    focus:outline-none focus:border-[#5B5CF9]
                  "
                />
              </div>
              <div>
                <FieldLabel required>종료일</FieldLabel>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="
                    w-full h-[44px] px-[14px] rounded-[12px] border border-[#E5E8EB]
                    text-[15px] text-[#191F28] bg-white
                    focus:outline-none focus:border-[#5B5CF9]
                  "
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[12px]">
              <TextField
                label="목표 일수"
                value={targetDays}
                onChange={(e) => setTargetDays(e.target.value)}
                placeholder="예: 30"
                type="number"
                variant="outlined"
                size="medium"
              />
              <TextField
                label="최대 참여자 수"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="미입력 시 무제한"
                type="number"
                variant="outlined"
                size="medium"
              />
            </div>
          </div>
        </Card>

        {/* 인증 설정 */}
        <Card variant="outlined" size="medium" className="mb-[16px] border-[#E5E8EB]">
          <SectionTitle>인증 설정</SectionTitle>

          <div className="flex flex-col gap-[16px]">
            <div>
              <FieldLabel required>인증 방법</FieldLabel>
              <SelectField
                value={verificationType}
                onChange={(v) => setVerificationType(v as VerificationType)}
                options={verificationOptions}
              />
            </div>

            <div>
              <FieldLabel required>인증 주기</FieldLabel>
              <SelectField
                value={frequency}
                onChange={(v) => setFrequency(v as 'daily' | 'weekly')}
                options={frequencyOptions}
              />
            </div>

            {frequency === 'weekly' && (
              <TextField
                label="주간 목표 횟수"
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(e.target.value)}
                placeholder="예: 3"
                type="number"
                variant="outlined"
                size="medium"
              />
            )}

            {(verificationType === 'text_input' ||
              verificationType === 'counter_input' ||
              verificationType === 'receipt_record') && (
              <div className="grid grid-cols-2 gap-[12px]">
                <TextField
                  label="플레이스홀더"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="입력 안내 문구"
                  variant="outlined"
                  size="medium"
                />
                <TextField
                  label="단위"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="예: 보, 원, 분"
                  variant="outlined"
                  size="medium"
                />
              </div>
            )}

            <TextField
              label="달성 기준 (%)"
              value={achievementRate}
              onChange={(e) => setAchievementRate(e.target.value)}
              placeholder="80"
              type="number"
              variant="outlined"
              size="medium"
            />
          </div>
        </Card>

        {/* 리워드 설정 */}
        <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
          <SectionTitle>리워드 설정</SectionTitle>

          <div className="flex flex-col gap-[16px]">
            <TextField
              label="리워드 이름"
              value={rewardName}
              onChange={(e) => setRewardName(e.target.value)}
              placeholder="예: 스타벅스 아메리카노"
              variant="outlined"
              size="medium"
            />
            <div>
              <FieldLabel>리워드 설명</FieldLabel>
              <textarea
                value={rewardDescription}
                onChange={(e) => setRewardDescription(e.target.value)}
                placeholder="리워드 상세 설명"
                rows={2}
                className="
                  w-full p-[14px] rounded-[12px] border border-[#E5E8EB]
                  text-[15px] text-[#191F28] bg-white resize-none
                  focus:outline-none focus:border-[#5B5CF9]
                  placeholder:text-[#B0B8C1]
                "
              />
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
              <TextField
                label="리워드 카테고리"
                value={rewardCategory}
                onChange={(e) => setRewardCategory(e.target.value)}
                placeholder="예: 카페/음료"
                variant="outlined"
                size="medium"
              />
              <TextField
                label="브랜드"
                value={rewardBrand}
                onChange={(e) => setRewardBrand(e.target.value)}
                placeholder="예: 스타벅스"
                variant="outlined"
                size="medium"
              />
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
