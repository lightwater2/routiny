import { useEffect, useState } from 'react';
import { supabase } from '../shared/api/supabase';
import { formatDate } from '../shared/lib/format';
import DataTable from '../shared/ui/DataTable';
import Pagination from '../shared/ui/Pagination';
import Spinner from '../shared/ui/Spinner';
import type { Column } from '../shared/ui/DataTable';
import type { DbUserWithRoutineCount } from '../shared/api/types';

const PAGE_SIZE = 20;

export default function UsersPage() {
  const [users, setUsers] = useState<DbUserWithRoutineCount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [page]);

  async function loadUsers() {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, count } = await supabase
      .from('users')
      .select('*, user_routines(count)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    setUsers((data as DbUserWithRoutineCount[]) ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }

  const columns: Column<DbUserWithRoutineCount>[] = [
    {
      key: 'nickname',
      header: '닉네임',
      render: (row) => <span className="font-medium">{row.nickname}</span>,
    },
    {
      key: 'device_id',
      header: '디바이스 ID',
      render: (row) => (
        <span className="font-mono text-xs text-gray-400">{row.device_id.slice(0, 12)}...</span>
      ),
    },
    {
      key: 'routines',
      header: '루틴 수',
      render: (row) => row.user_routines[0]?.count ?? 0,
    },
    {
      key: 'created_at',
      header: '가입일',
      render: (row) => <span className="text-gray-500">{formatDate(row.created_at)}</span>,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">사용자 관리</h1>
        <span className="text-sm text-gray-500">총 {total}명</span>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <DataTable columns={columns} data={users} keyExtractor={(r) => r.id} />
          <Pagination
            page={page}
            totalPages={Math.ceil(total / PAGE_SIZE)}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
