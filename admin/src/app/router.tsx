import { createHashRouter } from 'react-router-dom';
import AdminLayout from '../shared/ui/AdminLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import CampaignsPage from '../pages/CampaignsPage';
import CampaignCreatePage from '../pages/CampaignCreatePage';
import RewardsPage from '../pages/RewardsPage';

export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'campaigns', element: <CampaignsPage /> },
      { path: 'campaigns/new', element: <CampaignCreatePage /> },
      { path: 'rewards', element: <RewardsPage /> },
    ],
  },
]);
