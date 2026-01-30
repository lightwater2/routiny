import { useState } from 'react';
import { Button, Card } from '../../../shared/ui';
import type { CounterInputData, VerificationConfig } from '../../../shared/types';

interface CounterInputProps {
  config: VerificationConfig;
  onSubmit: (data: CounterInputData) => void;
}

export function CounterInput({ config, onSubmit }: CounterInputProps) {
  const [value, setValue] = useState('');
  const unit = config.unit || '';
  const minValue = config.minValue || 0;
  const maxValue = config.maxValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setValue(newValue);
  };

  const handleSubmit = () => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    onSubmit({
      type: 'counter_input',
      value: numValue,
      unit,
    });
  };

  const numValue = parseInt(value, 10) || 0;
  const isValid = !isNaN(numValue) && numValue >= minValue;
  const isAboveTarget = numValue >= minValue;

  return (
    <div className="flex flex-col gap-[16px]">
      <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
        <label className="text-[14px] text-[#6B7684] block mb-[12px]">
          {config.placeholder || `${unit} 입력`}
        </label>

        <div className="flex items-center gap-[8px]">
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            placeholder="0"
            className="
              flex-1 p-[14px] rounded-[12px] border border-[#E5E8EB]
              text-[24px] font-bold text-[#191F28] text-center
              focus:outline-none focus:border-[#5B5CF9]
              placeholder:text-[#B0B8C1]
            "
          />
          <span className="text-[18px] font-semibold text-[#6B7684] min-w-[48px]">
            {unit}
          </span>
        </div>

        {/* Progress Indicator */}
        {minValue > 0 && (
          <div className="mt-[16px]">
            <div className="flex justify-between items-center mb-[8px]">
              <span className="text-[13px] text-[#6B7684]">
                목표: {minValue.toLocaleString()}{unit}
              </span>
              <span
                className={`text-[14px] font-semibold ${
                  isAboveTarget ? 'text-[#15C67F]' : 'text-[#8B95A1]'
                }`}
              >
                {isAboveTarget ? '목표 달성!' : `${(numValue - minValue).toLocaleString()}${unit} 부족`}
              </span>
            </div>
            <div className="h-[8px] bg-[#E5E8EB] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isAboveTarget ? 'bg-[#15C67F]' : 'bg-[#5B5CF9]'
                }`}
                style={{ width: `${Math.min(100, (numValue / minValue) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {maxValue && (
          <p className="mt-[12px] text-[13px] text-[#8B95A1]">
            최대 {maxValue.toLocaleString()}{unit}까지 입력 가능
          </p>
        )}
      </Card>

      <Button
        size="large"
        variant="solid"
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
      >
        기록 완료
      </Button>
    </div>
  );
}
