import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updatePasswordApi } from "../../api/authApi";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import PageHeader from "../../components/PageHeader";
import PasswordField from "../../components/PasswordField";
import { getInitials, getErrorMessage } from "../../utils/helpers";

export default function ProfilePage() {
  const { profile, profileLoading, profileError, refreshProfile } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const onUpdatePassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsUpdating(true);
    try {
      await updatePasswordApi({ password });
      setMessage("Password updated successfully.");
      setPassword("");
    } catch (err) {
      setError(getErrorMessage(err, "Password update failed"));
    } finally {
      setIsUpdating(false);
    }
  };

  if (profileLoading) {
    return <Loader text="Loading profile..." />;
  }

  if (profileError && !profile) {
    return (
      <section className="section">
        <ErrorMessage message={profileError} />
        <button type="button" className="btn mt-4" onClick={refreshProfile}>
          Retry
        </button>
      </section>
    );
  }

  if (!profile) {
    return <ErrorMessage message="Profile not found" />;
  }

  const isAdmin = profile.role === "admin";

  return (
    <section className="section">
      <PageHeader title="Your Profile" description="Account details and password." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
            <div className="candidate-avatar !w-16 !h-16 !text-xl !rounded-2xl">
              {getInitials(profile.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm text-slate-500">{profile.email}</p>
              <span className={`badge mt-2 ${isAdmin ? "bg-danger-100 text-danger-700" : "bg-success-100 text-success-700"}`}>
                {profile.role}
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">Age</dt>
              <dd className="mt-1 font-semibold text-slate-900">{profile.age} years</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">Mobile</dt>
              <dd className="mt-1 font-semibold text-slate-900">{profile.mobile}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase text-slate-500">Address</dt>
              <dd className="mt-1 font-semibold text-slate-900">{profile.address}</dd>
            </div>
            {!isAdmin && (
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500">Vote status</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {profile.isVoted ? "Already voted" : "Not voted yet"}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <form className="card" onSubmit={onUpdatePassword}>
          <h2 className="card-title mb-4">Change password</h2>
          <PasswordField
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
          />
          {error && (
            <div className="mt-4">
              <ErrorMessage message={error} />
            </div>
          )}
          {message && <div className="alert-success mt-4">{message}</div>}
          <button className="btn w-full mt-4" type="submit" disabled={isUpdating || !password}>
            {isUpdating ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
}
