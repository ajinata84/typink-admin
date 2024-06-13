// ProtectedRoute.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
