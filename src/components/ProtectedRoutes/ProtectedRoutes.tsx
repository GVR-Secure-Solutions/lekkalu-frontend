import React from 'react';
import { Navigate } from 'react-router-dom';

import storageUtils from '../../utils/storageUtils';

export const ProtectedRoutes = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const authToken = storageUtils.getAuthToken();
  if (!authToken) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoutes;
