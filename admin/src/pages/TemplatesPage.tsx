import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../shared/api/supabase';
import { getDifficultyLabel, getCategoryLabel } from '../shared/lib/format';
import DataTable from '../shared/ui/DataTable';
import Modal from '../shared/ui/Modal';
import StatusBadge from '../shared/ui/StatusBadge';
import Spinner from '../shared/ui/Spinner';
import type { Column } from '../shared/ui/DataTable';
import type { DbTemplateWithRewards } from '../shared/api/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<DbTemplateWithRewards[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DbTemplateWithRewards | null>(null);
  const [form, setForm] = useState({ title: '', description: '', difficulty: '', is_active: true });
  const [saving, setSaving] = useState(false);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('routine_templates')
      .select('*, rewards(*)')
      .order('created_at');

    setTemplates((data as DbTemplateWithRewards[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  function openEdit(t: DbTemplateWithRewards) {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description,
      difficulty: t.difficulty,
      is_active: t.is_active,
    });
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    await supabase
      .from('routine_templates')
      .update({
        title: form.title,
        description: form.description,
        difficulty: form.difficulty,
        is_active: form.is_active,
      })
      .eq('id', editing.id);

    setSaving(false);
    setEditing(null);
    loadTemplates();
  }

  const columns: Column<DbTemplateWithRewards>[] = [
    {
      key: 'emoji',
      header: '',
      width: '48px',
      render: (row) => <span className="text-xl">{row.emoji}</span>,
    },
    {
      key: 'title',
      header: '제목',
      render: (row) => <span className="font-medium">{row.title}</span>,
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
      key: 'reward',
      header: '리워드',
      render: (row) => row.rewards[0]?.name ?? '-',
    },
    {
      key: 'is_active',
      header: '상태',
      render: (row) => (
        <StatusBadge
          status={row.is_active ? 'active' : 'abandoned'}
          label={row.is_active ? '활성' : '비활성'}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '80px',
      render: (row) => (
        <button
          onClick={() => openEdit(row)}
          className="rounded-lg px-3 py-1 text-xs font-medium text-[#5B5CF9] hover:bg-[#5B5CF9]/10"
        >
          편집
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">루틴 템플릿</h1>
        <span className="text-sm text-gray-500">총 {templates.length}개</span>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <DataTable columns={columns} data={templates} keyExtractor={(r) => r.id} />
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="템플릿 편집"
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">제목</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#5B5CF9]"
            />
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
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="h-4 w-4 rounded accent-[#5B5CF9]"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">활성화</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
