import { useState, useRef } from 'react';
import { Button, Card } from '../../../shared/ui';
import type { ReceiptRecordData, VerificationConfig } from '../../../shared/types';

interface ReceiptRecordInputProps {
  config: VerificationConfig;
  onSubmit: (data: ReceiptRecordData) => void;
}

export function ReceiptRecordInput({ config, onSubmit }: ReceiptRecordInputProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxValue = config.maxValue || 10000;
  const unit = config.unit || '원';

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setAmount(newValue);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount)) return;

    onSubmit({
      type: 'receipt_record',
      amount: numAmount,
      description: description.trim() || undefined,
      imageUrl: imageUrl || undefined,
    });
  };

  const numAmount = parseInt(amount, 10) || 0;
  const isValid = numAmount > 0;
  const isWithinLimit = numAmount <= maxValue;
  const remaining = maxValue - numAmount;

  return (
    <div className="flex flex-col gap-[16px]">
      <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
        <label className="text-[14px] text-[#6B7684] block mb-[12px]">
          {config.placeholder || '오늘 사용한 금액'}
        </label>

        <div className="flex items-center gap-[8px]">
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            className="
              flex-1 p-[14px] rounded-[12px] border border-[#E5E8EB]
              text-[24px] font-bold text-[#191F28] text-right
              focus:outline-none focus:border-[#5B5CF9]
              placeholder:text-[#B0B8C1]
            "
          />
          <span className="text-[18px] font-semibold text-[#6B7684]">
            {unit}
          </span>
        </div>

        {/* Limit Status */}
        <div className={`mt-[16px] p-[12px] rounded-[8px] ${
          isWithinLimit ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-[#6B7684]">일일 한도</span>
            <span className="text-[14px] font-medium text-[#191F28]">
              {maxValue.toLocaleString()}{unit}
            </span>
          </div>
          <div className="flex justify-between items-center mt-[8px]">
            <span className="text-[13px] text-[#6B7684]">
              {isWithinLimit ? '남은 금액' : '초과 금액'}
            </span>
            <span className={`text-[14px] font-semibold ${
              isWithinLimit ? 'text-[#15C67F]' : 'text-[#F04251]'
            }`}>
              {Math.abs(remaining).toLocaleString()}{unit}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-[16px]">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="사용 내역 (선택사항)"
            className="
              w-full p-[14px] rounded-[12px] border border-[#E5E8EB]
              text-[15px] text-[#191F28]
              focus:outline-none focus:border-[#5B5CF9]
              placeholder:text-[#B0B8C1]
            "
          />
        </div>

        {/* Receipt Image */}
        <div className="mt-[16px]">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt="영수증"
                className="w-full h-[120px] object-cover rounded-[12px]"
              />
              <button
                onClick={() => {
                  setImageUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="
                  absolute top-[8px] right-[8px]
                  w-[28px] h-[28px] rounded-full
                  bg-black/50 text-white
                  flex items-center justify-center
                "
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 3L11 11M11 3L3 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="
                w-full py-[12px] rounded-[12px]
                border border-dashed border-[#E5E8EB]
                flex items-center justify-center gap-[8px]
                text-[14px] text-[#8B95A1]
                hover:border-[#5B5CF9] hover:bg-[#F0F0FF]
                transition-colors
              "
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.1667 6.66667L10 2.5L5.83333 6.66667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 2.5V12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              영수증 사진 첨부 (선택)
            </button>
          )}
        </div>
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

      {!isWithinLimit && (
        <p className="text-[13px] text-[#F04251] text-center">
          오늘은 한도를 초과했어요. 내일 다시 도전해보세요!
        </p>
      )}
    </div>
  );
}
