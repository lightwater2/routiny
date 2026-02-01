import { supabase } from '../../../shared/api/supabase';
import { toCampaign } from '../../../shared/api/campaigns';
import type {
  Campaign,
  CampaignStatus,
  CategoryType,
  RoutineType,
  DifficultyLevel,
  VerificationType,
  VerificationConfig,
} from '../../../shared/types';
import type { DbCampaign } from '../../../shared/api/types';

// =============================================
// 어드민 캠페인 관리 API
// =============================================

export interface CreateCampaignParams {
  title: string;
  description: string;
  category: CategoryType;
  subCategory?: string;
  type: RoutineType;
  difficulty: DifficultyLevel;
  emoji: string;
  startDate: string;
  endDate: string;
  targetDays: number;
  verificationType: VerificationType;
  verificationConfig: VerificationConfig;
  achievementRate: number;
  rewardName: string;
  rewardDescription: string;
  rewardImageUrl?: string;
  rewardCategory: string;
  rewardBrand?: string;
  maxParticipants?: number;
  isFeatured: boolean;
}

export interface UpdateCampaignParams {
  title?: string;
  description?: string;
  category?: CategoryType;
  subCategory?: string | null;
  difficulty?: DifficultyLevel;
  emoji?: string;
  isFeatured?: boolean;
}

/**
 * 캠페인 초안 생성
 */
export async function createCampaign(params: CreateCampaignParams): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      title: params.title,
      description: params.description,
      category: params.category,
      sub_category: params.subCategory || null,
      type: params.type,
      difficulty: params.difficulty,
      emoji: params.emoji,
      start_date: params.startDate,
      end_date: params.endDate,
      target_days: params.targetDays,
      verification_type: params.verificationType,
      verification_config: params.verificationConfig,
      achievement_rate: params.achievementRate,
      reward_name: params.rewardName,
      reward_description: params.rewardDescription,
      reward_image_url: params.rewardImageUrl || null,
      reward_category: params.rewardCategory,
      reward_brand: params.rewardBrand || null,
      max_participants: params.maxParticipants || null,
      is_featured: params.isFeatured,
      status: 'draft',
    })
    .select()
    .single();

  if (error) throw new Error(`캠페인 생성 실패: ${error.message}`);

  return toCampaign(data as DbCampaign);
}

/**
 * 캠페인 수정 (수정 가능 필드만)
 */
export async function updateCampaign(
  id: string,
  params: UpdateCampaignParams
): Promise<Campaign> {
  const updateData: Record<string, unknown> = {};

  if (params.title !== undefined) updateData.title = params.title;
  if (params.description !== undefined) updateData.description = params.description;
  if (params.category !== undefined) updateData.category = params.category;
  if (params.subCategory !== undefined) updateData.sub_category = params.subCategory;
  if (params.difficulty !== undefined) updateData.difficulty = params.difficulty;
  if (params.emoji !== undefined) updateData.emoji = params.emoji;
  if (params.isFeatured !== undefined) updateData.is_featured = params.isFeatured;

  const { data, error } = await supabase
    .from('campaigns')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`캠페인 수정 실패: ${error.message}`);

  return toCampaign(data as DbCampaign);
}

/**
 * 캠페인 발행 (draft → published)
 */
export async function publishCampaign(id: string): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'draft')
    .select()
    .single();

  if (error) throw new Error(`캠페인 발행 실패: ${error.message}`);

  return toCampaign(data as DbCampaign);
}

/**
 * 캠페인 발행 취소 (published → draft, 참여자 0일 때만)
 */
export async function unpublishCampaign(id: string): Promise<Campaign> {
  // 참여자 수 확인
  const { count } = await supabase
    .from('campaign_participations')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', id);

  if (count && count > 0) {
    throw new Error('참여자가 있는 캠페인은 발행 취소할 수 없습니다.');
  }

  const { data, error } = await supabase
    .from('campaigns')
    .update({
      status: 'draft',
      published_at: null,
    })
    .eq('id', id)
    .eq('status', 'published')
    .select()
    .single();

  if (error) throw new Error(`캠페인 발행 취소 실패: ${error.message}`);

  return toCampaign(data as DbCampaign);
}

/**
 * 캠페인 종료 (ended로 변경)
 */
export async function endCampaign(id: string): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .update({ status: 'ended' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`캠페인 종료 실패: ${error.message}`);

  return toCampaign(data as DbCampaign);
}

/**
 * 전체 캠페인 목록 (어드민용 - 모든 상태 포함)
 */
export async function getAllCampaigns(status?: CampaignStatus): Promise<Campaign[]> {
  let query = supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw new Error(`캠페인 목록 조회 실패: ${error.message}`);

  return (data as DbCampaign[]).map(toCampaign);
}

/**
 * 캠페인 참여자 수 조회
 */
export async function getCampaignParticipantCount(campaignId: string): Promise<number> {
  const { count, error } = await supabase
    .from('campaign_participations')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId);

  if (error) return 0;

  return count ?? 0;
}
