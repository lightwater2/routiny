import type { CategoryType, DifficultyLevel, CampaignStatus } from '../../../shared/types';

// 카테고리 정보
export const categoryInfo: Record<CategoryType, { name: string; emoji: string; title: string; subtitle: string }> = {
  care: {
    name: '케어',
    emoji: '💝',
    title: '소중한 이들을 위한 케어,',
    subtitle: '도전하고 리워드 받으세요!',
  },
  health: {
    name: '헬스',
    emoji: '💪',
    title: '활력 넘치는 건강 습관,',
    subtitle: '도전하고 리워드 받으세요!',
  },
  daily: {
    name: '데일리',
    emoji: '✨',
    title: '특별한 일상을 만드는 습관,',
    subtitle: '도전하고 리워드 받으세요!',
  },
};

// 난이도 설정
export const difficultyConfig: Record<
  DifficultyLevel,
  { label: string; color: string; bgColor: string }
> = {
  easy: { label: '난이도 하', color: '#00C853', bgColor: '#E8F5E9' },
  medium: { label: '난이도 중', color: '#FF9100', bgColor: '#FFF3E0' },
  hard: { label: '난이도 상', color: '#F04251', bgColor: '#FFEBEE' },
};

// 캠페인 상태 설정
export const campaignStatusConfig: Record<
  CampaignStatus,
  { label: string; color: string; bgColor: string }
> = {
  draft: { label: '초안', color: '#8B95A1', bgColor: '#F2F4F6' },
  published: { label: '모집중', color: '#5B5CF9', bgColor: '#F0F0FF' },
  active: { label: '진행중', color: '#15C67F', bgColor: '#E8F8F0' },
  ended: { label: '종료', color: '#8B95A1', bgColor: '#F2F4F6' },
};
