import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { BaseErrorElement } from './components';
import Authenticate from './components/Authenticate';
import { BaseLayout, Login, messages, posts } from './pages';
import { UserProvider } from './UserContext';

/**
 * 路由元件
 *
 * @returns {RouterProvider}
 */
export default function Router() {
  const menuComponents = [
    {
      ...posts,
      path: '/',
    },
    {
      ...messages,
      path: '/messages',
    },
  ];

  const routes = [
    {
      path: '/',
      element: <BaseLayout menuComponents={menuComponents} />,
      children: menuComponents,
    },
    {
      path: '/login',
      element: <Login />,
    },
  ];

  const base = [{
    element: (
      <UserProvider>
        <Authenticate>
          <Outlet />
        </Authenticate>
      </UserProvider>
    ),
    children: routes,
    errorElement: <BaseErrorElement />,
  }];

  return (
    <RouterProvider router={createBrowserRouter(base)} />
  );
}
