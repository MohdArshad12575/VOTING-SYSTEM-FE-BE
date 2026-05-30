import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import VoterRoute from "./routes/VoterRoute";
import HomeRedirect from "./routes/HomeRedirect";
import Layout from "./components/Layout";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/voter/DashboardPage";
import ProfilePage from "./pages/voter/ProfilePage";
import VoteCountPage from "./pages/voter/VoteCountPage";
import AdminCandidatesPage from "./pages/admin/AdminCandidatesPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route element={<VoterRoute />}>
              <Route path="/vote" element={<DashboardPage />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin/candidates" element={<AdminCandidatesPage />} />
              <Route path="/vote-count" element={<VoteCountPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
