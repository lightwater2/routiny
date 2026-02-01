import { supabase } from './supabase';
import { getCachedUser } from './auth';
import type { CheckIn } from '../types';
import type { CreateCheckInParams, DbCheckIn } from './types';

/**
 * DB 행을 프론트엔드 CheckIn 타입으로 변환
 */
function toCheckIn(row: DbCheckIn): CheckIn {
  return {
    id: row.id,
    userId: row.user_id,
    participationId: row.participation_id,
    date: row.date,
    verificationType: row.verification_type,
    verificationData: row.verification_data,
    verified: row.verified,
    createdAt: row.created_at,
  };
}

/**
 * 체크인 생성
 * DB 트리거가 자동으로 campaign_participations.completed_days를 업데이트함
 */
export async function createCheckIn(params: CreateCheckInParams): Promise<CheckIn> {
  const user = await getCachedUser();

  const { data, error } = await supabase
    .from('check_ins')
    .insert({
      user_id: user.id,
      participation_id: params.participationId,
      date: params.date,
      verification_type: params.verificationType,
      verification_data: params.verificationData,
    })
    .select()
    .single();

  if (error) throw new Error(`체크인 실패: ${error.message}`);

  return toCheckIn(data as DbCheckIn);
}

/**
 * 참여별 체크인 목록 조회
 */
export async function getCheckInsByParticipation(participationId: string): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('participation_id', participationId)
    .order('date', { ascending: true });

  if (error) throw new Error(`체크인 조회 실패: ${error.message}`);

  return (data as DbCheckIn[]).map(toCheckIn);
}

/**
 * 오늘 체크인 여부 확인
 */
export async function isTodayCheckedIn(
  participationId: string,
  today: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('check_ins')
    .select('id')
    .eq('participation_id', participationId)
    .eq('date', today)
    .maybeSingle();

  if (error) return false;

  return data !== null;
}

/**
 * 사용자의 전체 체크인 수 조회
 */
export async function getTotalCheckInCount(): Promise<number> {
  const user = await getCachedUser();

  const { count, error } = await supabase
    .from('check_ins')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) return 0;

  return count ?? 0;
}
