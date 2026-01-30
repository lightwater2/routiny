// =============================================
// Enums & Literal Types
// =============================================

export type RoutineType = 'individual' | 'team';
export type CategoryType = 'care' | 'health' | 'daily';
export type CareSubCategory = 'baby' | 'pet' | 'senior';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type UserRoutineStatus = 'active' | 'completed' | 'abandoned';
export type RewardStatus = 'LOCK' | 'PROGRESS' | 'UNLOCK' | 'APPLY' | 'SHIPPING' | 'DELIVERED';

export type VerificationType =
  | 'time_record'
  | 'text_input'
  | 'photo_upload'
  | 'counter_input'
  | 'simple_check'
  | 'receipt_record';

// =============================================
// Database Row Types
// =============================================

export interface DbUser {
  id: string;
  device_id: string;
  nickname: string;
  profile_image_url: string | null;
  toss_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbRoutineTemplate {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  sub_category: CareSubCategory | null;
  type: RoutineType;
  difficulty: DifficultyLevel;
  default_duration: number;
  verification_type: VerificationType;
  verification_config: Record<string, unknown>;
  emoji: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbReward {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
  brand: string | null;
  template_id: string;
  created_at: string;
}

export interface DbUserRoutine {
  id: string;
  user_id: string;
  template_id: string;
  start_date: string;
  end_date: string;
  target_days: number;
  completed_days: number;
  status: UserRoutineStatus;
  notification_enabled: boolean;
  notification_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCheckIn {
  id: string;
  user_id: string;
  user_routine_id: string;
  date: string;
  verification_type: VerificationType;
  verification_data: Record<string, unknown>;
  verified: boolean;
  created_at: string;
}

export interface DbUserReward {
  id: string;
  user_id: string;
  user_routine_id: string;
  reward_id: string;
  status: RewardStatus;
  progress: number;
  unlocked_at: string | null;
  applied_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  shipping_info: Record<string, unknown> | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================
// Joined Types (for admin queries)
// =============================================

export interface DbUserWithRoutineCount extends DbUser {
  user_routines: { count: number }[];
}

export interface DbTemplateWithRewards extends DbRoutineTemplate {
  rewards: DbReward[];
}

export interface DbUserRewardJoined extends DbUserReward {
  rewards: DbReward;
  users: Pick<DbUser, 'nickname'>;
  user_routines: {
    status: UserRoutineStatus;
    routine_templates: Pick<DbRoutineTemplate, 'title' | 'emoji'>;
  };
}
