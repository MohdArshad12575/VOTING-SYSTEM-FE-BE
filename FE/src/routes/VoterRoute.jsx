import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

/** Vote casting and voter-only pages — not for admin accounts. */
export default function VoterRoute() {
  const { isAdmin, profileLoading, user, profile } = useAuth();

  if (profileLoading && !user?.role && !profile) {
    return <Loader text="Loading..." />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/candidates" replace />;
  }

  return <Outlet />;
}
