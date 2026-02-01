import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../shared/api/supabase';
import {
  getDifficultyLabel,
  getCategoryLabel,
  getVerificationTypeLabel,
} from '../shared/lib/format';
import DataTable from '../shared/ui/DataTable';
import Modal from '../shared/ui/Modal';
import Spinner from '../shared/ui/Spinner';
import type { Column } from '../shared/ui/DataTable';
import type { DbCampaignTemplate } from '../shared/api/types';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<DbCampaignTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // 삭제 확인 모달
  const [deleteTarget, setDeleteTarget] = useState<DbCampaignTemplate | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 캠페인 만들기 모달
  const [campaignTarget, setCampaignTarget] = useState<DbCampaignTemplate | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('campaign_templates')
      .select('*')
      .order('created_at', { ascending: false });
    setTemplates((data as DbCampaignTemplate[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from('campaign_templates').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    loadTemplates();
  }

  async function handleCreateCampaign() {
    if (!campaignTarget) return;
    setCreateError(null);

    if (!startDate || !endDate) {
      setCreateError('시작일과 종료일을 모두 입력해주세요.');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setCreateError('종료일이 시작일보다 이후여야 합니다.');
      return;
    }

    setCreating(true);
    const targetDays =
      Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;

    const { error } = await supabase.from('campaigns').insert({
      title: campaignTarget.title,
      description: campaignTarget.description,
      emoji: campaignTarget.emoji,
      category: campaignTarget.category,
      sub_category: campaignTarget.sub_category,
      type: campaignTarget.type,
      difficulty: campaignTarget.difficulty,
      start_date: startDate,
      end_date: endDate,
      target_days: targetDays,
      verification_type: campaignTarget.verification_type,
      verification_config: campaignTarget.verification_config,
      achievement_rate: campaignTarget.achievement_rate,
      reward_name: campaignTarget.reward_name,
      reward_description: campaignTarget.reward_description,
      reward_image_url: campaignTarget.reward_image_url,
      reward_category: campaignTarget.reward_category,
      reward_brand: campaignTarget.reward_brand,
      max_participants: campaignTarget.max_participants,
      is_featured: campaignTarget.is_featured,
      status: 'draft',
    });

    setCreating(false);
    if (error) {
      setCreateError(`생성 실패: ${error.message}`);
      return;
    }

    setCampaignTarget(null);
    setStartDate('');
    setEndDate('');
    navigate('/campaigns');
  }

  function openCampaignModal(t: DbCampaignTemplate) {
    setCampaignTarget(t);
    setStartDate('');
    setEndDate('');
    setCreateError(null);
  }

  const columns: Column<DbCampaignTemplate>[] = [
    {
      key: 'name',
      header: '템플릿명',
      render: (row) => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    {
      key: 'title',
      header: '캠페인 제목',
      render: (row) => (
        <span>
          {row.emoji} {row.title}
        </span>
      ),
    },
    {
      key: 'category',
      header: '카테고리',
      render: (row) => getCategoryLabel(row.category),
    },
    {
      key: 'type',
      header: '유형',
      render: (row) => (row.type === 'individual' ? '개인' : '팀'),
    },
    {
      key: 'difficulty',
      header: '난이도',
      render: (row) => getDifficultyLabel(row.difficulty),
    },
    {
      key: 'verification',
      header: '인증',
      render: (row) => getVerificationTypeLabel(row.verification_type),
    },
    {
      key: 'reward',
      header: '리워드',
      render: (row) => row.reward_name,
    },
    {
      key: 'actions',
      header: '',
      width: '220px',
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => openCampaignModal(row)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50"
          >
            캠페인 만들기
          </button>
          <button
            onClick={() => navigate(`/templates/${row.id}`)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-[#5B5CF9] hover:bg-[#5B5CF9]/10"
          >
            편집
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      ),
    },
  ];

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#5B5CF9] focus:ring-1 focus:ring-[#5B5CF9]/30';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">템플릿 관리</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">총 {templates.length}개</span>
          <button
            onClick={() => navigate('/templates/new')}
            className="rounded-lg bg-[#5B5CF9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A4BE8]"
          >
            + 새 템플릿
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <DataTable columns={columns} data={templates} keyExtractor={(r) => r.id} />
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="템플릿 삭제"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-700">
          "{deleteTarget?.name}" 템플릿을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
      </Modal>

      {/* 캠페인 만들기 모달 */}
      <Modal
        open={!!campaignTarget}
        onClose={() => setCampaignTarget(null)}
        title="템플릿에서 캠페인 만들기"
        footer={
          <>
            <button
              onClick={() => setCampaignTarget(null)}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleCreateCampaign}
              disabled={creating}
              className="rounded-lg bg-[#5B5CF9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4A4BE8] disabled:opacity-50"
            >
              {creating ? '생성 중...' : '캠페인 생성 (초안)'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {campaignTarget && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-900">
                {campaignTarget.emoji} {campaignTarget.title}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {getCategoryLabel(campaignTarget.category)} / {getDifficultyLabel(campaignTarget.difficulty)} / {campaignTarget.reward_name}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">시작일</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">종료일</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          {startDate && endDate && new Date(endDate) > new Date(startDate) && (
            <p className="text-xs text-gray-500">
              기간:{' '}
              {Math.ceil(
                (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                  (1000 * 60 * 60 * 24),
              ) + 1}
              일
            </p>
          )}
          {createError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {createError}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
