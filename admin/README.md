# Routiny Admin Dashboard

캠페인 관리를 위한 어드민 대시보드입니다.

**배포 URL**: https://planders-ai.github.io/routiny/

---

## 환경 설정

### 환경 변수

`.env.example`을 복사하여 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=your-admin-password
```

### 로컬 실행

```bash
cd admin
npm install
npm run dev      # http://localhost:5173/routiny/
```

### 빌드

```bash
npm run build    # dist/ 폴더에 생성
npm run preview  # 빌드 결과 미리보기
```

---

## 배포

GitHub Pages로 자동 배포됩니다.

- **트리거 조건**: `admin/**` 경로 파일이 `main` 브랜치에 push될 때
- **수동 트리거**: GitHub Actions > Deploy Admin Dashboard > Run workflow
- **필요한 Secrets** (GitHub repo Settings > Secrets):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_ADMIN_PASSWORD`

---

## 페이지별 가이드

### 로그인 (`#/login`)

- `VITE_ADMIN_PASSWORD`에 설정된 비밀번호로 인증
- 세션 스토리지 기반 (탭을 닫으면 로그아웃)

### 대시보드 (`#/`)

5개 핵심 지표를 한눈에 확인합니다.

| 지표 | 설명 |
|------|------|
| 총 사용자 | 전체 가입 사용자 수 |
| 활성 캠페인 | published + active 상태 캠페인 수 |
| 참여 중 | active 상태 참여 수 |
| 오늘 체크인 | 오늘 날짜 체크인 수 |
| 리워드 신청 | APPLY 상태 리워드 수 |

하단의 바 차트는 최근 7일간 체크인 현황을 표시합니다.

### 캠페인 관리 (`#/campaigns`)

#### 캠페인 목록

- 상태별 필터: 전체 / 초안 / 모집중 / 진행중 / 종료
- 각 행에 이모지, 캠페인명, 상태, 카테고리, 난이도, 유형, 기간, 참여자 수, 리워드, 인증 방식 표시

#### 캠페인 생성 (`#/campaigns/new`)

우측 상단 `+ 새 캠페인` 버튼을 클릭하면 생성 폼으로 이동합니다.

**기본 정보**
- 이모지, 캠페인명, 설명
- 카테고리 (케어/헬스/데일리), 세부 카테고리 (케어 선택 시 아기/반려동물/시니어)
- 유형 (개인/팀), 난이도 (쉬움/보통/어려움)
- Featured 여부 (메인 노출)

**기간 설정**
- 시작일, 종료일 (날짜 선택)
- 목표 일수 (날짜 선택 시 자동 계산, 수동 수정 가능)

**인증 & 달성 조건**
- 인증 방식: 단순 체크 / 텍스트 입력 / 사진 인증 / 숫자 입력 / 시간 기록 / 영수증 기록
- 달성 기준 (1~100%)
- 최대 참여 인원 (비워두면 무제한)

**리워드**
- 리워드명, 카테고리, 설명 (필수)
- 브랜드, 이미지 URL (선택)

생성하면 **초안(draft)** 상태로 저장됩니다.

#### 캠페인 상태 전환

```
draft (초안)
  ├─ [발행] → published (모집중)
  │               ├─ [취소] → draft (참여자 0명일 때만)
  │               └─ [종료] → ended
  │
  └─ (시작일 도래 시 자동) → active (진행중)
                                 └─ [종료] → ended
```

| 액션 | 조건 | 설명 |
|------|------|------|
| 발행 | draft 상태 | 모집을 시작합니다. **발행 후 핵심 정보(기간, 인증, 리워드)는 수정 불가** |
| 발행 취소 | published + 참여자 0명 | 초안으로 되돌립니다 |
| 종료 | published 또는 active | 캠페인을 종료합니다 (되돌릴 수 없음) |

#### 캠페인 편집

각 행의 `편집` 버튼으로 수정 가능한 필드를 편집합니다.

- **항상 수정 가능**: 이모지, 제목, 설명, 난이도, Featured
- **draft에서만 수정 가능**: 기간, 인증 방식, 달성 기준, 리워드 (생성 페이지에서 수정)
- **published 이후**: 위 핵심 정보는 읽기 전용으로 표시

### 사용자 관리 (`#/users`)

- 닉네임, 디바이스 ID, 캠페인 참여 수, 가입일 표시
- 페이지네이션 (20건 단위)

### 리워드 관리 (`#/rewards`)

- 상태별 필터: 전체 / 신청 / 배송중 / 배송완료
- 사용자, 캠페인, 리워드명, 상태, 최종 업데이트 표시
- 상태 전환: 신청 → 배송중 → 배송완료

---

## 캠페인 운영 워크플로우

### 1. 캠페인 기획 & 생성

1. `캠페인 관리` > `+ 새 캠페인`
2. 모든 필드를 입력하고 `캠페인 생성 (초안)` 클릭
3. 초안 상태에서 내용 검토 및 수정

### 2. 캠페인 발행

1. 초안 캠페인의 `발행` 버튼 클릭
2. "발행하면 핵심 정보를 수정할 수 없습니다" 경고 확인
3. `발행하기` 클릭 → 모집중 상태로 전환
4. 사용자 앱에 캠페인 노출 시작

### 3. 캠페인 진행

- 시작일이 되면 active 상태로 전환
- 대시보드에서 체크인 현황 모니터링
- 필요시 부가 정보 (제목, 설명 등) 수정 가능

### 4. 캠페인 종료 & 리워드

- 종료일 도래 또는 수동 종료
- `리워드 관리`에서 신청 건 확인
- 신청 → 배송중 → 배송완료 순서로 상태 변경

---

## DB 스키마

### campaigns

| 컬럼 | 타입 | 설명 | 불변 |
|------|------|------|------|
| id | uuid | PK | - |
| title | text | 캠페인명 | |
| description | text | 설명 | |
| category | text | care/health/daily | O |
| sub_category | text | baby/pet/senior (nullable) | O |
| type | text | individual/team | O |
| difficulty | text | easy/medium/hard | |
| emoji | text | 이모지 | |
| start_date | date | 시작일 | O |
| end_date | date | 종료일 | O |
| target_days | integer | 목표 일수 | O |
| verification_type | text | 인증 방식 | O |
| verification_config | jsonb | 인증 설정 | O |
| achievement_rate | integer | 달성 기준 (%) | O |
| reward_name | text | 리워드명 | O |
| reward_description | text | 리워드 설명 | O |
| reward_image_url | text | 리워드 이미지 (nullable) | O |
| reward_category | text | 리워드 카테고리 | O |
| reward_brand | text | 리워드 브랜드 (nullable) | O |
| max_participants | integer | 최대 참여 인원 (nullable) | O |
| current_participants | integer | 현재 참여자 수 | - |
| is_featured | boolean | 메인 노출 여부 | |
| status | text | draft/published/active/ended | - |
| published_at | timestamptz | 발행 시각 (nullable) | - |

> **불변(O)**: 발행 후 수정 불가. 빈 칸은 언제든 수정 가능.

### campaign_participations

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| user_id | uuid | FK → users |
| campaign_id | uuid | FK → campaigns |
| completed_days | integer | 완료 일수 |
| status | text | active/completed/abandoned/force_ended |
| notification_enabled | boolean | 알림 설정 |
| notification_time | time | 알림 시각 (nullable) |

---

## 기술 스택

- React 19 + TypeScript
- Vite 7 (빌드)
- Tailwind CSS v4 (스타일링)
- React Router v7 (HashRouter)
- Supabase JS v2 (DB 쿼리)
- Recharts (차트)
- GitHub Pages (배포)
