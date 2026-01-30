import { supabase } from './supabase';
import type { CategoryType, RoutineType, RoutineTemplate, Reward } from '../types';
import type { DbRoutineTemplate, DbReward } from './types';

/**
 * DB 행을 프론트엔드 RoutineTemplate 타입으로 변환
 */
function toRoutineTemplate(row: DbRoutineTemplate, reward: DbReward): RoutineTemplate {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    subCategory: row.sub_category ?? undefined,
    type: row.type,
    difficulty: row.difficulty,
    defaultDuration: row.default_duration,
    verificationType: row.verification_type,
    verificationConfig: row.verification_config,
    reward: toReward(reward),
    emoji: row.emoji,
  };
}

function toReward(row: DbReward): Reward {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url || '',
    category: row.category,
    brand: row.brand ?? undefined,
  };
}

/**
 * 전체 루틴 템플릿 조회
 */
export async function getAllTemplates(): Promise<RoutineTemplate[]> {
  const { data: templates, error: tplError } = await supabase
    .from('routine_templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at');

  if (tplError) throw new Error(`템플릿 조회 실패: ${tplError.message}`);

  const { data: rewards, error: rwdError } = await supabase
    .from('rewards')
    .select('*');

  if (rwdError) throw new Error(`리워드 조회 실패: ${rwdError.message}`);

  const rewardMap = new Map<string, DbReward>();
  (rewards as DbReward[]).forEach((r) => {
    if (r.template_id) rewardMap.set(r.template_id, r);
  });

  return (templates as DbRoutineTemplate[])
    .filter((t) => rewardMap.has(t.id))
    .map((t) => toRoutineTemplate(t, rewardMap.get(t.id)!));
}

/**
 * 카테고리/타입별 루틴 템플릿 조회
 */
export async function getTemplatesByCategory(
  category: CategoryType,
  type?: RoutineType
): Promise<RoutineTemplate[]> {
  let query = supabase
    .from('routine_templates')
    .select('*')
    .eq('is_active', true)
    .eq('category', category);

  if (type) {
    query = query.eq('type', type);
  }

  const { data: templates, error: tplError } = await query.order('created_at');
  if (tplError) throw new Error(`템플릿 조회 실패: ${tplError.message}`);

  const templateIds = (templates as DbRoutineTemplate[]).map((t) => t.id);

  const { data: rewards, error: rwdError } = await supabase
    .from('rewards')
    .select('*')
    .in('template_id', templateIds);

  if (rwdError) throw new Error(`리워드 조회 실패: ${rwdError.message}`);

  const rewardMap = new Map<string, DbReward>();
  (rewards as DbReward[]).forEach((r) => {
    if (r.template_id) rewardMap.set(r.template_id, r);
  });

  return (templates as DbRoutineTemplate[])
    .filter((t) => rewardMap.has(t.id))
    .map((t) => toRoutineTemplate(t, rewardMap.get(t.id)!));
}

/**
 * ID로 루틴 템플릿 조회
 */
export async function getTemplateById(id: string): Promise<RoutineTemplate | null> {
  const { data: template, error: tplError } = await supabase
    .from('routine_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (tplError || !template) return null;

  const { data: reward, error: rwdError } = await supabase
    .from('rewards')
    .select('*')
    .eq('template_id', id)
    .single();

  if (rwdError || !reward) return null;

  return toRoutineTemplate(template as DbRoutineTemplate, reward as DbReward);
}
