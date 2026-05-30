import { Link } from "react-router-dom";
import AuthHero from "../components/AuthHero";

export default function NotFoundPage() {
  return (
    <div className="auth-container">
      <AuthHero headline="Page not found" subtext="The URL you opened does not exist." />
      <div className="auth-panel">
        <div className="auth-card text-center">
          <h1 className="text-2xl font-bold">404</h1>
          <p className="mt-3 text-slate-600">Let&apos;s get you back on track.</p>
          <Link className="btn w-full mt-8 inline-flex justify-center" to="/login">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
