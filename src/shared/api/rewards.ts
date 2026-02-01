import { supabase } from './supabase';
import { getCachedUser } from './auth';
import { getCampaignById } from './campaigns';
import type { UserReward, RewardStatus } from '../types';
import type { ApplyRewardParams, DbUserReward } from './types';

/**
 * DB 행을 프론트엔드 UserReward 타입으로 변환
 */
async function toUserReward(row: DbUserReward): Promise<UserReward | null> {
  // participation에서 campaign을 조회하여 리워드 정보 가져오기
  const { data: participation } = await supabase
    .from('campaign_participations')
    .select('campaign_id')
    .eq('id', row.participation_id)
    .single();

  if (!participation) return null;

  const campaign = await getCampaignById(participation.campaign_id);
  if (!campaign) return null;

  return {
    id: row.id,
    userId: row.user_id,
    participationId: row.participation_id,
    reward: campaign.reward,
    status: row.status,
    progress: row.progress,
    unlockedAt: row.unlocked_at ?? undefined,
    appliedAt: row.applied_at ?? undefined,
    shippedAt: row.shipped_at ?? undefined,
    deliveredAt: row.delivered_at ?? undefined,
    shippingInfo: row.shipping_info ?? undefined,
  };
}

/**
 * 리워드 신청
 */
export async function applyReward(params: ApplyRewardParams): Promise<UserReward> {
  const user = await getCachedUser();

  // 기존 레코드 확인
  const { data: existing } = await supabase
    .from('user_rewards')
    .select('*')
    .eq('participation_id', params.participationId)
    .maybeSingle();

  if (existing) {
    // 기존 레코드 업데이트
    const { data, error } = await supabase
      .from('user_rewards')
      .update({
        status: 'APPLY' as RewardStatus,
        progress: 100,
        applied_at: new Date().toISOString(),
        shipping_info: params.shippingInfo,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw new Error(`리워드 신청 실패: ${error.message}`);

    const result = await toUserReward(data as DbUserReward);
    if (!result) throw new Error('리워드 조회 실패');
    return result;
  }

  // 새 레코드 생성
  const { data, error } = await supabase
    .from('user_rewards')
    .insert({
      user_id: user.id,
      participation_id: params.participationId,
      status: 'APPLY' as RewardStatus,
      progress: 100,
      applied_at: new Date().toISOString(),
      shipping_info: params.shippingInfo,
    })
    .select()
    .single();

  if (error) throw new Error(`리워드 신청 실패: ${error.message}`);

  const result = await toUserReward(data as DbUserReward);
  if (!result) throw new Error('리워드 조회 실패');
  return result;
}

/**
 * 참여의 리워드 상태 조회
 */
export async function getRewardByParticipation(participationId: string): Promise<UserReward | null> {
  const { data, error } = await supabase
    .from('user_rewards')
    .select('*')
    .eq('participation_id', participationId)
    .maybeSingle();

  if (error || !data) return null;

  return toUserReward(data as DbUserReward);
}

/**
 * 사용자의 획득한 리워드 수 조회
 */
export async function getUnlockedRewardCount(): Promise<number> {
  const user = await getCachedUser();

  const { count, error } = await supabase
    .from('user_rewards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .not('status', 'in', '("LOCK","PROGRESS")');

  if (error) return 0;

  return count ?? 0;
}
