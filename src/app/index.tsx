import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { getCurrentUser } from '../shared/api';
import { Loader } from '../shared/ui';

export function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsReady(true))
      .catch((err) => {
        console.error('사용자 초기화 실패:', err);
        setIsReady(true);
      });
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="medium" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
