import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Card, AppLayout, Loader } from '../shared/ui';
import { getToday, formatDateWithDay } from '../shared/lib/date';
import { getUserRoutineById, createCheckIn } from '../shared/api';
import {
  TimeRecordInput,
  TextInput,
  PhotoUpload,
  CounterInput,
  SimpleCheck,
  ReceiptRecordInput,
} from '../features/checkin/ui';
import type { UserRoutine, CheckInData } from '../shared/types';

export function CheckInPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userRoutine, setUserRoutine] = useState<UserRoutine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = getToday();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;
        const routine = await getUserRoutineById(id);
        setUserRoutine(routine);
      } catch (error) {
        console.error('루틴 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleCheckIn = async (data: CheckInData) => {
    if (!userRoutine || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createCheckIn({
        userRoutineId: userRoutine.id,
        date: today,
        verificationType: userRoutine.template.verificationType,
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

  if (!userRoutine) {
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

  const template = userRoutine.template;

  const renderCheckInInput = () => {
    switch (template.verificationType) {
      case 'time_record':
        return (
          <TimeRecordInput
            placeholder={template.verificationConfig.placeholder}
            onSubmit={handleCheckIn}
          />
        );

      case 'text_input':
        return (
          <TextInput
            placeholder={template.verificationConfig.placeholder}
            onSubmit={handleCheckIn}
          />
        );

      case 'photo_upload':
        return (
          <PhotoUpload
            placeholder={template.verificationConfig.placeholder}
            onSubmit={handleCheckIn}
          />
        );

      case 'counter_input':
        return (
          <CounterInput
            config={template.verificationConfig}
            onSubmit={handleCheckIn}
          />
        );

      case 'simple_check':
        return (
          <SimpleCheck
            title={template.title}
            emoji={template.emoji}
            onSubmit={handleCheckIn}
          />
        );

      case 'receipt_record':
        return (
          <ReceiptRecordInput
            config={template.verificationConfig}
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
            <span className="text-[28px]">{template.emoji}</span>
            <h1 className="text-[24px] font-bold text-[#191F28]">
              {template.title}
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
                {userRoutine.completedDays} / {userRoutine.targetDays}일
              </span>
            </div>
            <div className="text-right">
              <span className="text-[12px] text-[#8B95A1] block mb-[4px]">
                달성률
              </span>
              <span className="text-[16px] font-semibold text-[#5B5CF9]">
                {Math.round((userRoutine.completedDays / userRoutine.targetDays) * 100)}%
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
