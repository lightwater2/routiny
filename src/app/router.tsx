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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StartPage />,
  },
  {
    path: '/category',
    element: <CategoryPage />,
  },
  {
    path: '/routines/:category',
    element: <RoutineListPage />,
  },
  {
    path: '/routine/:id',
    element: <RoutineDetailPage />,
  },
  {
    path: '/routine/:id/setup',
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
]);
