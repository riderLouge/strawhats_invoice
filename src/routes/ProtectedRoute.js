import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useOverAllContext } from '../context/overAllContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userRole } = useOverAllContext();

  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/*" />;
};

export default ProtectedRoute;
