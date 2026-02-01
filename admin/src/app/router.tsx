import { createHashRouter } from 'react-router-dom';
import AdminLayout from '../shared/ui/AdminLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import CampaignsPage from '../pages/CampaignsPage';
import CampaignCreatePage from '../pages/CampaignCreatePage';
import TemplatesPage from '../pages/TemplatesPage';
import TemplateCreatePage from '../pages/TemplateCreatePage';
import TemplateEditPage from '../pages/TemplateEditPage';
import RewardsPage from '../pages/RewardsPage';
import GuidePage from '../pages/GuidePage';

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
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'templates/new', element: <TemplateCreatePage /> },
      { path: 'templates/:id', element: <TemplateEditPage /> },
      { path: 'rewards', element: <RewardsPage /> },
      { path: 'guide', element: <GuidePage /> },
    ],
  },
]);
