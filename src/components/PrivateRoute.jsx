import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase(); // lowercase for safety

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.map((r) => r.toLowerCase()).includes(role)
  ) {
    // Logged in but role is not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />; // Authorized
};

export default PrivateRoute;
