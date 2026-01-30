export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

export function getDifficultyLabel(difficulty: string): string {
  const map: Record<string, string> = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };
  return map[difficulty] ?? difficulty;
}

export function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    care: '케어',
    health: '헬스',
    daily: '데일리',
  };
  return map[category] ?? category;
}

export function getRewardStatusLabel(status: string): string {
  const map: Record<string, string> = {
    LOCK: '잠김',
    PROGRESS: '진행중',
    UNLOCK: '잠금해제',
    APPLY: '신청',
    SHIPPING: '배송중',
    DELIVERED: '배송완료',
  };
  return map[status] ?? status;
}
