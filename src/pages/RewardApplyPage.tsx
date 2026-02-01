import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, TextField, AppLayout, Loader } from '../shared/ui';
import { getParticipationById, applyReward } from '../shared/api';
import type { CampaignParticipation, ShippingInfo } from '../shared/types';

export function RewardApplyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participation, setParticipation] = useState<CampaignParticipation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    address: '',
    addressDetail: '',
    zipCode: '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;
        const data = await getParticipationById(id);
        setParticipation(data);
      } catch (error) {
        console.error('참여 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!participation || isSubmitting) return;

    const { name, phone, address, zipCode } = shippingInfo;
    if (!name || !phone || !address || !zipCode) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await applyReward({
        participationId: participation.id,
        shippingInfo,
      });

      navigate(`/reward/${id}`, { replace: true });
    } catch (error) {
      console.error('리워드 신청 실패:', error);
      alert('리워드 신청에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        </div>
      </AppLayout>
    );
  }

  const campaign = participation.campaign;

  const isValid =
    shippingInfo.name.trim() &&
    shippingInfo.phone.trim() &&
    shippingInfo.address.trim() &&
    shippingInfo.zipCode.trim();

  return (
    <AppLayout>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="mb-[24px]">
          <h1 className="text-[24px] font-bold text-[#191F28] mb-[8px]">
            리워드 신청
          </h1>
          <p className="text-[14px] text-[#8B95A1]">
            배송받으실 정보를 입력해주세요
          </p>
        </div>

        {/* Reward Preview */}
        <Card variant="outlined" size="medium" className="mb-[24px] border-[#E5E8EB]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[64px] h-[64px] rounded-[12px] bg-[#F2F4F6] flex items-center justify-center shrink-0">
              <span className="text-[10px] text-[#5B5CF9] font-medium text-center">
                {campaign.reward.category}
              </span>
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-[#191F28]">
                {campaign.reward.name}
              </h3>
              <p className="text-[13px] text-[#8B95A1]">
                {campaign.title} 달성 리워드
              </p>
            </div>
          </div>
        </Card>

        {/* Shipping Form */}
        <div className="flex flex-col gap-[16px]">
          <div>
            <label className="text-[14px] text-[#6B7684] block mb-[8px]">
              수령인 이름 <span className="text-[#F04251]">*</span>
            </label>
            <TextField
              value={shippingInfo.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div>
            <label className="text-[14px] text-[#6B7684] block mb-[8px]">
              연락처 <span className="text-[#F04251]">*</span>
            </label>
            <TextField
              type="tel"
              value={shippingInfo.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="text-[14px] text-[#6B7684] block mb-[8px]">
              우편번호 <span className="text-[#F04251]">*</span>
            </label>
            <TextField
              value={shippingInfo.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              placeholder="우편번호를 입력하세요"
            />
          </div>

          <div>
            <label className="text-[14px] text-[#6B7684] block mb-[8px]">
              주소 <span className="text-[#F04251]">*</span>
            </label>
            <TextField
              value={shippingInfo.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="주소를 입력하세요"
            />
          </div>

          <div>
            <label className="text-[14px] text-[#6B7684] block mb-[8px]">
              상세주소
            </label>
            <TextField
              value={shippingInfo.addressDetail}
              onChange={(e) => handleChange('addressDetail', e.target.value)}
              placeholder="상세주소를 입력하세요 (선택)"
            />
          </div>
        </div>

        {/* Notice */}
        <div className="mt-[24px] p-[16px] bg-[#F7F8F9] rounded-[12px]">
          <h4 className="text-[14px] font-semibold text-[#191F28] mb-[8px]">
            배송 안내
          </h4>
          <ul className="text-[13px] text-[#6B7684] space-y-[4px]">
            <li>- 신청 후 영업일 기준 3~5일 내 발송됩니다.</li>
            <li>- 배송 시작 시 알림을 보내드려요.</li>
            <li>- 배송지 변경은 발송 전까지 가능해요.</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="mt-[24px]">
          <Button
            size="large"
            variant="solid"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
          >
            신청 완료
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
