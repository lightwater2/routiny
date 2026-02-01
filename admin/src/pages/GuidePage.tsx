export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-xl font-bold text-gray-900">사용 가이드</h1>

      {/* 캠페인 상태 흐름 */}
      <Section title="캠페인 상태 흐름">
        <div className="flex items-center gap-2 text-sm">
          <StatusBox label="초안" color="gray" />
          <Arrow />
          <StatusBox label="모집중" color="purple" />
          <Arrow />
          <StatusBox label="진행중" color="green" />
          <Arrow />
          <StatusBox label="종료" color="gray" />
        </div>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-400">
              <th className="pb-2 pr-4 font-medium">액션</th>
              <th className="pb-2 pr-4 font-medium">조건</th>
              <th className="pb-2 font-medium">설명</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b border-gray-50">
              <td className="py-2.5 pr-4 font-medium text-green-600">발행</td>
              <td className="py-2.5 pr-4">초안 상태</td>
              <td className="py-2.5">모집을 시작합니다. 발행 후 핵심 정보는 수정할 수 없습니다.</td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2.5 pr-4 font-medium text-gray-500">발행 취소</td>
              <td className="py-2.5 pr-4">모집중 + 참여자 0명</td>
              <td className="py-2.5">초안으로 되돌립니다. 참여자가 있으면 취소 불가.</td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-medium text-red-500">종료</td>
              <td className="py-2.5 pr-4">모집중 또는 진행중</td>
              <td className="py-2.5">캠페인을 즉시 종료합니다. 되돌릴 수 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* 캠페인 생성 */}
      <Section title="캠페인 만들기">
        <Steps
          items={[
            {
              title: '캠페인 관리 > + 새 캠페인',
              desc: '사이드바에서 캠페인 관리로 이동한 뒤, 우측 상단의 버튼을 클릭합니다.',
            },
            {
              title: '정보 입력',
              desc: '기본 정보, 기간, 인증 방식, 리워드를 모두 채웁니다. 이모지, 캠페인명, 리워드명은 필수입니다.',
            },
            {
              title: '초안 저장',
              desc: '하단의 "캠페인 생성 (초안)" 버튼을 누르면 초안 상태로 저장됩니다. 바로 발행되지 않습니다.',
            },
            {
              title: '검토 후 발행',
              desc: '캠페인 목록에서 내용을 확인한 뒤 "발행" 버튼으로 모집을 시작합니다.',
            },
          ]}
        />
      </Section>

      {/* 수정 가능 범위 */}
      <Section title="수정 가능 범위">
        <p className="mb-3 text-sm text-gray-500">
          발행 전(초안)에는 모든 항목을 수정할 수 있습니다. 발행 후에는 아래 규칙이 적용됩니다.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-gray-100 bg-white p-4">
            <p className="mb-2 text-xs font-semibold text-green-600">항상 수정 가능</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>제목 / 설명</li>
              <li>이모지</li>
              <li>난이도</li>
              <li>Featured 여부</li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-100 bg-white p-4">
            <p className="mb-2 text-xs font-semibold text-red-500">발행 후 수정 불가</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>시작일 / 종료일 / 목표 일수</li>
              <li>인증 방식</li>
              <li>달성 기준 (%)</li>
              <li>리워드 정보 전체</li>
              <li>카테고리 / 유형</li>
              <li>최대 참여 인원</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 템플릿 관리 */}
      <Section title="템플릿이란?">
        <p className="text-sm text-gray-700">
          템플릿은 날짜를 제외한 캠페인 설정의 스냅샷입니다. 반복적으로 생성하는 캠페인의 기본 정보를 미리 저장해두고, 필요할 때 날짜만 지정하여 캠페인 초안을 빠르게 만들 수 있습니다.
        </p>
        <div className="mt-3 rounded-lg border border-gray-100 bg-white p-4">
          <p className="mb-2 text-xs font-semibold text-[#5B5CF9]">템플릿에 포함되는 정보</p>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>기본 정보 (이모지, 제목, 설명, 카테고리, 유형, 난이도)</li>
            <li>인증 조건 (인증 방식, 달성 기준, 최대 참여 인원)</li>
            <li>리워드 (리워드명, 설명, 카테고리, 브랜드, 이미지)</li>
            <li>기본 목표 일수, Featured 여부</li>
          </ul>
        </div>
      </Section>

      {/* 템플릿에서 캠페인 만들기 */}
      <Section title="템플릿에서 캠페인 만들기">
        <Steps
          items={[
            {
              title: '템플릿 관리 페이지 이동',
              desc: '사이드바에서 "템플릿 관리"를 클릭합니다.',
            },
            {
              title: '캠페인 만들기 클릭',
              desc: '원하는 템플릿의 "캠페인 만들기" 버튼을 클릭합니다.',
            },
            {
              title: '날짜 입력',
              desc: '시작일과 종료일만 입력합니다. 목표 일수는 자동 계산됩니다.',
            },
            {
              title: '초안 생성 완료',
              desc: '캠페인이 초안 상태로 생성되며 캠페인 목록으로 이동합니다.',
            },
          ]}
        />
      </Section>

      {/* 캠페인에서 템플릿 저장 */}
      <Section title="캠페인 생성 시 템플릿으로 저장">
        <Steps
          items={[
            {
              title: '캠페인 생성 폼에서 정보 입력',
              desc: '캠페인 관리 > + 새 캠페인에서 정보를 입력합니다.',
            },
            {
              title: '"템플릿으로 저장" 클릭',
              desc: '폼 하단 좌측의 "템플릿으로 저장" 버튼을 클릭합니다.',
            },
            {
              title: '템플릿 이름 입력',
              desc: '관리용 이름을 입력하고 저장합니다. 날짜 정보는 제외됩니다.',
            },
          ]}
        />
      </Section>

      {/* 리워드 처리 */}
      <Section title="리워드 처리">
        <Steps
          items={[
            {
              title: '캠페인 종료 후 달성자 리워드 신청',
              desc: '달성 기준을 충족한 참여자가 앱에서 리워드를 신청하면 "신청" 상태로 접수됩니다.',
            },
            {
              title: '신청 → 배송중',
              desc: '리워드 관리에서 신청 건을 확인하고 "배송중으로 변경" 버튼을 클릭합니다.',
            },
            {
              title: '배송중 → 배송완료',
              desc: '실제 배송이 완료되면 "배송완료로 변경" 버튼을 클릭하여 마무리합니다.',
            },
          ]}
        />
        <div className="mt-3 flex items-center gap-2 text-sm">
          <StatusBox label="신청" color="orange" />
          <Arrow />
          <StatusBox label="배송중" color="blue" />
          <Arrow />
          <StatusBox label="배송완료" color="green" />
        </div>
      </Section>

      {/* 대시보드 */}
      <Section title="대시보드 지표">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-400">
              <th className="pb-2 pr-4 font-medium">지표</th>
              <th className="pb-2 font-medium">설명</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {[
              ['총 사용자', '가입한 전체 사용자 수'],
              ['활성 캠페인', '모집중 + 진행중 상태 캠페인 수'],
              ['참여 중', '현재 active 상태인 참여 수'],
              ['오늘 체크인', '오늘 날짜에 기록된 체크인 수'],
              ['리워드 신청', '신청(APPLY) 상태인 리워드 수'],
            ].map(([label, desc]) => (
              <tr key={label} className="border-b border-gray-50">
                <td className="py-2.5 pr-4 font-medium">{label}</td>
                <td className="py-2.5">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-gray-400">
          하단 차트는 최근 7일간의 일별 체크인 수를 보여줍니다.
        </p>
      </Section>

      {/* 인증 방식 */}
      <Section title="인증 방식 안내">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-400">
              <th className="pb-2 pr-4 font-medium">방식</th>
              <th className="pb-2 font-medium">사용자 행동</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {[
              ['단순 체크', '버튼 탭으로 완료 체크'],
              ['텍스트 입력', '일기, 감상 등 텍스트 작성'],
              ['사진 인증', '사진/스크린샷 업로드'],
              ['숫자 입력', '걸음수, 시간 등 수치 기록'],
              ['시간 기록', '시작/종료 시간 기록'],
              ['영수증 기록', '지출 금액 기록'],
            ].map(([label, desc]) => (
              <tr key={label} className="border-b border-gray-50">
                <td className="py-2.5 pr-4 font-medium">{label}</td>
                <td className="py-2.5">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function StatusBox({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[color]}`}>
      {label}
    </span>
  );
}

function Arrow() {
  return <span className="text-gray-300">&rarr;</span>;
}

function Steps({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5B5CF9] text-xs font-bold text-white">
            {i + 1}
          </span>
          <div>
            <p className="text-sm font-medium text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
