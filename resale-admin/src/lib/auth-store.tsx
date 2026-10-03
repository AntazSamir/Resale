import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { adminApi, storeToken, clearToken, getStoredToken, type AuthUser } from "./api-client";

const CACHED_USER_KEY = "resale.cached_user";

function readCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(CACHED_USER_KEY) || sessionStorage.getItem(CACHED_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CACHED_USER_KEY);
      sessionStorage.removeItem(CACHED_USER_KEY);
    }
  } catch {
    // ignore
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  signIn: (token: string, user: AuthUser) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const storedToken = getStoredToken();
    const cachedUser = readCachedUser();

    // Optimistic load
    if (storedToken) setToken(storedToken);
    if (cachedUser) setUser(cachedUser);

    if (!storedToken) {
      setHydrated(true);
      return;
    }

    // Server-side session validation
    adminApi
      .getSession()
      .then((res) => {
        if (!mounted) return;
        if (res.valid && res.user) {
          setUser(res.user);
          writeCachedUser(res.user);
        } else {
          // Session expired
          setUser(null);
          setToken(null);
          clearToken();
          writeCachedUser(null);
        }
      })
      .catch(() => {
        if (!mounted) return;
        // Keep optimistic state on network error
      })
      .finally(() => {
        if (mounted) setHydrated(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback((tok: string, u: AuthUser) => {
    setToken(tok);
    setUser(u);
    storeToken(tok);
    writeCachedUser(u);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
    clearToken();
    writeCachedUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, hydrated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
