import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../../components/ErrorMessage";
import AuthHero from "../../components/AuthHero";
import PasswordField from "../../components/PasswordField";
import { getErrorMessage } from "../../utils/helpers";

const defaultForm = {
  name: "",
  age: "",
  email: "",
  mobile: "",
  address: "",
  aadharCardNumber: "",
  password: ""
};

export default function SignupPage() {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await signup({ ...form, age: Number(form.age) });
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err, "Signup failed"));
    }
  };

  return (
    <div className="auth-container">
      <AuthHero headline="Register to vote" subtext="Create your voter account to participate." />
      <div className="auth-panel">
        <div className="auth-card wide">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Create account</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input className="field" name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
              <input
                className="field"
                name="age"
                type="number"
                min="18"
                placeholder="Age"
                value={form.age}
                onChange={onChange}
                required
              />
            </div>
            <input className="field" name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
            <input className="field" name="mobile" placeholder="Mobile" value={form.mobile} onChange={onChange} required />
            <input className="field" name="address" placeholder="Address" value={form.address} onChange={onChange} required />
            <input
              className="field"
              name="aadharCardNumber"
              placeholder="Aadhar number"
              value={form.aadharCardNumber}
              onChange={onChange}
              required
            />
            <PasswordField name="password" value={form.password} onChange={onChange} placeholder="Password" />
            {error && <ErrorMessage message={error} />}
            <button className="btn w-full" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600 border-t border-slate-200 pt-6">
            Have an account? <Link to="/login" className="font-semibold text-brand-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
