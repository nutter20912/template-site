import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthenticate } from '../UserContext';

/**
 * 認證狀態導航元件
 *
 * @returns {React.ReactElement}
 */
export default function Authenticate({ children }) {
  const location = useLocation();
  const authenticated = useAuthenticate();

  const getElement = () => {
    if (!authenticated && location.pathname !== '/login') {
      return <Navigate to="/login" replace="true" />;
    }

    if (authenticated && location.pathname === '/login') {
      return <Navigate to="/" replace="true" />;
    }

    return children;
  };

  return (getElement());
}
