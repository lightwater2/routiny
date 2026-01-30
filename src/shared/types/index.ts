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

// 루틴 템플릿 (기획서 기준 22개 루틴)
export interface RoutineTemplate {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  subCategory?: CareSubCategory;
  type: RoutineType;
  difficulty: DifficultyLevel;
  defaultDuration: number; // 기본 일수
  verificationType: VerificationType;
  verificationConfig: VerificationConfig;
  reward: Reward;
  emoji: string;
}

// 검증 설정
export interface VerificationConfig {
  placeholder?: string;
  unit?: string;
  minValue?: number;
  maxValue?: number;
  frequency?: 'daily' | 'weekly';
  weeklyTarget?: number; // 주간 목표 횟수 (e.g., 주 3회)
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  subCategory?: CareSubCategory;
  type: RoutineType;
  difficulty: DifficultyLevel;
  duration: string;
  verificationMethod: string;
  reward: Reward;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  brand?: string;
}

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  emoji: string;
  routines: string[];
}

// User Types
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  createdAt: string;
}

// 사용자가 시작한 루틴
export interface UserRoutine {
  id: string;
  userId: string;
  templateId: string;
  template: RoutineTemplate;
  startDate: string;
  endDate: string;
  targetDays: number;
  completedDays: number;
  status: UserRoutineStatus;
  notificationEnabled: boolean;
  notificationTime?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRoutineStatus = 'active' | 'completed' | 'abandoned';

// 체크인 기록
export interface CheckIn {
  id: string;
  userId: string;
  userRoutineId: string;
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

// Reward Status
export type RewardStatus = 'LOCK' | 'PROGRESS' | 'UNLOCK' | 'APPLY' | 'SHIPPING' | 'DELIVERED';

export interface UserReward {
  id: string;
  userId: string;
  userRoutineId: string;
  reward: Reward;
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
