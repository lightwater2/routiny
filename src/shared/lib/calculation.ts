import type { CheckIn, RewardStatus, VerificationConfig, CampaignParticipation } from '../types';

/**
 * 달성률 계산
 * 달성률 = (완료 체크인 수 / 목표 체크인 수) × 100
 */
export function calculateProgress(
  completedCheckIns: number,
  targetCheckIns: number
): number {
  if (targetCheckIns === 0) return 0;
  const progress = (completedCheckIns / targetCheckIns) * 100;
  return Math.min(100, Math.round(progress * 10) / 10);
}

/**
 * CampaignParticipation의 달성률 계산
 */
export function calculateRoutineProgress(participation: CampaignParticipation): number {
  return calculateProgress(participation.completedDays, participation.campaign.targetDays);
}

/**
 * 체크인 기록 기반 달성률 계산
 */
export function calculateProgressFromCheckIns(
  checkIns: CheckIn[],
  targetDays: number,
  verificationConfig?: VerificationConfig
): number {
  // 주간 목표가 있는 경우 (예: 주 3회 러닝)
  if (verificationConfig?.frequency === 'weekly' && verificationConfig?.weeklyTarget) {
    return calculateWeeklyProgress(checkIns, targetDays, verificationConfig.weeklyTarget);
  }

  // 일반적인 일일 체크인
  const completedDays = checkIns.filter((c) => c.verified).length;
  return calculateProgress(completedDays, targetDays);
}

/**
 * 주간 목표 기반 달성률 계산
 */
function calculateWeeklyProgress(
  checkIns: CheckIn[],
  totalDays: number,
  weeklyTarget: number
): number {
  const totalWeeks = Math.ceil(totalDays / 7);
  const targetCheckIns = totalWeeks * weeklyTarget;
  const completedCheckIns = checkIns.filter((c) => c.verified).length;
  return calculateProgress(completedCheckIns, targetCheckIns);
}

/**
 * 리워드 상태 결정
 * - 90% 이상: UNLOCK
 * - 진행 중: PROGRESS
 * - 시작 전: LOCK
 */
export function determineRewardStatus(
  progress: number,
  hasStarted: boolean
): RewardStatus {
  if (progress >= 90) return 'UNLOCK';
  if (hasStarted) return 'PROGRESS';
  return 'LOCK';
}

/**
 * 다음 리워드 상태로 전환
 */
export function getNextRewardStatus(currentStatus: RewardStatus): RewardStatus | null {
  const transitions: Record<RewardStatus, RewardStatus | null> = {
    LOCK: 'PROGRESS',
    PROGRESS: 'UNLOCK',
    UNLOCK: 'APPLY',
    APPLY: 'SHIPPING',
    SHIPPING: 'DELIVERED',
    DELIVERED: null,
  };
  return transitions[currentStatus];
}

/**
 * 연속 체크인 일수 계산
 */
export function calculateStreak(checkIns: CheckIn[], _startDate?: string): number {
  if (checkIns.length === 0) return 0;

  const sortedCheckIns = [...checkIns]
    .filter((c) => c.verified)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sortedCheckIns.length === 0) return 0;

  let streak = 1;
  for (let i = 0; i < sortedCheckIns.length - 1; i++) {
    const current = new Date(sortedCheckIns[i].date);
    const next = new Date(sortedCheckIns[i + 1].date);
    const diffDays = Math.abs(
      (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * 오늘 체크인 완료 여부
 */
export function isTodayCheckedIn(checkIns: CheckIn[], today: string): boolean {
  return checkIns.some((c) => c.date === today && c.verified);
}

/**
 * 특정 기간의 체크인 완료 일수
 */
export function getCompletedDaysInRange(
  checkIns: CheckIn[],
  startDate: string,
  endDate: string
): number {
  return checkIns.filter(
    (c) => c.verified && c.date >= startDate && c.date <= endDate
  ).length;
}

/**
 * 남은 목표 체크인 수
 */
export function getRemainingCheckIns(
  completedCheckIns: number,
  targetCheckIns: number
): number {
  return Math.max(0, targetCheckIns - completedCheckIns);
}

/**
 * 달성 가능 여부 확인
 * 남은 날짜 내에 목표를 달성할 수 있는지
 */
export function isAchievable(
  completedCheckIns: number,
  targetCheckIns: number,
  remainingDays: number,
  verificationConfig?: VerificationConfig
): boolean {
  // 주간 목표인 경우
  if (verificationConfig?.frequency === 'weekly' && verificationConfig?.weeklyTarget) {
    const requiredCheckIns = targetCheckIns - completedCheckIns;
    const remainingWeeks = Math.ceil(remainingDays / 7);
    const maxPossibleCheckIns = remainingWeeks * verificationConfig.weeklyTarget;
    return requiredCheckIns <= maxPossibleCheckIns;
  }

  // 일일 체크인인 경우
  const requiredCheckIns = targetCheckIns - completedCheckIns;
  return requiredCheckIns <= remainingDays;
}

/**
 * 달성률에 따른 상태 메시지
 */
export function getProgressMessage(progress: number): string {
  if (progress === 0) return '아직 시작하지 않았어요';
  if (progress < 25) return '좋은 시작이에요!';
  if (progress < 50) return '잘하고 있어요!';
  if (progress < 75) return '절반 이상 달성했어요!';
  if (progress < 90) return '거의 다 왔어요!';
  if (progress < 100) return '리워드 잠금해제!';
  return '목표 달성 완료!';
}

/**
 * 리워드 상태에 따른 메시지
 */
export function getRewardStatusMessage(status: RewardStatus): string {
  const messages: Record<RewardStatus, string> = {
    LOCK: '루틴을 시작하면 리워드를 받을 수 있어요',
    PROGRESS: '목표를 향해 달려가고 있어요',
    UNLOCK: '리워드 신청이 가능해요!',
    APPLY: '리워드 신청이 완료되었어요',
    SHIPPING: '리워드가 배송 중이에요',
    DELIVERED: '리워드가 도착했어요!',
  };
  return messages[status];
}

/**
 * 절약 루틴용: 일일 지출 한도 확인
 */
export function checkDailySpendingLimit(
  amount: number,
  maxValue: number
): { isWithinLimit: boolean; remaining: number } {
  return {
    isWithinLimit: amount <= maxValue,
    remaining: Math.max(0, maxValue - amount),
  };
}

/**
 * 절약 루틴용: 총 절약 금액 계산
 */
export function calculateTotalSavings(
  dailyLimit: number,
  actualSpending: number[]
): number {
  const totalLimit = dailyLimit * actualSpending.length;
  const totalSpent = actualSpending.reduce((sum, amount) => sum + amount, 0);
  return Math.max(0, totalLimit - totalSpent);
}
