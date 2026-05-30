import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearAuthSession, getStoredUser, getToken, setAuthSession } from "../utils/storage";
import { clearDedupe } from "../utils/dedupe";
import { loginApi, signupApi, getProfileApi } from "../api/authApi";
import { getErrorMessage } from "../utils/helpers";

const PROFILE_KEY = "profile";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getStoredUser());
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    const currentToken = getToken();
    if (!currentToken) {
      setProfile(null);
      setProfileLoading(false);
      setProfileError("");
      return null;
    }

    setProfileLoading(true);
    setProfileError("");
    try {
      clearDedupe(PROFILE_KEY);
      const data = await getProfileApi();
      setProfile(data);
      setUser({
        id: data.id,
        name: data.name,
        role: data.role,
        email: data.email
      });
      return data;
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not load profile"));
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setProfile(null);
      setProfileError("");
      setProfileLoading(false);
    }
  }, [token, loadProfile]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await loginApi(payload);
      setAuthSession({ token: data.token, user: data.user });
      setToken(data.token);
      setUser(data.user);
      await loadProfile();
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      return await signupApi(payload);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearDedupe(PROFILE_KEY);
    clearAuthSession();
    setToken(null);
    setUser(null);
    setProfile(null);
    setProfileError("");
    setProfileLoading(false);
  };

  const refreshProfile = () => loadProfile();

  const isAdmin = profile?.role === "admin" || user?.role === "admin";

  const value = useMemo(
    () => ({
      token,
      user,
      profile,
      profileLoading,
      profileError,
      loading,
      isAuthenticated: Boolean(token),
      isAdmin,
      login,
      signup,
      logout,
      refreshProfile
    }),
    [token, user, profile, profileLoading, profileError, loading, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
