import { supabase } from './supabase';
import type { DbUser } from './types';

const DEVICE_ID_KEY = 'routiny_device_id';

/**
 * 디바이스 ID 생성/조회
 * localStorage에 저장된 디바이스 ID가 없으면 새로 생성
 */
export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device-${crypto.randomUUID()}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

/**
 * 현재 사용자 조회/생성
 * 디바이스 ID로 사용자를 조회하고, 없으면 새로 생성
 */
export async function getCurrentUser(): Promise<DbUser> {
  const deviceId = getDeviceId();

  // 기존 사용자 조회
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('device_id', deviceId)
    .single();

  if (existingUser && !selectError) {
    return existingUser as DbUser;
  }

  // 새 사용자 생성
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({ device_id: deviceId })
    .select()
    .single();

  if (insertError) {
    throw new Error(`사용자 생성 실패: ${insertError.message}`);
  }

  return newUser as DbUser;
}

/**
 * 캐시된 현재 사용자
 * 반복적인 API 호출을 방지하기 위해 세션 내 사용자 정보를 캐시
 */
let cachedUser: DbUser | null = null;

export async function getCachedUser(): Promise<DbUser> {
  if (!cachedUser) {
    cachedUser = await getCurrentUser();
  }
  return cachedUser;
}

export function clearUserCache(): void {
  cachedUser = null;
}
