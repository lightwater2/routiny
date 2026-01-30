import { useState, useRef } from 'react';
import { Button, Card } from '../../../shared/ui';
import type { PhotoUploadData } from '../../../shared/types';

interface PhotoUploadProps {
  placeholder?: string;
  onSubmit: (data: PhotoUploadData) => void;
}

export function PhotoUpload({ placeholder, onSubmit }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!preview) return;
    onSubmit({
      type: 'photo_upload',
      imageUrl: preview,
      caption: caption.trim() || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <Card variant="outlined" size="medium" className="border-[#E5E8EB]">
        <label className="text-[14px] text-[#6B7684] block mb-[12px]">
          {placeholder || '사진을 업로드해주세요'}
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="미리보기"
              className="w-full h-[240px] object-cover rounded-[12px]"
            />
            <button
              onClick={handleRemove}
              className="
                absolute top-[8px] right-[8px]
                w-[32px] h-[32px] rounded-full
                bg-black/50 text-white
                flex items-center justify-center
              "
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={handleClick}
            className="
              w-full h-[200px] rounded-[12px]
              border-2 border-dashed border-[#E5E8EB]
              flex flex-col items-center justify-center gap-[12px]
              hover:border-[#5B5CF9] hover:bg-[#F0F0FF]
              transition-colors
            "
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M42 30V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V30"
                stroke="#8B95A1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M34 16L24 6L14 16"
                stroke="#8B95A1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 6V30"
                stroke="#8B95A1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[14px] text-[#8B95A1]">
              터치하여 사진 선택
            </span>
          </button>
        )}

        {preview && (
          <div className="mt-[16px]">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="한 줄 설명 (선택사항)"
              className="
                w-full p-[14px] rounded-[12px] border border-[#E5E8EB]
                text-[15px] text-[#191F28]
                focus:outline-none focus:border-[#5B5CF9]
                placeholder:text-[#B0B8C1]
              "
            />
          </div>
        )}
      </Card>

      <Button
        size="large"
        variant="solid"
        onClick={handleSubmit}
        disabled={!preview}
        className="w-full bg-[#5B5CF9] hover:bg-[#4A4BE8]"
      >
        인증 완료
      </Button>
    </div>
  );
}
