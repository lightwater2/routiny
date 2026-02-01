import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../shared/api/supabase';
import {
  getDifficultyLabel,
  getCategoryLabel,
  getVerificationTypeLabel,
} from '../shared/lib/format';
import type {
  CategoryType,
  CareSubCategory,
  RoutineType,
  DifficultyLevel,
  VerificationType,
} from '../shared/api/types';

const CATEGORIES: CategoryType[] = ['care', 'health', 'daily'];
const SUB_CATEGORIES: CareSubCategory[] = ['baby', 'pet', 'senior'];
const TYPES: RoutineType[] = ['individual', 'team'];
const DIFFICULTIES: DifficultyLevel[] = ['easy', 'medium', 'hard'];
const VERIFICATION_TYPES: VerificationType[] = [
  'simple_check',
  'text_input',
  'photo_upload',
  'counter_input',
  'time_record',
  'receipt_record',
];

interface TemplateForm {
  name: string;
  title: string;
  description: string;
  emoji: string;
  category: CategoryType;
  sub_category: CareSubCategory | '';
  type: RoutineType;
  difficulty: DifficultyLevel;
  target_days: number;
  verification_type: VerificationType;
  achievement_rate: number;
  reward_name: string;
  reward_description: string;
  reward_image_url: string;
  reward_category: string;
  reward_brand: string;
  max_participants: string;
  is_featured: boolean;
}

const INITIAL_FORM: TemplateForm = {
  name: '',
  title: '',
  description: '',
  emoji: '',
  category: 'daily',
  sub_category: '',
  type: 'individual',
  difficulty: 'medium',
  target_days: 14,
  verification_type: 'simple_check',
  achievement_rate: 80,
  reward_name: '',
  reward_description: '',
  reward_image_url: '',
  reward_category: '',
  reward_brand: '',
  max_participants: '',
  is_featured: false,
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#5B5CF9] focus:ring-1 focus:ring-[#5B5CF9]/30';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function TemplateCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<TemplateForm>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof TemplateForm>(key: K, value: TemplateForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError('템플릿 이름을 입력해주세요.');
    if (!form.title.trim()) return setError('캠페인명을 입력해주세요.');
    if (!form.emoji.trim()) return setError('이모지를 입력해주세요.');
    if (!form.reward_name.trim()) return setError('리워드명을 입력해주세요.');

    setSaving(true);
    const { error: dbError } = await supabase.from('campaign_templates').insert({
      name: form.name.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      emoji: form.emoji.trim(),
      category: form.category,
      sub_category: form.category === 'care' && form.sub_category ? form.sub_category : null,
      type: form.type,
      difficulty: form.difficulty,
      target_days: form.target_days,
      verification_type: form.verification_type,
      verification_config: {},
      achievement_rate: form.achievement_rate,
      reward_name: form.reward_name.trim(),
      reward_description: form.reward_description.trim(),
      reward_image_url: form.reward_image_url.trim() || null,
      reward_category: form.reward_category.trim(),
      reward_brand: form.reward_brand.trim() || null,
      max_participants: form.max_participants ? Number(form.max_participants) : null,
      is_featured: form.is_featured,
    });

    setSaving(false);
    if (dbError) {
      setError(`저장 실패: ${dbError.message}`);
      return;
    }
    navigate('/templates');
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/templates')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          &larr;
        </button>
        <h1 className="text-xl font-bold text-gray-900">새 템플릿 만들기</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 템플릿 이름 */}
        <Section title="템플릿 정보">
          <div>
            <label className={labelClass}>템플릿 이름 (관리용)</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="2월 러닝 캠페인 기본형"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400">관리자가 구분하기 위한 이름입니다.</p>
          </div>
        </Section>

        {/* 기본 정보 */}
        <Section title="기본 정보">
          <div className="flex gap-3">
            <div className="w-20">
              <label className={labelClass}>이모지</label>
              <input
                value={form.emoji}
                onChange={(e) => set('emoji', e.target.value)}
                placeholder="🔥"
                className={`${inputClass} text-center text-lg`}
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>캠페인명</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="매일 아침 물 한 잔"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>설명</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="캠페인에 대한 설명을 입력하세요"
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>카테고리</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value as CategoryType)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{getCategoryLabel(c)}</option>
                ))}
              </select>
            </div>
            {form.category === 'care' && (
              <div>
                <label className={labelClass}>세부 카테고리</label>
                <select
                  value={form.sub_category}
                  onChange={(e) => set('sub_category', e.target.value as CareSubCategory | '')}
                  className={inputClass}
                >
                  <option value="">선택 안 함</option>
                  {SUB_CATEGORIES.map((s) => (
                    <option key={s} value={s}>
                      {s === 'baby' ? '아기' : s === 'pet' ? '반려동물' : '시니어'}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>유형</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as RoutineType)}
                className={inputClass}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t === 'individual' ? '개인' : '팀'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>난이도</label>
              <select
                value={form.difficulty}
                onChange={(e) => set('difficulty', e.target.value as DifficultyLevel)}
                className={inputClass}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{getDifficultyLabel(d)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={form.is_featured}
              onChange={(e) => set('is_featured', e.target.checked)}
              className="h-4 w-4 rounded accent-[#5B5CF9]"
            />
            <label htmlFor="is_featured" className="text-sm text-gray-700">
              Featured (메인에 노출)
            </label>
          </div>
        </Section>

        {/* 기간 & 인증 */}
        <Section title="기간 & 인증 조건">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>기본 목표 일수</label>
              <input
                type="number"
                value={form.target_days}
                onChange={(e) => set('target_days', Number(e.target.value))}
                min={1}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-400">캠페인 생성 시 날짜로 재계산됩니다.</p>
            </div>
            <div>
              <label className={labelClass}>인증 방식</label>
              <select
                value={form.verification_type}
                onChange={(e) => set('verification_type', e.target.value as VerificationType)}
                className={inputClass}
              >
                {VERIFICATION_TYPES.map((v) => (
                  <option key={v} value={v}>{getVerificationTypeLabel(v)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>달성 기준 (%)</label>
              <input
                type="number"
                value={form.achievement_rate}
                onChange={(e) => set('achievement_rate', Number(e.target.value))}
                min={1}
                max={100}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>최대 참여 인원 (비워두면 무제한)</label>
            <input
              type="number"
              value={form.max_participants}
              onChange={(e) => set('max_participants', e.target.value)}
              placeholder="무제한"
              min={1}
              className={inputClass}
            />
          </div>
        </Section>

        {/* 리워드 */}
        <Section title="리워드">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>리워드명</label>
              <input
                value={form.reward_name}
                onChange={(e) => set('reward_name', e.target.value)}
                placeholder="스타벅스 아메리카노"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>리워드 카테고리</label>
              <input
                value={form.reward_category}
                onChange={(e) => set('reward_category', e.target.value)}
                placeholder="커피/음료"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>리워드 설명</label>
            <textarea
              value={form.reward_description}
              onChange={(e) => set('reward_description', e.target.value)}
              rows={2}
              placeholder="리워드에 대한 설명"
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>브랜드 (선택)</label>
              <input
                value={form.reward_brand}
                onChange={(e) => set('reward_brand', e.target.value)}
                placeholder="스타벅스"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>이미지 URL (선택)</label>
              <input
                value={form.reward_image_url}
                onChange={(e) => set('reward_image_url', e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          </div>
        </Section>

        {/* 에러 & 버튼 */}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={() => navigate('/templates')}
            className="rounded-lg px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#5B5CF9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4A4BE8] disabled:opacity-50"
          >
            {saving ? '저장 중...' : '템플릿 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
