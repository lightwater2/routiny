import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Card, AppLayout, Loader } from '../shared/ui';
import { getToday, formatDateWithDay } from '../shared/lib/date';
import { getParticipationById, createCheckIn } from '../shared/api';
import {
  TimeRecordInput,
  TextInput,
  PhotoUpload,
  CounterInput,
  SimpleCheck,
  ReceiptRecordInput,
} from '../features/checkin/ui';
import type { CampaignParticipation, CheckInData } from '../shared/types';

export function CheckInPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [participation, setParticipation] = useState<CampaignParticipation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = getToday();

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

  const handleCheckIn = async (data: CheckInData) => {
    if (!participation || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createCheckIn({
        participationId: participation.id,
        date: today,
        verificationType: participation.campaign.verificationType,
        verificationData: data,
      });

      navigate('/active', { replace: true });
    } catch (error) {
      console.error('체크인 실패:', error);
      alert('체크인에 실패했어요. 다시 시도해주세요.');
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
            루틴을 찾을 수 없어요
          </h2>
        </div>
      </AppLayout>
    );
  }

  const campaign = participation.campaign;

  const renderCheckInInput = () => {
    switch (campaign.verificationType) {
      case 'time_record':
        return (
          <TimeRecordInput
            placeholder={campaign.verificationConfig.placeholder}
            onSubmit={handleCheckIn}
          />
        );

      case 'text_input':
        return (
          <TextInput
            placeholder={campaign.verificationConfig.placeholder}
            onSubmit={handleCheckIn}
          />
        );

      case 'photo_upload':
        return (
          <PhotoUpload
            placeholder={campaign.verificationConfig.placeholder}
            onSubmit={handleCheckIn}
          />
        );

      case 'counter_input':
        return (
          <CounterInput
            config={campaign.verificationConfig}
            onSubmit={handleCheckIn}
          />
        );

      case 'simple_check':
        return (
          <SimpleCheck
            title={campaign.title}
            emoji={campaign.emoji}
            onSubmit={handleCheckIn}
          />
        );

      case 'receipt_record':
        return (
          <ReceiptRecordInput
            config={campaign.verificationConfig}
            onSubmit={handleCheckIn}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="px-[20px] pt-[16px] pb-[24px]">
        {/* Header */}
        <div className="mb-[24px]">
          <Badge
            color="grey"
            variant="weak"
            size="small"
            className="bg-[#F0F0FF] text-[#5B5CF9] mb-[12px]"
          >
            {formatDateWithDay(today)}
          </Badge>

          <div className="flex items-center gap-[10px] mb-[8px]">
            <span className="text-[28px]">{campaign.emoji}</span>
            <h1 className="text-[24px] font-bold text-[#191F28]">
              {campaign.title}
            </h1>
          </div>
          <p className="text-[14px] text-[#8B95A1]">
            오늘의 체크인을 완료해주세요!
          </p>
        </div>

        {/* Progress Info */}
        <Card variant="outlined" size="medium" className="mb-[24px] border-[#E5E8EB]">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
                현재 진행
              </span>
              <span className="text-[16px] font-semibold text-[#191F28]">
                {participation.completedDays} / {campaign.targetDays}일
              </span>
            </div>
            <div className="text-right">
              <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
                달성률
              </span>
              <span className="text-[16px] font-semibold text-[#5B5CF9]">
                {Math.round((participation.completedDays / campaign.targetDays) * 100)}%
              </span>
            </div>
          </div>
        </Card>

        {/* Check-in Input */}
        {renderCheckInInput()}
      </div>
    </AppLayout>
  );
}
