import type { RoutineTemplate, CategoryType, RoutineType } from '../../../shared/types';

// 개인 루틴 (11개)
export const individualRoutines: RoutineTemplate[] = [
  // 케어 - 육아 (2개)
  {
    id: 'ind-care-baby-1',
    title: '아기 분유 텀 체크',
    description: '정해진 시간에 분유를 챙기고 텀을 기록해요',
    category: 'care',
    subCategory: 'baby',
    type: 'individual',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'time_record',
    verificationConfig: {
      placeholder: '분유 시간 기록',
      unit: '분',
    },
    reward: {
      id: 'reward-baby-wipes',
      name: '프리미엄 아기 물티슈 세트',
      description: '민감한 아기 피부를 위한 저자극 프리미엄 물티슈',
      imageUrl: '/rewards/baby-wipes.jpg',
      category: '육아용품',
      brand: '베이비케어',
    },
    emoji: '🍼',
  },
  {
    id: 'ind-care-baby-2',
    title: '아기 기저귀 텀 체크',
    description: '기저귀 교체 시간을 기록하고 규칙적인 케어를 해요',
    category: 'care',
    subCategory: 'baby',
    type: 'individual',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'time_record',
    verificationConfig: {
      placeholder: '기저귀 교체 시간',
      unit: '분',
    },
    reward: {
      id: 'reward-diapers',
      name: '프리미엄 기저귀 1박스',
      description: '부드럽고 흡수력 좋은 프리미엄 기저귀',
      imageUrl: '/rewards/diapers.jpg',
      category: '육아용품',
      brand: '베이비케어',
    },
    emoji: '👶',
  },

  // 케어 - 반려동물 (1개)
  {
    id: 'ind-care-pet-1',
    title: '반려동물 산책하기',
    description: '반려동물과 함께 건강한 산책을 해요',
    category: 'care',
    subCategory: 'pet',
    type: 'individual',
    difficulty: 'medium',
    defaultDuration: 14,
    verificationType: 'counter_input',
    verificationConfig: {
      placeholder: '산책 시간 입력',
      unit: '분',
      minValue: 10,
      maxValue: 180,
    },
    reward: {
      id: 'reward-pet-snack',
      name: '프리미엄 반려동물 간식',
      description: '건강한 재료로 만든 수제 간식',
      imageUrl: '/rewards/pet-snack.jpg',
      category: '반려동물용품',
      brand: '펫프렌즈',
    },
    emoji: '🐕',
  },

  // 케어 - 시니어 (1개)
  {
    id: 'ind-care-senior-1',
    title: '약 챙겨먹기',
    description: '매일 정해진 시간에 약을 챙겨 드세요',
    category: 'care',
    subCategory: 'senior',
    type: 'individual',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'simple_check',
    verificationConfig: {},
    reward: {
      id: 'reward-pill-case',
      name: '스마트 약 케이스',
      description: '요일별 칸막이가 있는 스마트 약 케이스',
      imageUrl: '/rewards/pill-case.jpg',
      category: '건강용품',
      brand: '헬스케어',
    },
    emoji: '💊',
  },

  // 헬스 (4개)
  {
    id: 'ind-health-1',
    title: '하루 5천보 걷기',
    description: '가벼운 산책으로 건강을 챙겨요',
    category: 'health',
    type: 'individual',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'counter_input',
    verificationConfig: {
      placeholder: '걸음수 입력',
      unit: '보',
      minValue: 5000,
      maxValue: 100000,
    },
    reward: {
      id: 'reward-socks',
      name: '기능성 스포츠 양말',
      description: '통기성 좋은 프리미엄 스포츠 양말',
      imageUrl: '/rewards/socks.jpg',
      category: '스포츠용품',
      brand: '공방 S',
    },
    emoji: '🚶',
  },
  {
    id: 'ind-health-2',
    title: '러닝하기 (주 3회)',
    description: '주 3회 러닝으로 심폐지구력을 키워요',
    category: 'health',
    type: 'individual',
    difficulty: 'medium',
    defaultDuration: 14,
    verificationType: 'photo_upload',
    verificationConfig: {
      placeholder: '러닝 기록 스크린샷 업로드',
      frequency: 'weekly',
      weeklyTarget: 3,
    },
    reward: {
      id: 'reward-towel',
      name: '프리미엄 스포츠 타월',
      description: '땀 흡수가 뛰어난 고급 스포츠 타월',
      imageUrl: '/rewards/towel.jpg',
      category: '스포츠용품',
      brand: '스포티',
    },
    emoji: '🏃',
  },
  {
    id: 'ind-health-3',
    title: '다이어트 (식단 관리)',
    description: '건강한 식단을 기록하고 관리해요',
    category: 'health',
    type: 'individual',
    difficulty: 'hard',
    defaultDuration: 14,
    verificationType: 'photo_upload',
    verificationConfig: {
      placeholder: '오늘의 식단 사진 업로드',
    },
    reward: {
      id: 'reward-scale',
      name: '스마트 체중계',
      description: '체지방률까지 측정 가능한 스마트 체중계',
      imageUrl: '/rewards/scale.jpg',
      category: '건강용품',
      brand: '헬스테크',
    },
    emoji: '🥗',
  },
  {
    id: 'ind-health-4',
    title: '하루 10분 스트레칭',
    description: '뭉친 근육을 풀고 유연성을 키워요',
    category: 'health',
    type: 'individual',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'simple_check',
    verificationConfig: {},
    reward: {
      id: 'reward-massage-ball',
      name: '마사지볼 세트',
      description: '근육 이완을 위한 프리미엄 마사지볼',
      imageUrl: '/rewards/massage-ball.jpg',
      category: '피트니스용품',
      brand: '핏케어',
    },
    emoji: '🧘',
  },

  // 데일리 (3개)
  {
    id: 'ind-daily-1',
    title: '하루에 한 번 칭찬하기',
    description: '매일 나 또는 주변 사람을 칭찬해요',
    category: 'daily',
    type: 'individual',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'text_input',
    verificationConfig: {
      placeholder: '오늘의 칭찬을 적어주세요',
    },
    reward: {
      id: 'reward-diary',
      name: '감사 다이어리',
      description: '매일 감사를 기록할 수 있는 프리미엄 다이어리',
      imageUrl: '/rewards/diary.jpg',
      category: '문구용품',
      brand: '페이퍼랩',
    },
    emoji: '👏',
  },
  {
    id: 'ind-daily-2',
    title: '하루 10분 일기 쓰기',
    description: '하루를 정리하며 마음을 다스려요',
    category: 'daily',
    type: 'individual',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'text_input',
    verificationConfig: {
      placeholder: '오늘의 일기를 적어주세요',
    },
    reward: {
      id: 'reward-pen',
      name: '프리미엄 만년필',
      description: '부드러운 필기감의 고급 만년필',
      imageUrl: '/rewards/pen.jpg',
      category: '문구용품',
      brand: '펜마스터',
    },
    emoji: '📝',
  },
  {
    id: 'ind-daily-3',
    title: '하루 1만원 이하로 쓰기',
    description: '절약 습관으로 저축을 늘려요',
    category: 'daily',
    type: 'individual',
    difficulty: 'medium',
    defaultDuration: 14,
    verificationType: 'receipt_record',
    verificationConfig: {
      placeholder: '오늘 사용한 금액',
      unit: '원',
      maxValue: 10000,
    },
    reward: {
      id: 'reward-wallet',
      name: '미니 지갑',
      description: '심플한 디자인의 프리미엄 미니 지갑',
      imageUrl: '/rewards/wallet.jpg',
      category: '패션소품',
      brand: '레더웍스',
    },
    emoji: '💰',
  },
];

// 팀 루틴 (11개)
export const teamRoutines: RoutineTemplate[] = [
  // 케어 - 반려동물 (1개)
  {
    id: 'team-care-pet-1',
    title: '반려동물 산책 함께하기',
    description: '함께 반려동물 산책을 하며 책임감을 나눠요',
    category: 'care',
    subCategory: 'pet',
    type: 'team',
    difficulty: 'medium',
    defaultDuration: 14,
    verificationType: 'photo_upload',
    verificationConfig: {
      placeholder: '산책 인증 사진 업로드',
    },
    reward: {
      id: 'reward-pet-leash',
      name: '프리미엄 반려동물 리드줄',
      description: '편안하고 안전한 고급 리드줄',
      imageUrl: '/rewards/pet-leash.jpg',
      category: '반려동물용품',
      brand: '펫프렌즈',
    },
    emoji: '🐕‍🦺',
  },

  // 케어 - 육아 (1개)
  {
    id: 'team-care-baby-1',
    title: '아기 수면 텀 기록',
    description: '함께 아기 수면 패턴을 기록하고 관리해요',
    category: 'care',
    subCategory: 'baby',
    type: 'team',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'time_record',
    verificationConfig: {
      placeholder: '수면 시작/종료 시간',
      unit: '분',
    },
    reward: {
      id: 'reward-baby-blanket',
      name: '오가닉 아기 담요',
      description: '순면 100% 유기농 아기 담요',
      imageUrl: '/rewards/baby-blanket.jpg',
      category: '육아용품',
      brand: '베이비케어',
    },
    emoji: '😴',
  },

  // 케어 - 시니어 (1개)
  {
    id: 'team-care-senior-1',
    title: '부모님과 통화하기',
    description: '매일 부모님께 안부 전화를 드려요',
    category: 'care',
    subCategory: 'senior',
    type: 'team',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'simple_check',
    verificationConfig: {},
    reward: {
      id: 'reward-phone-stand',
      name: '프리미엄 폰 스탠드',
      description: '영상통화에 편리한 고급 폰 스탠드',
      imageUrl: '/rewards/phone-stand.jpg',
      category: '생활용품',
      brand: '테크라이프',
    },
    emoji: '📞',
  },

  // 헬스 (4개)
  {
    id: 'team-health-1',
    title: '함께 러닝하기 (주 3회)',
    description: '팀원들과 함께 러닝하며 건강을 챙겨요',
    category: 'health',
    type: 'team',
    difficulty: 'medium',
    defaultDuration: 14,
    verificationType: 'photo_upload',
    verificationConfig: {
      placeholder: '러닝 인증 사진 업로드',
      frequency: 'weekly',
      weeklyTarget: 3,
    },
    reward: {
      id: 'reward-running-belt',
      name: '러닝 벨트',
      description: '스마트폰 수납 가능한 러닝 벨트',
      imageUrl: '/rewards/running-belt.jpg',
      category: '스포츠용품',
      brand: '스포티',
    },
    emoji: '🏃‍♂️',
  },
  {
    id: 'team-health-2',
    title: '홈트 같이 하기',
    description: '팀원들과 홈트레이닝을 함께해요',
    category: 'health',
    type: 'team',
    difficulty: 'medium',
    defaultDuration: 14,
    verificationType: 'photo_upload',
    verificationConfig: {
      placeholder: '홈트 인증 사진/영상 업로드',
    },
    reward: {
      id: 'reward-yoga-mat',
      name: '프리미엄 요가 매트',
      description: '미끄럼 방지 프리미엄 요가 매트',
      imageUrl: '/rewards/yoga-mat.jpg',
      category: '피트니스용품',
      brand: '핏케어',
    },
    emoji: '💪',
  },
  {
    id: 'team-health-3',
    title: '다이어트 식단 나누기',
    description: '서로의 식단을 공유하며 건강한 식습관을 만들어요',
    category: 'health',
    type: 'team',
    difficulty: 'hard',
    defaultDuration: 14,
    verificationType: 'photo_upload',
    verificationConfig: {
      placeholder: '오늘의 식단 사진 업로드',
    },
    reward: {
      id: 'reward-meal-container',
      name: '밀프렙 용기 세트',
      description: '전자레인지 사용 가능한 고급 밀프렙 용기',
      imageUrl: '/rewards/meal-container.jpg',
      category: '주방용품',
      brand: '키친웨어',
    },
    emoji: '🥗',
  },
  {
    id: 'team-health-4',
    title: '아침 기상 인증하기',
    description: '팀원들과 함께 아침 기상을 인증해요',
    category: 'health',
    type: 'team',
    difficulty: 'medium',
    defaultDuration: 14,
    verificationType: 'simple_check',
    verificationConfig: {},
    reward: {
      id: 'reward-alarm-clock',
      name: '무드등 알람시계',
      description: '자연 기상을 도와주는 무드등 알람시계',
      imageUrl: '/rewards/alarm-clock.jpg',
      category: '생활용품',
      brand: '라이프스타일',
    },
    emoji: '⏰',
  },

  // 데일리 (4개)
  {
    id: 'team-daily-1',
    title: '칭찬 나누기',
    description: '매일 팀원을 칭찬하며 긍정 에너지를 나눠요',
    category: 'daily',
    type: 'team',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'text_input',
    verificationConfig: {
      placeholder: '팀원에게 전하는 칭찬',
    },
    reward: {
      id: 'reward-card-set',
      name: '감사 카드 세트',
      description: '마음을 전하는 프리미엄 감사 카드',
      imageUrl: '/rewards/card-set.jpg',
      category: '문구용품',
      brand: '페이퍼랩',
    },
    emoji: '🌟',
  },
  {
    id: 'team-daily-2',
    title: '함께 절약하기',
    description: '팀원들과 절약 목표를 공유하고 달성해요',
    category: 'daily',
    type: 'team',
    difficulty: 'medium',
    defaultDuration: 14,
    verificationType: 'receipt_record',
    verificationConfig: {
      placeholder: '오늘 사용한 금액',
      unit: '원',
      maxValue: 10000,
    },
    reward: {
      id: 'reward-piggy-bank',
      name: '스마트 저금통',
      description: '적립 금액을 자동 계산하는 스마트 저금통',
      imageUrl: '/rewards/piggy-bank.jpg',
      category: '생활용품',
      brand: '핀테크',
    },
    emoji: '💵',
  },
  {
    id: 'team-daily-3',
    title: '하루 한 문장 공유하기',
    description: '매일 인상 깊은 문장을 팀원들과 공유해요',
    category: 'daily',
    type: 'team',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'text_input',
    verificationConfig: {
      placeholder: '오늘의 문장을 공유해주세요',
    },
    reward: {
      id: 'reward-bookmark',
      name: '가죽 북마크 세트',
      description: '고급 가죽으로 만든 프리미엄 북마크',
      imageUrl: '/rewards/bookmark.jpg',
      category: '문구용품',
      brand: '레더웍스',
    },
    emoji: '📖',
  },
  {
    id: 'team-daily-4',
    title: '오늘 하루 목표 나누기',
    description: '매일 하루 목표를 팀원들과 공유하고 응원해요',
    category: 'daily',
    type: 'team',
    difficulty: 'easy',
    defaultDuration: 14,
    verificationType: 'text_input',
    verificationConfig: {
      placeholder: '오늘의 목표를 적어주세요',
    },
    reward: {
      id: 'reward-planner',
      name: '위클리 플래너',
      description: '목표 달성을 도와주는 위클리 플래너',
      imageUrl: '/rewards/planner.jpg',
      category: '문구용품',
      brand: '페이퍼랩',
    },
    emoji: '🎯',
  },
];

// 전체 루틴 데이터
export const allRoutines: RoutineTemplate[] = [...individualRoutines, ...teamRoutines];

// 카테고리별 루틴 필터링
export function getRoutinesByCategory(
  category: CategoryType,
  type?: RoutineType
): RoutineTemplate[] {
  const routines = type === 'team' ? teamRoutines : individualRoutines;
  return routines.filter((r) => r.category === category);
}

// 루틴 ID로 조회
export function getRoutineById(id: string): RoutineTemplate | undefined {
  return allRoutines.find((r) => r.id === id);
}

// 카테고리 정보
export const categoryInfo: Record<CategoryType, { name: string; emoji: string; title: string; subtitle: string }> = {
  care: {
    name: '케어',
    emoji: '💝',
    title: '소중한 이들을 위한 케어,',
    subtitle: '도전하고 리워드 받으세요!',
  },
  health: {
    name: '헬스',
    emoji: '💪',
    title: '활력 넘치는 건강 습관,',
    subtitle: '도전하고 리워드 받으세요!',
  },
  daily: {
    name: '데일리',
    emoji: '✨',
    title: '특별한 일상을 만드는 습관,',
    subtitle: '도전하고 리워드 받으세요!',
  },
};

// 난이도 설정
export const difficultyConfig: Record<
  'easy' | 'medium' | 'hard',
  { label: string; color: string; bgColor: string }
> = {
  easy: { label: '난이도 하', color: '#00C853', bgColor: '#E8F5E9' },
  medium: { label: '난이도 중', color: '#FF9100', bgColor: '#FFF3E0' },
  hard: { label: '난이도 상', color: '#F04251', bgColor: '#FFEBEE' },
};
