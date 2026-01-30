import { supabase } from './supabase';
import { getCachedUser } from './auth';
import { getTemplateById } from './routineTemplates';
import type { UserRoutine, UserRoutineStatus } from '../types';
import type { CreateUserRoutineParams, DbUserRoutine } from './types';

/**
 * DB 행을 프론트엔드 UserRoutine 타입으로 변환
 * template를 JOIN해서 조회
 */
async function toUserRoutine(row: DbUserRoutine): Promise<UserRoutine | null> {
  const template = await getTemplateById(row.template_id);
  if (!template) return null;

  return {
    id: row.id,
    userId: row.user_id,
    templateId: row.template_id,
    template,
    startDate: row.start_date,
    endDate: row.end_date,
    targetDays: row.target_days,
    completedDays: row.completed_days,
    status: row.status,
    notificationEnabled: row.notification_enabled,
    notificationTime: row.notification_time ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * 루틴 시작 (새 user_routine 생성)
 */
export async function createUserRoutine(
  params: CreateUserRoutineParams
): Promise<UserRoutine> {
  const user = await getCachedUser();

  const { data, error } = await supabase
    .from('user_routines')
    .insert({
      user_id: user.id,
      template_id: params.templateId,
      start_date: params.startDate,
      end_date: params.endDate,
      target_days: params.targetDays,
      notification_enabled: params.notificationEnabled,
      notification_time: params.notificationTime || null,
    })
    .select()
    .single();

  if (error) throw new Error(`루틴 시작 실패: ${error.message}`);

  const userRoutine = await toUserRoutine(data as DbUserRoutine);
  if (!userRoutine) throw new Error('템플릿 조회 실패');

  return userRoutine;
}

/**
 * 활성 루틴 목록 조회
 */
export async function getActiveRoutines(): Promise<UserRoutine[]> {
  const user = await getCachedUser();

  const { data, error } = await supabase
    .from('user_routines')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`활성 루틴 조회 실패: ${error.message}`);

  const results = await Promise.all(
    (data as DbUserRoutine[]).map(toUserRoutine)
  );

  return results.filter((r): r is UserRoutine => r !== null);
}

/**
 * 사용자의 전체 루틴 조회
 */
export async function getAllUserRoutines(): Promise<UserRoutine[]> {
  const user = await getCachedUser();

  const { data, error } = await supabase
    .from('user_routines')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`루틴 조회 실패: ${error.message}`);

  const results = await Promise.all(
    (data as DbUserRoutine[]).map(toUserRoutine)
  );

  return results.filter((r): r is UserRoutine => r !== null);
}

/**
 * ID로 사용자 루틴 조회
 */
export async function getUserRoutineById(id: string): Promise<UserRoutine | null> {
  const { data, error } = await supabase
    .from('user_routines')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return toUserRoutine(data as DbUserRoutine);
}

/**
 * 루틴 상태 변경
 */
export async function updateUserRoutineStatus(
  id: string,
  status: UserRoutineStatus
): Promise<void> {
  const { error } = await supabase
    .from('user_routines')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(`루틴 상태 변경 실패: ${error.message}`);
}
