import { NavLink } from 'react-router-dom';
import { logout } from '../lib/auth';

const NAV_ITEMS = [
  { to: '/', label: '대시보드', icon: '📊' },
  { to: '/users', label: '사용자', icon: '👤' },
  { to: '/templates', label: '루틴 템플릿', icon: '📋' },
  { to: '/rewards', label: '리워드 관리', icon: '🎁' },
];

export default function Sidebar() {
  const handleLogout = () => {
    logout();
    window.location.hash = '#/login';
  };

  return (
    <aside className="flex h-screen w-56 flex-col bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-5">
        <span className="text-xl">⚙️</span>
        <span className="text-base font-bold text-[#5B5CF9]">Routiny Admin</span>
      </div>
      <nav className="flex-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-[#5B5CF9]/10 font-semibold text-[#5B5CF9]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-gray-100 px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50"
        >
          <span>🚪</span>
          로그아웃
        </button>
      </div>
    </aside>
  );
}
