import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../shared/api/supabase';
import { formatDateTime, getRewardStatusLabel } from '../shared/lib/format';
import DataTable from '../shared/ui/DataTable';
import Pagination from '../shared/ui/Pagination';
import StatusBadge from '../shared/ui/StatusBadge';
import Modal from '../shared/ui/Modal';
import Spinner from '../shared/ui/Spinner';
import type { Column } from '../shared/ui/DataTable';
import type { DbUserRewardJoined, RewardStatus } from '../shared/api/types';

const PAGE_SIZE = 20;

const STATUS_TRANSITIONS: Record<string, RewardStatus> = {
  APPLY: 'SHIPPING',
  SHIPPING: 'DELIVERED',
};

export default function RewardsPage() {
  const [rewards, setRewards] = useState<DbUserRewardJoined[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [confirmTarget, setConfirmTarget] = useState<DbUserRewardJoined | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadRewards = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('user_rewards')
      .select(
        '*, users(nickname), campaign_participations(status, campaigns(title, emoji, reward_name))',
        { count: 'exact' }
      )
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (filter !== 'ALL') {
      query = query.eq('status', filter);
    }

    const { data, count } = await query;
    setRewards((data as DbUserRewardJoined[]) ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, filter]);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  async function handleStatusChange() {
    if (!confirmTarget) return;
    const nextStatus = STATUS_TRANSITIONS[confirmTarget.status];
    if (!nextStatus) return;

    setUpdating(true);
    const updateData: Record<string, unknown> = { status: nextStatus };
    if (nextStatus === 'SHIPPING') updateData.shipped_at = new Date().toISOString();
    if (nextStatus === 'DELIVERED') updateData.delivered_at = new Date().toISOString();

    await supabase.from('user_rewards').update(updateData).eq('id', confirmTarget.id);
    setUpdating(false);
    setConfirmTarget(null);
    loadRewards();
  }

  const columns: Column<DbUserRewardJoined>[] = [
    {
      key: 'user',
      header: '사용자',
      render: (row) => <span className="font-medium">{row.users?.nickname ?? '-'}</span>,
    },
    {
      key: 'campaign',
      header: '캠페인',
      render: (row) => {
        const campaign = row.campaign_participations?.campaigns;
        return campaign ? `${campaign.emoji} ${campaign.title}` : '-';
      },
    },
    {
      key: 'reward',
      header: '리워드',
      render: (row) => row.campaign_participations?.campaigns?.reward_name ?? '-',
    },
    {
      key: 'status',
      header: '상태',
      render: (row) => (
        <StatusBadge status={row.status} label={getRewardStatusLabel(row.status)} />
      ),
    },
    {
      key: 'updated_at',
      header: '최종 업데이트',
      render: (row) => (
        <span className="text-gray-500">{formatDateTime(row.updated_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      render: (row) => {
        const nextStatus = STATUS_TRANSITIONS[row.status];
        if (!nextStatus) return null;
        return (
          <button
            onClick={() => setConfirmTarget(row)}
            className="rounded-lg px-3 py-1 text-xs font-medium text-[#5B5CF9] hover:bg-[#5B5CF9]/10"
          >
            {getRewardStatusLabel(nextStatus)}으로 변경
          </button>
        );
      },
    },
  ];

  const FILTER_OPTIONS = [
    { value: 'ALL', label: '전체' },
    { value: 'APPLY', label: '신청' },
    { value: 'SHIPPING', label: '배송중' },
    { value: 'DELIVERED', label: '배송완료' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">리워드 관리</h1>
        <span className="text-sm text-gray-500">총 {total}건</span>
      </div>

      <div className="mb-4 flex gap-2">
        {FILTER_OPTIONS.map((opt) => (
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
        <>
          <DataTable columns={columns} data={rewards} keyExtractor={(r) => r.id} />
          <Pagination
            page={page}
            totalPages={Math.ceil(total / PAGE_SIZE)}
            onPageChange={setPage}
          />
        </>
      )}

      <Modal
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        title="상태 변경 확인"
        footer={
          <>
            <button
              onClick={() => setConfirmTarget(null)}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleStatusChange}
              disabled={updating}
              className="rounded-lg bg-[#5B5CF9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A4BE8] disabled:opacity-50"
            >
              {updating ? '처리 중...' : '확인'}
            </button>
          </>
        }
      >
        {confirmTarget && (
          <p className="text-sm text-gray-700">
            <strong>{confirmTarget.users?.nickname}</strong>님의 리워드 상태를{' '}
            <strong>{getRewardStatusLabel(confirmTarget.status)}</strong>에서{' '}
            <strong>{getRewardStatusLabel(STATUS_TRANSITIONS[confirmTarget.status])}</strong>
            (으)로 변경하시겠습니까?
          </p>
        )}
      </Modal>
    </div>
  );
}
