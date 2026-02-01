import type {
  CategoryType,
  RoutineType,
  DifficultyLevel,
  VerificationType,
  VerificationConfig,
  CareSubCategory,
  CampaignStatus,
  ParticipationStatus,
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

export interface DbCampaign {
  id: string;
  // 불변 필드
  start_date: string;
  end_date: string;
  target_days: number;
  verification_type: VerificationType;
  verification_config: VerificationConfig;
  achievement_rate: number;
  reward_name: string;
  reward_description: string;
  reward_image_url: string | null;
  reward_category: string;
  reward_brand: string | null;
  type: RoutineType;
  // 수정 가능 필드
  title: string;
  description: string;
  category: CategoryType;
  sub_category: CareSubCategory | null;
  difficulty: DifficultyLevel;
  emoji: string;
  // 메타
  status: CampaignStatus;
  max_participants: number | null;
  current_participants: number;
  is_featured: boolean;
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
  verification_data: CheckInData;
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
  shipping_info: ShippingInfo | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================
// Joined Types (JOIN 쿼리 결과)
// =============================================

export interface DbParticipationWithCampaign extends DbCampaignParticipation {
  campaigns: DbCampaign;
}

// =============================================
// API Input Types
// =============================================

export interface JoinCampaignParams {
  campaignId: string;
  notificationEnabled: boolean;
  notificationTime?: string;
}

export interface CreateCheckInParams {
  participationId: string;
  date: string;
  verificationType: VerificationType;
  verificationData: CheckInData;
}

export interface ApplyRewardParams {
  participationId: string;
  shippingInfo: ShippingInfo;
}
