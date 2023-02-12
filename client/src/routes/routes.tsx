import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AuthProvider } from '../api/auth-api';

import { App, Auth, Login, NewTalk, Root, Signup } from '../pages';

export const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    children: [
      {
        element: <Auth />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/signup', element: <Signup /> },
        ],
      },
      {
        element: <Root />,
        path: '/',
        children: [
          { index: true, element: <App /> },
          {
            path: '/talks',
            children: [{ path: 'new', element: <NewTalk /> }],
          },
        ],
      },
    ],
  },
]);

function ContextWrapper() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
