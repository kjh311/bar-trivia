import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("Bar-Trivia-Token");

  return token ? children : <Navigate to="/login" />;
};

export default React.memo(ProtectedRoute);
