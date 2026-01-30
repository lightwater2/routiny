/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD 문자열을 Date 객체로 변환
 */
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 두 날짜 사이의 일수 계산
 */
export function getDaysBetween(startDate: string, endDate: string): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 시작일로부터 n일 후 날짜 계산
 */
export function addDays(date: string, days: number): string {
  const d = parseDate(date);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/**
 * 오늘이 시작일~종료일 범위 내에 있는지 확인
 */
export function isWithinRange(startDate: string, endDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return today >= start && today <= end;
}

/**
 * 루틴 시작일로부터 오늘까지 경과한 일수
 */
export function getDaysElapsed(startDate: string): number {
  const today = getToday();
  return getDaysBetween(startDate, today) + 1;
}

/**
 * 루틴 남은 일수 계산
 */
export function getDaysRemaining(endDate: string): number {
  const today = getToday();
  const remaining = getDaysBetween(today, endDate);
  return Math.max(0, remaining);
}

/**
 * 날짜를 한글로 표시 (예: 1월 15일)
 */
export function formatDateKorean(dateString: string): string {
  const date = parseDate(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 날짜를 요일과 함께 표시 (예: 1월 15일 (월))
 */
export function formatDateWithDay(dateString: string): string {
  const date = parseDate(dateString);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * 시간 문자열을 HH:MM 형식으로 변환
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 현재 시간을 HH:MM 형식으로 반환
 */
export function getCurrentTime(): string {
  return formatTime(new Date());
}

/**
 * 특정 날짜가 오늘인지 확인
 */
export function isToday(dateString: string): boolean {
  return dateString === getToday();
}

/**
 * 특정 날짜가 과거인지 확인
 */
export function isPast(dateString: string): boolean {
  const date = parseDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * 특정 날짜가 미래인지 확인
 */
export function isFuture(dateString: string): boolean {
  const date = parseDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

/**
 * 시작일부터 종료일까지의 모든 날짜 배열 생성
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let current = startDate;

  while (current <= endDate) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
}

/**
 * 이번 주의 시작일(월요일)과 종료일(일요일) 반환
 */
export function getCurrentWeekRange(): { start: string; end: string } {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: formatDate(monday),
    end: formatDate(sunday),
  };
}

/**
 * 두 시간 사이의 분 단위 간격 계산
 */
export function getMinutesBetween(time1: string, time2: string): number {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);

  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;

  return Math.abs(minutes2 - minutes1);
}
