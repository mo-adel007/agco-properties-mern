import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ roles }) => {
  const { currentUser, token } = useSelector((state) => state.user);

  // Check if the user is authenticated and has one of the required roles
  const isAuthorized = currentUser && roles.includes(currentUser.role) && token;

  return isAuthorized ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
