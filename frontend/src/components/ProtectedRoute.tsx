import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


interface ProtectedRouteProps {
  children: ReactNode;
}


export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuth } = useAuth();
  const location = useLocation();

  if (!isAuth()) {
    return <Navigate
    to="/login"
    replace
    state={{ from: location.pathname + location.search + location.hash }}
  />;
  }

  return <>{children}</>;
}
