import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../../components/ErrorMessage";
import AuthHero from "../../components/AuthHero";
import PasswordField from "../../components/PasswordField";
import { getErrorMessage } from "../../utils/helpers";

export default function LoginPage() {
  const [form, setForm] = useState({ aadharCardNumber: "", password: "" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await login(form);
      navigate(data.user?.role === "admin" ? "/admin/candidates" : "/vote");
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
    }
  };

  return (
    <div className="auth-container">
      <AuthHero headline="Your voice matters" subtext="Secure voting for every registered citizen." />
      <div className="auth-panel">
        <div className="auth-card">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 mb-6">Sign in with your Aadhar number</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Aadhar Number</label>
              <input
                className="field"
                placeholder="Enter Aadhaar Number"
                name="aadharCardNumber"
                value={form.aadharCardNumber}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <PasswordField name="password" value={form.password} onChange={onChange} />
            </div>
            {error && <ErrorMessage message={error} />}
            <button className="btn w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 border-t border-slate-200 pt-6">
            No account? <Link to="/signup" className="font-semibold text-brand-600">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
