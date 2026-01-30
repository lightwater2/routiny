import { useState } from 'react';
import { Button, Card } from '../../../shared/ui';
import { getCurrentTime } from '../../../shared/lib/date';
import type { TimeRecordData } from '../../../shared/types';

interface TimeRecordInputProps {
  placeholder?: string;
  onSubmit: (data: TimeRecordData) => void;
}

export function TimeRecordInput({ placeholder, onSubmit }: TimeRecordInputProps) {
  const [recordedTime, setRecordedTime] = useState(getCurrentTime());
  const [lastRecordedTime, setLastRecordedTime] = useState<string | null>(null);

  const handleRecordNow = () => {
    const now = getCurrentTime();
    setLastRecordedTime(recordedTime);
    setRecordedTime(now);
  };

  const handleSubmit = () => {
    const intervalMinutes = lastRecordedTime
      ? calculateMinutesDiff(lastRecordedTime, recordedTime)
      : undefined;

    onSubmit({
      type: 'time_record',
      recordedTime,
      intervalMinutes,
    });
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
        <label className="text-[14px] text-[#6B7684] block mb-[12px]">
          {placeholder || '시간 기록'}
        </label>

        <div className="flex items-center gap-[12px]">
          <input
            type="time"
            value={recordedTime}
            onChange={(e) => setRecordedTime(e.target.value)}
            className="
              flex-1 p-[14px] rounded-[12px] border border-[#E5E8EB]
              text-[18px] font-semibold text-[#191F28] text-center
              focus:outline-none focus:border-[#5B5CF9]
            "
          />
          <Button
            size="medium"
            variant="weak"
            color="primary"
            onClick={handleRecordNow}
          >
            지금
          </Button>
        </div>

        {lastRecordedTime && (
          <div className="mt-[16px] p-[12px] bg-[#F7F8F9] rounded-[8px]">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#6B7684]">이전 기록</span>
              <span className="text-[14px] font-medium text-[#191F28]">
                {lastRecordedTime}
              </span>
            </div>
            <div className="flex justify-between items-center mt-[8px]">
              <span className="text-[13px] text-[#6B7684]">간격</span>
              <span className="text-[14px] font-medium text-[#5B5CF9]">
                {calculateMinutesDiff(lastRecordedTime, recordedTime)}분
              </span>
            </div>
          </div>
        )}
      </Card>

      <Button
        size="large"
        variant="solid"
        onClick={handleSubmit}
        className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
      >
        기록 완료
      </Button>
    </div>
  );
}

function calculateMinutesDiff(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  return Math.abs(minutes2 - minutes1);
}
