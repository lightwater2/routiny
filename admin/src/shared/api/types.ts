// =============================================
// Enums & Literal Types
// =============================================

export type RoutineType = 'individual' | 'team';
export type CategoryType = 'care' | 'health' | 'daily';
export type CareSubCategory = 'baby' | 'pet' | 'senior';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type CampaignStatus = 'draft' | 'published' | 'active' | 'ended';
export type ParticipationStatus = 'active' | 'completed' | 'abandoned' | 'force_ended';
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

export interface DbCampaign {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  sub_category: CareSubCategory | null;
  type: RoutineType;
  difficulty: DifficultyLevel;
  emoji: string;
  start_date: string;
  end_date: string;
  target_days: number;
  verification_type: VerificationType;
  verification_config: Record<string, unknown>;
  achievement_rate: number;
  reward_name: string;
  reward_description: string;
  reward_image_url: string | null;
  reward_category: string;
  reward_brand: string | null;
  max_participants: number | null;
  current_participants: number;
  is_featured: boolean;
  status: CampaignStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCampaignParticipation {
  id: string;
  user_id: string;
  campaign_id: string;
  completed_days: number;
  status: ParticipationStatus;
  notification_enabled: boolean;
  notification_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCheckIn {
  id: string;
  user_id: string;
  participation_id: string;
  date: string;
  verification_type: VerificationType;
  verification_data: Record<string, unknown>;
  verified: boolean;
  created_at: string;
}

export interface DbUserReward {
  id: string;
  user_id: string;
  participation_id: string;
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

export interface DbUserWithParticipationCount extends DbUser {
  campaign_participations: { count: number }[];
}

export interface DbUserRewardJoined extends DbUserReward {
  users: Pick<DbUser, 'nickname'>;
  campaign_participations: {
    status: ParticipationStatus;
    campaigns: Pick<DbCampaign, 'title' | 'emoji' | 'reward_name'>;
  };
}

export interface DbCampaignTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  category: CategoryType;
  sub_category: CareSubCategory | null;
  type: RoutineType;
  difficulty: DifficultyLevel;
  emoji: string;
  target_days: number;
  verification_type: VerificationType;
  verification_config: Record<string, unknown>;
  achievement_rate: number;
  reward_name: string;
  reward_description: string;
  reward_image_url: string | null;
  reward_category: string;
  reward_brand: string | null;
  max_participants: number | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
