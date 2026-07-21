import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { login as loginRequest, getProfile } from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "mv_token";

function readStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const { data } = await getProfile();
      setUser(data.user);
      return data.user;
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      throw err;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (token) {
        try {
          await loadProfile();
        } catch {
          // token invalid / expired - already cleared above
        }
      }
      if (mounted) setInitializing(false);
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password, rememberMe = true) => {
    const { data } = await loginRequest({ email, password });

    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.removeItem(TOKEN_KEY);
    }

    setToken(data.access_token);
    const profileUser = await loadProfile();
    return profileUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    initializing,
    login,
    logout,
    refreshProfile: loadProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
