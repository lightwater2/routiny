import { useState } from 'react';
import { Button, Card } from '../../../shared/ui';
import type { TextInputData } from '../../../shared/types';

interface TextInputProps {
  placeholder?: string;
  onSubmit: (data: TextInputData) => void;
}

export function TextInput({ placeholder, onSubmit }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({
      type: 'text_input',
      text: text.trim(),
    });
  };

  const isValid = text.trim().length > 0;

  return (
    <div className="flex flex-col gap-[16px]">
      <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
        <label className="text-[14px] text-[#6B7684] block mb-[12px]">
          {placeholder || '내용을 입력해주세요'}
        </label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 입력하세요..."
          rows={5}
          className="
            w-full p-[14px] rounded-[12px] border border-[#E5E8EB]
            text-[15px] text-[#191F28] resize-none
            focus:outline-none focus:border-[#5B5CF9]
            placeholder:text-[#B0B8C1]
          "
        />

        <div className="mt-[8px] text-right">
          <span className="text-[12px] text-[#8B95A1]">
            {text.length}자
          </span>
        </div>
      </Card>

      <Button
        size="large"
        variant="solid"
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
      >
        작성 완료
      </Button>
    </div>
  );
}
