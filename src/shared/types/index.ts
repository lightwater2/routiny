// Routine Types
export type RoutineType = 'individual' | 'team';

export type CategoryType = 'care' | 'health' | 'daily';

export type CareSubCategory = 'baby' | 'pet' | 'senior';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// 검증 방식 타입
export type VerificationType =
  | 'time_record'      // 시간 기록 (분유/기저귀/수면 텀)
  | 'text_input'       // 텍스트 입력 (칭찬/일기/목표)
  | 'photo_upload'     // 사진 인증 (식단/홈트/러닝)
  | 'counter_input'    // 숫자 입력 (걸음수/산책시간)
  | 'simple_check'     // 단순 체크 (약복용/스트레칭/기상)
  | 'receipt_record';  // 영수증 기록 (절약)

// 검증 설정
export interface VerificationConfig {
  placeholder?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  frequency?: 'daily' | 'weekly';
  weeklyTarget?: number; // 주간 목표 횟수 (e.g., 주 3회)
}

// =============================================
// Campaign (캠페인 - 어드민 발행)
// =============================================

export type CampaignStatus = 'draft' | 'published' | 'active' | 'ended';

export interface CampaignReward {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  brand?: string;
}

export interface Campaign {
  id: string;
  // 불변 필드 (발행 후 수정 불가)
  startDate: string;
  endDate: string;
  targetDays: number;
  verificationType: VerificationType;
  verificationConfig: VerificationConfig;
  achievementRate: number;
  reward: CampaignReward;
  type: RoutineType;
  // 수정 가능 필드
  title: string;
  description: string;
  category: CategoryType;
  subCategory?: CareSubCategory;
  difficulty: DifficultyLevel;
  emoji: string;
  // 메타
  status: CampaignStatus;
  maxParticipants?: number;
  currentParticipants: number;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================
// Campaign Participation (캠페인 참여)
// =============================================

export type ParticipationStatus = 'active' | 'completed' | 'abandoned' | 'force_ended';

export interface CampaignParticipation {
  id: string;
  userId: string;
  campaignId: string;
  campaign: Campaign;
  completedDays: number;
  status: ParticipationStatus;
  notificationEnabled: boolean;
  notificationTime?: string;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  createdAt: string;
}

// =============================================
// 체크인 기록
// =============================================

export interface CheckIn {
  id: string;
  userId: string;
  participationId: string;
  date: string;
  verificationType: VerificationType;
  verificationData: CheckInData;
  verified: boolean;
  createdAt: string;
}

// 검증 방식별 체크인 데이터
export type CheckInData =
  | TimeRecordData
  | TextInputData
  | PhotoUploadData
  | CounterInputData
  | SimpleCheckData
  | ReceiptRecordData;

export interface TimeRecordData {
  type: 'time_record';
  recordedTime: string;
  intervalMinutes?: number;
}

export interface TextInputData {
  type: 'text_input';
  text: string;
}

export interface PhotoUploadData {
  type: 'photo_upload';
  imageUrl: string;
  caption?: string;
}

export interface CounterInputData {
  type: 'counter_input';
  value: number;
  unit: string;
}

export interface SimpleCheckData {
  type: 'simple_check';
  checked: boolean;
}

export interface ReceiptRecordData {
  type: 'receipt_record';
  amount: number;
  description?: string;
  imageUrl?: string;
}

// =============================================
// Reward Status
// =============================================

export type RewardStatus = 'LOCK' | 'PROGRESS' | 'UNLOCK' | 'APPLY' | 'SHIPPING' | 'DELIVERED';

export interface UserReward {
  id: string;
  userId: string;
  participationId: string;
  reward: CampaignReward;
  status: RewardStatus;
  progress: number;
  unlockedAt?: string;
  appliedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  shippingInfo?: ShippingInfo;
}

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  addressDetail?: string;
  zipCode: string;
  trackingNumber?: string;
}
