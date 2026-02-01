import { supabase } from './supabase';
import { getCachedUser } from './auth';
import { getCampaignById } from './campaigns';
import type { CampaignParticipation, ParticipationStatus } from '../types';
import type { JoinCampaignParams, DbCampaignParticipation } from './types';

/**
 * DB 행을 프론트엔드 CampaignParticipation 타입으로 변환
 */
async function toParticipation(
  row: DbCampaignParticipation
): Promise<CampaignParticipation | null> {
  const campaign = await getCampaignById(row.campaign_id);
  if (!campaign) return null;

  return {
    id: row.id,
    userId: row.user_id,
    campaignId: row.campaign_id,
    campaign,
    completedDays: row.completed_days,
    status: row.status,
    notificationEnabled: row.notification_enabled,
    notificationTime: row.notification_time ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * 캠페인 참여 (joinCampaign)
 */
export async function joinCampaign(
  params: JoinCampaignParams
): Promise<CampaignParticipation> {
  const user = await getCachedUser();

  const { data, error } = await supabase
    .from('campaign_participations')
    .insert({
      user_id: user.id,
      campaign_id: params.campaignId,
      notification_enabled: params.notificationEnabled,
      notification_time: params.notificationTime || null,
    })
    .select()
    .single();

  if (error) throw new Error(`캠페인 참여 실패: ${error.message}`);

  const participation = await toParticipation(data as DbCampaignParticipation);
  if (!participation) throw new Error('캠페인 조회 실패');

  return participation;
}

/**
 * 활성 참여 목록 조회
 */
export async function getActiveParticipations(): Promise<CampaignParticipation[]> {
  const user = await getCachedUser();

  const { data, error } = await supabase
    .from('campaign_participations')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`활성 참여 조회 실패: ${error.message}`);

  const results = await Promise.all(
    (data as DbCampaignParticipation[]).map(toParticipation)
  );

  return results.filter((r): r is CampaignParticipation => r !== null);
}

/**
 * 사용자의 전체 참여 조회
 */
export async function getAllParticipations(): Promise<CampaignParticipation[]> {
  const user = await getCachedUser();

  const { data, error } = await supabase
    .from('campaign_participations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`참여 조회 실패: ${error.message}`);

  const results = await Promise.all(
    (data as DbCampaignParticipation[]).map(toParticipation)
  );

  return results.filter((r): r is CampaignParticipation => r !== null);
}

/**
 * ID로 참여 조회
 */
export async function getParticipationById(
  id: string
): Promise<CampaignParticipation | null> {
  const { data, error } = await supabase
    .from('campaign_participations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return toParticipation(data as DbCampaignParticipation);
}

/**
 * 참여 상태 변경
 */
export async function updateParticipationStatus(
  id: string,
  status: ParticipationStatus
): Promise<void> {
  const { error } = await supabase
    .from('campaign_participations')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(`참여 상태 변경 실패: ${error.message}`);
}
