import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../shared/api/supabase';
import { getToday, getDaysAgo, formatNumber } from '../shared/lib/format';
import StatsCard from '../shared/ui/StatsCard';
import Spinner from '../shared/ui/Spinner';

interface DashboardStats {
  totalUsers: number;
  activeRoutines: number;
  todayCheckIns: number;
  rewardApplications: number;
}

interface ChartData {
  date: string;
  count: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [usersRes, routinesRes, checkInsRes, rewardsRes, chartRes] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('user_routines').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('date', getToday()),
        supabase.from('user_rewards').select('*', { count: 'exact', head: true }).eq('status', 'APPLY'),
        supabase.from('check_ins').select('date').gte('date', getDaysAgo(6)),
      ]);

      setStats({
        totalUsers: usersRes.count ?? 0,
        activeRoutines: routinesRes.count ?? 0,
        todayCheckIns: checkInsRes.count ?? 0,
        rewardApplications: rewardsRes.count ?? 0,
      });

      const grouped = groupByDate(chartRes.data ?? []);
      setChartData(grouped);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function groupByDate(rows: { date: string }[]): ChartData[] {
    const counts: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = getDaysAgo(i);
      counts[d] = 0;
    }
    for (const row of rows) {
      const d = row.date.split('T')[0];
      if (d in counts) {
        counts[d]++;
      }
    }
    return Object.entries(counts).map(([date, count]) => ({
      date: date.slice(5),
      count,
    }));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-gray-900">대시보드</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="총 사용자" value={formatNumber(stats?.totalUsers ?? 0)} icon="👤" />
        <StatsCard title="활성 루틴" value={formatNumber(stats?.activeRoutines ?? 0)} icon="🔄" color="#22C55E" />
        <StatsCard title="오늘 체크인" value={formatNumber(stats?.todayCheckIns ?? 0)} icon="✅" color="#3B82F6" />
        <StatsCard title="리워드 신청" value={formatNumber(stats?.rewardApplications ?? 0)} icon="🎁" color="#F97316" />
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">최근 7일 체크인 현황</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#888' }} />
            <YAxis tick={{ fontSize: 12, fill: '#888' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #eee', fontSize: '13px' }}
              formatter={(value: number) => [`${value}건`, '체크인']}
            />
            <Bar dataKey="count" fill="#5B5CF9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
