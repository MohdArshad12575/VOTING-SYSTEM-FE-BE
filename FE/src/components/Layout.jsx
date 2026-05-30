import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helpers";

const navItems = [
  { to: "/vote", label: "Cast Vote", end: true, voterOnly: true },
  { to: "/profile", label: "Profile" },
  { to: "/vote-count", label: "Results", adminOnly: true },
  { to: "/admin/candidates", label: "Candidates", adminOnly: true }
];

export default function Layout() {
  const { logout, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const homePath = isAdmin ? "/admin/candidates" : "/vote";

  const visibleNav = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.voterOnly && isAdmin) return false;
    return true;
  });

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar sticky top-0 z-50">
        <div className="topbar-inner">
          <Link to={homePath} className="brand" onClick={() => setMenuOpen(false)}>
            <div className="brand-icon" aria-hidden="true">
              🗳️
            </div>
            <span>Vote Hub</span>
          </Link>

          {user && (
            <div className="user-chip">
              <div className="user-avatar" aria-hidden="true">
                {getInitials(user.name)}
              </div>
              <span className="max-w-[120px] truncate">{user.name}</span>
              {isAdmin && <span className="badge bg-brand-100 text-brand-700">admin</span>}
            </div>
          )}

          <nav className="desktop-nav" aria-label="Main">
            {visibleNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
            <button className="btn btn-danger btn-sm ml-1" type="button" onClick={handleLogout}>
              Logout
            </button>
          </nav>

          <button
            type="button"
            className="mobile-menu-btn"
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className={`mobile-nav${menuOpen ? " open" : ""}`} aria-label="Mobile">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <button className="btn btn-danger btn-sm mt-2 w-full" type="button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="page-body">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
