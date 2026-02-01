import { createBrowserRouter } from 'react-router-dom';
import { StartPage } from '../pages/StartPage';
import { CategoryPage } from '../pages/CategoryPage';
import { RoutineListPage } from '../pages/RoutineListPage';
import { RoutineDetailPage } from '../pages/RoutineDetailPage';
import { RoutineSetupPage } from '../pages/RoutineSetupPage';
import { ActiveRoutinePage } from '../pages/ActiveRoutinePage';
import { ActiveRoutineDetailPage } from '../pages/ActiveRoutineDetailPage';
import { CheckInPage } from '../pages/CheckInPage';
import { RewardDetailPage } from '../pages/RewardDetailPage';
import { RewardApplyPage } from '../pages/RewardApplyPage';
import { MyPage } from '../pages/MyPage';
import {
  AdminCampaignListPage,
  AdminCampaignCreatePage,
  AdminCampaignDetailPage,
  AdminCampaignEditPage,
} from '../features/admin/pages';

export const router = createBrowserRouter([
  // 유저 라우트
  {
    path: '/',
    element: <StartPage />,
  },
  {
    path: '/category',
    element: <CategoryPage />,
  },
  {
    path: '/campaigns/:category',
    element: <RoutineListPage />,
  },
  {
    path: '/campaign/:id',
    element: <RoutineDetailPage />,
  },
  {
    path: '/campaign/:id/join',
    element: <RoutineSetupPage />,
  },
  {
    path: '/active',
    element: <ActiveRoutinePage />,
  },
  {
    path: '/active/:id',
    element: <ActiveRoutineDetailPage />,
  },
  {
    path: '/active/:id/checkin',
    element: <CheckInPage />,
  },
  {
    path: '/reward/:id',
    element: <RewardDetailPage />,
  },
  {
    path: '/reward/:id/apply',
    element: <RewardApplyPage />,
  },
  {
    path: '/my',
    element: <MyPage />,
  },
  // 어드민 라우트
  {
    path: '/admin/campaigns',
    element: <AdminCampaignListPage />,
  },
  {
    path: '/admin/campaigns/new',
    element: <AdminCampaignCreatePage />,
  },
  {
    path: '/admin/campaigns/:id',
    element: <AdminCampaignDetailPage />,
  },
  {
    path: '/admin/campaigns/:id/edit',
    element: <AdminCampaignEditPage />,
  },
]);
