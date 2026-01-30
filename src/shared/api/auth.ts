import { supabase } from './supabase';
import type { DbUser } from './types';

const DEVICE_ID_KEY = 'routiny_device_id';
const TOSS_USER_KEY = 'routiny_toss_user_key';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';

/**
 * 토스 미니앱 환경인지 확인
 */
function isTossApp(): boolean {
  try {
    return typeof window !== 'undefined' && /toss/i.test(navigator.userAgent);
  } catch {
    return false;
  }
}

/**
 * 토스 appLogin() 호출 → Edge Function으로 userKey 획득
 */
async function getTossUserKey(): Promise<string | null> {
  try {
    const { appLogin } = await import('@apps-in-toss/web-framework');
    const { authorizationCode, referrer } = await appLogin();

    const res = await fetch(`${SUPABASE_URL}/functions/v1/toss-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorizationCode, referrer }),
    });

    if (!res.ok) {
      console.error('Edge Function error:', await res.text());
      return null;
    }

    const { userKey } = await res.json();
    if (userKey) {
      localStorage.setItem(TOSS_USER_KEY, userKey);
    }
    return userKey ?? null;
  } catch (err) {
    console.error('Toss login failed:', err);
    return null;
  }
}

/**
 * 디바이스 ID 생성/조회 (폴백용)
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
 * toss_user_id로 사용자 조회/생성
 */
async function getOrCreateUserByTossId(tossUserId: string): Promise<DbUser> {
  const { data: existing, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('toss_user_id', tossUserId)
    .single();

  if (existing && !selectError) {
    return existing as DbUser;
  }

  // 새 사용자 생성 (device_id도 함께 저장)
  const deviceId = getDeviceId();
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({ device_id: deviceId, toss_user_id: tossUserId })
    .select()
    .single();

  if (insertError) {
    throw new Error(`사용자 생성 실패: ${insertError.message}`);
  }

  return newUser as DbUser;
}

/**
 * device_id로 사용자 조회/생성 (폴백)
 */
async function getOrCreateUserByDeviceId(): Promise<DbUser> {
  const deviceId = getDeviceId();

  const { data: existing, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('device_id', deviceId)
    .single();

  if (existing && !selectError) {
    return existing as DbUser;
  }

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
 * 현재 사용자 조회/생성
 * 토스 앱: appLogin → userKey → toss_user_id로 조회/생성
 * 브라우저: device_id로 조회/생성 (폴백)
 */
export async function getCurrentUser(): Promise<DbUser> {
  // 1. 캐시된 toss_user_id가 있으면 바로 사용
  const cachedTossKey = localStorage.getItem(TOSS_USER_KEY);
  if (cachedTossKey) {
    return getOrCreateUserByTossId(cachedTossKey);
  }

  // 2. 토스 앱 환경이면 appLogin 시도
  if (isTossApp()) {
    const userKey = await getTossUserKey();
    if (userKey) {
      return getOrCreateUserByTossId(userKey);
    }
  }

  // 3. 폴백: device_id 방식
  return getOrCreateUserByDeviceId();
}

/**
 * 캐시된 현재 사용자
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
