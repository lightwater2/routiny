# 루티니 (Routiny) - 토스 미니앱

생활 루틴을 실천하면, 진짜 보상이 따라오는 루틴 플랫폼

## 서비스 개요

사용자가 직접 설정한 루틴을 일정 기간 동안 성공하면, 해당 루틴에 딱 맞는 실물 리워드를 받을 수 있는 서비스입니다.

### MVP 목표
```
루틴 템플릿 기반으로 개인/팀 루틴 생성 → 체크인 → 달성률 계산 → 리워드 잠금해제까지 완결
```

---

## 기술 스택

- **Frontend**: React 19 + TypeScript
- **Architecture**: FSD (Feature-Sliced Design) 패턴
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Auth, Database, Storage)
- **Native Wrapper**: Capacitor
- **Platform**: 토스 미니앱

### 브랜드 컬러
- **Primary**: `#5B5CF9` (Purple)
- **Primary Hover**: `#4A4BE8`
- **Primary Light**: `#F0F0FF`

---

## 프로젝트 구조 (FSD)

```
src/
├── app/                    # 앱 설정, 라우팅, 프로바이더
│   ├── index.tsx          # 메인 앱 엔트리
│   └── router.tsx         # React Router 설정
├── pages/                  # 페이지 컴포넌트
│   ├── StartPage.tsx      # 루틴 타입 선택 (개인/팀)
│   ├── CategoryPage.tsx   # 카테고리 선택
│   ├── RoutineListPage.tsx # 루틴 목록
│   └── RoutineDetailPage.tsx # 루틴 상세
├── features/               # 비즈니스 로직 기능 (추가 예정)
├── entities/               # 도메인 엔티티 (추가 예정)
├── shared/                 # 공유 리소스
│   ├── ui/                # UI 컴포넌트 (25개)
│   │   ├── index.ts
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── api/               # API 클라이언트
│   │   └── supabase.ts
│   ├── lib/               # 유틸리티
│   └── types/             # 타입 정의
│       └── index.ts
├── styles/
│   ├── index.css
│   └── design-tokens.css   # 디자인 토큰
└── main.tsx
```

---

## 화면 흐름

```
StartPage (루틴 유형 선택)
    ↓
CategoryPage (카테고리 선택: 케어/헬스/데일리)
    ↓
RoutineListPage (루틴 목록)
    ↓
RoutineDetailPage (루틴 상세 + 시작)
```

---

## 구현된 UI 컴포넌트 (shared/ui)

| 카테고리 | 컴포넌트 |
|---------|---------|
| 입력 | TextField, NumberInput, SearchBar, Select, Checkbox, Switch, Stepper |
| 선택 | Tab, SegmentedControl, Rating |
| 피드백 | Toast, Dialog, BottomSheet, Loader, ProgressBar, Skeleton |
| 표시 | Badge, Card, ListItem, EmptyState, ProductCard, Profile |
| 레이아웃 | Accordion, Calendar |

---

## Supabase 설정

### 환경 변수 (.env)
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 예상 테이블 구조
```sql
-- users (Supabase Auth와 연동)
-- routines (루틴 정보)
-- check_ins (체크인 기록)
-- rewards (리워드 정보)
-- user_rewards (사용자 리워드 상태)
```

---

## 타입 정의 (shared/types)

```typescript
// 루틴 유형
type RoutineType = 'individual' | 'team';

// 카테고리
type CategoryType = 'care' | 'health' | 'daily';

// 난이도
type DifficultyLevel = 'easy' | 'medium' | 'hard';

// 리워드 상태
type RewardStatus = 'LOCK' | 'PROGRESS' | 'UNLOCK' | 'APPLY' | 'SHIPPING';
```

---

## 명령어

```bash
npm run dev        # 개발 서버 실행 (http://localhost:5173)
npm run build      # 프로덕션 빌드 (dist/ 폴더에 생성)
npm run build:ait  # AIT 패키지 빌드 → my-miniapp-rutini.ait 생성
npm run deploy:ait # AIT 빌드 + 토스에 배포
npm run preview    # 빌드 미리보기
npm run lint       # ESLint 실행
```

---

## 토스 인앱(미니앱) 빌드 - 중요!

> **이 앱은 토스 인앱(미니앱)으로 배포됩니다. 모든 빌드와 테스트는 토스 미니앱 환경을 기준으로 합니다.**

### 빌드 프로세스

```bash
# 1. AIT 패키지 빌드 (가장 중요!)
npm run build:ait
# → my-miniapp-rutini.ait 파일 생성

# 2. 토스에 배포
npm run deploy:ait
# 또는 토스 개발자센터에서 .ait 파일 직접 업로드
```

**빌드 결과물:**
- `dist/` - 웹 정적 파일
- `my-miniapp-rutini.ait` - 토스 인앱 배포용 패키지

### 토스 미니앱 고려사항

- **Safe Area**: 토스 앱 내 상/하단 영역 고려 (AppLayout에서 처리)
- **네비게이션**: 토스 앱의 뒤로가기 제스처와 호환
- **인증**: 토스 계정 연동 (Supabase Auth 대신 토스 OAuth 사용 예정)
- **결제/송금**: 토스페이 API 연동 가능
- **딥링크**: `toss://` 스킴 지원

### Capacitor 설정

```bash
# Capacitor 초기화
npm install @capacitor/core @capacitor/cli
npx cap init

# 플랫폼 추가
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# 빌드 후 네이티브 프로젝트 동기화
npm run build
npx cap sync

# iOS 시뮬레이터 실행
npx cap run ios

# Android 에뮬레이터 실행
npx cap run android
```

### 토스 미니앱 SDK (예정)

```bash
# 토스 미니앱 SDK 설치
npm install @tosspayments/mini-app-sdk

# 또는 토스 제공 SDK
npm install toss-mini-app
```

### 배포 체크리스트

- [ ] `npm run build` 성공
- [ ] `npx cap sync` 완료
- [ ] 토스 개발자센터에 앱 등록
- [ ] 토스 미니앱 심사 제출

---

## 개발 원칙

### 1. 토스 인앱 빌드 우선 (최우선!)
- **모든 기능은 토스 미니앱 환경에서 동작해야 함**
- 코드 변경 후 반드시 `npm run build` 성공 확인
- 웹 브라우저 테스트 후 Capacitor 동기화 필수
- 토스 앱 내 Safe Area, 제스처, 네비게이션 고려

### 2. FSD 아키텍처 준수
- **app**: 앱 전역 설정만
- **pages**: 라우트별 페이지 컴포넌트
- **features**: 비즈니스 로직 기능 단위
- **entities**: 도메인 모델
- **shared**: 공유 UI, API, 유틸리티

### 3. 토스 UX 준수
- 모든 UI는 토스 디자인 시스템(TDS) 기반
- Primary 컬러는 `#5B5CF9` (보라색) 사용

### 4. MVP 우선
- 핵심 플로우 먼저 구현 (루틴 생성 → 체크인 → 달성률 → 리워드)
- 복잡한 기능은 단순화 (앱 연동 → 수동 입력으로 대체)

### 5. 컴포넌트 재사용
- `src/shared/ui/` 의 공통 컴포넌트 적극 활용
- 새 컴포넌트 필요시 기존 패턴 따르기

---

## 참고 문서

- [기획서 PDF](./토스%20미니앱-루티니_루틴%20카테고리%20구성_260102.pdf)
- [목업 이미지](./mockup/)
