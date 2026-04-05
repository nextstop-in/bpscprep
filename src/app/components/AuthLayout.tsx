import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export function AuthLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to home
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  // Show landing page for unauthenticated users
  return <Outlet />;
}
