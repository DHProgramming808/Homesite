import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: React.JSX.Element }) {
  const { isAuth, role } = useAuth();

  if (role !== "Admin") {
    return <Navigate to="/home" replace />;
  }

  return isAuth() ? children : <Navigate to="/login" replace />;
}
