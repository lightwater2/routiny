import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../shared/api/supabase';
import {
  formatDate,
  getDifficultyLabel,
  getCategoryLabel,
  getCampaignStatusLabel,
  getVerificationTypeLabel,
} from '../shared/lib/format';
import DataTable from '../shared/ui/DataTable';
import StatusBadge from '../shared/ui/StatusBadge';
import Modal from '../shared/ui/Modal';
import Spinner from '../shared/ui/Spinner';
import type { Column } from '../shared/ui/DataTable';
import type { DbCampaign } from '../shared/api/types';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'draft', label: '초안' },
  { value: 'published', label: '모집중' },
  { value: 'active', label: '진행중' },
  { value: 'ended', label: '종료' },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<DbCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // 상태 전환 모달
  const [actionTarget, setActionTarget] = useState<DbCampaign | null>(null);
  const [actionType, setActionType] = useState<'publish' | 'unpublish' | 'end' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // 편집 모달
  const [editing, setEditing] = useState<DbCampaign | null>(null);
  const [form, setForm] = useState({ title: '', description: '', difficulty: '', emoji: '', is_featured: false });
  const [saving, setSaving] = useState(false);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'ALL') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    setCampaigns((data as DbCampaign[]) ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  // 상태 전환 액션
  function openAction(campaign: DbCampaign, type: 'publish' | 'unpublish' | 'end') {
    setActionTarget(campaign);
    setActionType(type);
  }

  async function handleAction() {
    if (!actionTarget || !actionType) return;
    setActionLoading(true);

    try {
      if (actionType === 'publish') {
        await supabase
          .from('campaigns')
          .update({ status: 'published', published_at: new Date().toISOString() })
          .eq('id', actionTarget.id);
      } else if (actionType === 'unpublish') {
        // 참여자 확인
        const { count } = await supabase
          .from('campaign_participations')
          .select('*', { count: 'exact', head: true })
          .eq('campaign_id', actionTarget.id);

        if (count && count > 0) {
          alert('참여자가 있는 캠페인은 발행 취소할 수 없습니다.');
          setActionLoading(false);
          setActionTarget(null);
          setActionType(null);
          return;
        }
        await supabase
          .from('campaigns')
          .update({ status: 'draft', published_at: null })
          .eq('id', actionTarget.id);
      } else if (actionType === 'end') {
        await supabase
          .from('campaigns')
          .update({ status: 'ended' })
          .eq('id', actionTarget.id);
      }
    } catch (err) {
      console.error('상태 변경 실패:', err);
    }

    setActionLoading(false);
    setActionTarget(null);
    setActionType(null);
    loadCampaigns();
  }

  // 편집
  function openEdit(c: DbCampaign) {
    setEditing(c);
    setForm({
      title: c.title,
      description: c.description,
      difficulty: c.difficulty,
      emoji: c.emoji,
      is_featured: c.is_featured,
    });
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    await supabase
      .from('campaigns')
      .update({
        title: form.title,
        description: form.description,
        difficulty: form.difficulty,
        emoji: form.emoji,
        is_featured: form.is_featured,
      })
      .eq('id', editing.id);

    setSaving(false);
    setEditing(null);
    loadCampaigns();
  }

  const actionMessages: Record<string, { title: string; desc: string; btn: string }> = {
    publish: {
      title: '캠페인 발행',
      desc: '발행하면 핵심 정보(기간, 인증, 리워드)를 수정할 수 없습니다. 발행하시겠습니까?',
      btn: '발행하기',
    },
    unpublish: {
      title: '발행 취소',
      desc: '참여자가 없는 경우에만 취소 가능합니다. 초안 상태로 돌아갑니다.',
      btn: '발행 취소',
    },
    end: {
      title: '캠페인 종료',
      desc: '종료하면 모든 참여자가 강제 종료됩니다. 이 작업은 되돌릴 수 없습니다.',
      btn: '종료하기',
    },
  };

  const columns: Column<DbCampaign>[] = [
    {
      key: 'emoji',
      header: '',
      width: '48px',
      render: (row) => <span className="text-xl">{row.emoji}</span>,
    },
    {
      key: 'title',
      header: '캠페인명',
      render: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      key: 'status',
      header: '상태',
      render: (row) => (
        <StatusBadge status={row.status} label={getCampaignStatusLabel(row.status)} />
      ),
    },
    {
      key: 'category',
      header: '카테고리',
      render: (row) => getCategoryLabel(row.category),
    },
    {
      key: 'difficulty',
      header: '난이도',
      render: (row) => getDifficultyLabel(row.difficulty),
    },
    {
      key: 'type',
      header: '유형',
      render: (row) => (row.type === 'individual' ? '개인' : '팀'),
    },
    {
      key: 'period',
      header: '기간',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {formatDate(row.start_date)} ~ {formatDate(row.end_date)}
        </span>
      ),
    },
    {
      key: 'participants',
      header: '참여자',
      render: (row) => (
        <span>
          {row.current_participants}
          {row.max_participants && <span className="text-gray-400">/{row.max_participants}</span>}
        </span>
      ),
    },
    {
      key: 'reward',
      header: '리워드',
      render: (row) => row.reward_name,
    },
    {
      key: 'verification',
      header: '인증',
      render: (row) => getVerificationTypeLabel(row.verification_type),
    },
    {
      key: 'actions',
      header: '',
      width: '180px',
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => openEdit(row)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-[#5B5CF9] hover:bg-[#5B5CF9]/10"
          >
            편집
          </button>
          {row.status === 'draft' && (
            <button
              onClick={() => openAction(row, 'publish')}
              className="rounded-lg px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50"
            >
              발행
            </button>
          )}
          {row.status === 'published' && (
            <>
              <button
                onClick={() => openAction(row, 'unpublish')}
                className="rounded-lg px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={() => openAction(row, 'end')}
                className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
              >
                종료
              </button>
            </>
          )}
          {row.status === 'active' && (
            <button
              onClick={() => openAction(row, 'end')}
              className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
            >
              종료
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">캠페인 관리</h1>
        <span className="text-sm text-gray-500">총 {campaigns.length}개</span>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        {STATUS_FILTERS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === opt.value
                ? 'bg-[#5B5CF9] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <DataTable columns={columns} data={campaigns} keyExtractor={(r) => r.id} />
      )}

      {/* Action Confirm Modal */}
      {actionType && (
        <Modal
          open={!!actionTarget}
          onClose={() => { setActionTarget(null); setActionType(null); }}
          title={actionMessages[actionType].title}
          footer={
            <>
              <button
                onClick={() => { setActionTarget(null); setActionType(null); }}
                className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                  actionType === 'end' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#5B5CF9] hover:bg-[#4A4BE8]'
                }`}
              >
                {actionLoading ? '처리 중...' : actionMessages[actionType].btn}
              </button>
            </>
          }
        >
          <p className="text-sm text-gray-700">{actionMessages[actionType].desc}</p>
        </Modal>
      )}

      {/* Edit Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="캠페인 편집 (수정 가능 항목)"
        footer={
          <>
            <button
              onClick={() => setEditing(null)}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#5B5CF9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A4BE8] disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-20">
              <label className="mb-1 block text-sm font-medium text-gray-700">이모지</label>
              <input
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-center text-lg outline-none focus:border-[#5B5CF9]"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">제목</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#5B5CF9]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">설명</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#5B5CF9]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">난이도</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#5B5CF9]"
            >
              <option value="easy">쉬움</option>
              <option value="medium">보통</option>
              <option value="hard">어려움</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-4 w-4 rounded accent-[#5B5CF9]"
            />
            <label htmlFor="is_featured" className="text-sm text-gray-700">Featured</label>
          </div>

          {editing && editing.status !== 'draft' && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-2 text-xs font-semibold text-gray-400">핵심 정보 (수정 불가)</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p>기간: {formatDate(editing.start_date)} ~ {formatDate(editing.end_date)} ({editing.target_days}일)</p>
                <p>인증: {getVerificationTypeLabel(editing.verification_type)}</p>
                <p>달성 기준: {editing.achievement_rate}%</p>
                <p>리워드: {editing.reward_name}</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
