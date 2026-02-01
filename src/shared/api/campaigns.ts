import { supabase } from './supabase';
import type { Campaign, CategoryType, RoutineType } from '../types';
import type { DbCampaign } from './types';

/**
 * DB 행을 프론트엔드 Campaign 타입으로 변환
 */
function toCampaign(row: DbCampaign): Campaign {
  return {
    id: row.id,
    startDate: row.start_date,
    endDate: row.end_date,
    targetDays: row.target_days,
    verificationType: row.verification_type,
    verificationConfig: row.verification_config,
    achievementRate: row.achievement_rate,
    reward: {
      name: row.reward_name,
      description: row.reward_description,
      imageUrl: row.reward_image_url || '',
      category: row.reward_category,
      brand: row.reward_brand ?? undefined,
    },
    type: row.type,
    title: row.title,
    description: row.description,
    category: row.category,
    subCategory: row.sub_category ?? undefined,
    difficulty: row.difficulty,
    emoji: row.emoji,
    status: row.status,
    maxParticipants: row.max_participants ?? undefined,
    currentParticipants: row.current_participants,
    isFeatured: row.is_featured,
    publishedAt: row.published_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * published/active 캠페인 목록 조회
 */
export async function getActiveCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .in('status', ['published', 'active'])
    .order('is_featured', { ascending: false })
    .order('start_date', { ascending: true });

  if (error) throw new Error(`캠페인 조회 실패: ${error.message}`);

  return (data as DbCampaign[]).map(toCampaign);
}

/**
 * 카테고리/타입별 캠페인 조회
 */
export async function getCampaignsByCategory(
  category: CategoryType,
  type?: RoutineType
): Promise<Campaign[]> {
  let query = supabase
    .from('campaigns')
    .select('*')
    .in('status', ['published', 'active'])
    .eq('category', category);

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query
    .order('is_featured', { ascending: false })
    .order('start_date', { ascending: true });

  if (error) throw new Error(`캠페인 조회 실패: ${error.message}`);

  return (data as DbCampaign[]).map(toCampaign);
}

/**
 * ID로 캠페인 단건 조회
 */
export async function getCampaignById(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return toCampaign(data as DbCampaign);
}

export { toCampaign };
