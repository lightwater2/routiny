import type {
  CategoryType,
  RoutineType,
  DifficultyLevel,
  VerificationType,
  VerificationConfig,
  CareSubCategory,
  RewardStatus,
  CheckInData,
  ShippingInfo,
} from '../types';

// =============================================
// Database Row Types (Supabase 응답 타입)
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
  verification_config: VerificationConfig;
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
  status: 'active' | 'completed' | 'abandoned';
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
  verification_data: CheckInData;
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
  shipping_info: ShippingInfo | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================
// Joined Types (JOIN 쿼리 결과)
// =============================================

export interface DbUserRoutineWithTemplate extends DbUserRoutine {
  routine_templates: DbRoutineTemplate;
  rewards: DbReward[];
}

export interface DbUserRewardWithReward extends DbUserReward {
  rewards: DbReward;
}

// =============================================
// API Input Types
// =============================================

export interface CreateUserRoutineParams {
  templateId: string;
  startDate: string;
  endDate: string;
  targetDays: number;
  notificationEnabled: boolean;
  notificationTime?: string;
}

export interface CreateCheckInParams {
  userRoutineId: string;
  date: string;
  verificationType: VerificationType;
  verificationData: CheckInData;
}

export interface ApplyRewardParams {
  userRoutineId: string;
  rewardId: string;
  shippingInfo: ShippingInfo;
}
