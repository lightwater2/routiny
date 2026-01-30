import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
