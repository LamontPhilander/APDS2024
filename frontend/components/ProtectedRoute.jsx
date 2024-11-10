import React from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = JSON.parse(atob(token.split(".")[1])).role;
  return token && allowedRoles.includes(role) ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
