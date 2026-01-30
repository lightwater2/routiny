import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { isAuthenticated } from '../shared/lib/auth';
import { router } from './router';
import Spinner from '../shared/ui/Spinner';

export default function App() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() && !window.location.hash.includes('/login')) {
      window.location.hash = '#/login';
    }
    setChecked(true);
  }, []);

  if (!checked) return <Spinner />;

  return <RouterProvider router={router} />;
}
