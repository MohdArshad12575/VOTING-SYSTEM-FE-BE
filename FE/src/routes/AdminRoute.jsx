import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function AdminRoute() {
  const { isAdmin, profileLoading, user, profile } = useAuth();

  if (profileLoading && !user?.role && !profile) return <Loader text="Loading..." />;
  if (!isAdmin) return <Navigate to="/vote" replace />;
  return <Outlet />;
}
