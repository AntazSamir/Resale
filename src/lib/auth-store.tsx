import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { validateSessionFn, signOutFn } from "./server-functions";
import { supabase } from "./supabase";

function userFromGoogleSession(session: {
  user: {
    id: string;
    email?: string | undefined;
    phone?: string | undefined;
    user_metadata?: Record<string, unknown> | undefined;
  };
}): AuthUser {
  const meta = session.user.user_metadata ?? {};
  const name =
    (typeof meta["full_name"] === "string" && meta["full_name"]) ||
    (typeof meta["name"] === "string" && meta["name"]) ||
    undefined;
  return {
    id: session.user.id,
    phone: session.user.phone ?? "",
    email: session.user.email,
    name,
    role: "BUYER",
    isAdmin: false,
  };
}

export interface AuthUser {
  id?: string | undefined;
  phone: string;
  email?: string | undefined;
  name?: string | undefined;
  role?: "BUYER" | "SELLER" | "ADMIN" | undefined;
  isAdmin?: boolean | undefined;
}

export interface SignInPayload {
  token?: string | undefined;
  user?: Partial<AuthUser> | undefined;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  hydrated: boolean;
  signIn: (payload: SignInPayload | string | Partial<AuthUser>) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "resale.session_token";
const CACHED_USER_KEY = "resale.cached_user";

function readCachedToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function readCachedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.localStorage.getItem(CACHED_USER_KEY) ||
      window.sessionStorage.getItem(CACHED_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Validate session against server on mount
  useEffect(() => {
    let isMounted = true;
    const storedToken = readCachedToken();
    const cachedUser = readCachedUser();

    // Optimistically load cached user for instant rendering
    if (cachedUser) {
      setUser(cachedUser);
    }
    if (storedToken) {
      setToken(storedToken);
    }

    if (!storedToken) {
      // No custom session — fall back to a Google (Supabase OAuth) session,
      // e.g. right after returning from the Google consent redirect.
      supabase.auth
        .getSession()
        .then(({ data }) => {
          if (!isMounted) return;
          if (data.session) {
            const googleUser = userFromGoogleSession(data.session);
            setUser(googleUser);
            try {
              window.localStorage.setItem(CACHED_USER_KEY, JSON.stringify(googleUser));
            } catch {
              // ignore
            }
          }
        })
        .finally(() => {
          if (isMounted) setHydrated(true);
        });
      return;
    }

    // Server authoritative session verification
    validateSessionFn({ data: { token: storedToken } })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.valid && res.user) {
          const verifiedUser: AuthUser = {
            id: res.user.id,
            phone: res.user.phone,
            email: res.user.email,
            name: res.user.name,
            role: res.user.role as "BUYER" | "SELLER" | "ADMIN",
            isAdmin: res.user.isAdmin,
          };
          setUser(verifiedUser);
          setToken(storedToken);

          // Update cached snapshot
          try {
            window.localStorage.setItem(CACHED_USER_KEY, JSON.stringify(verifiedUser));
          } catch {
            // ignore
          }
        } else {
          // Token is invalid, expired, or tampered — revoke local session
          setUser(null);
          setToken(null);
          try {
            window.localStorage.removeItem(TOKEN_KEY);
            window.localStorage.removeItem(CACHED_USER_KEY);
            window.sessionStorage.removeItem(TOKEN_KEY);
            window.sessionStorage.removeItem(CACHED_USER_KEY);
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // Network error — keep cached user in offline mode
      })
      .finally(() => {
        if (isMounted) {
          setHydrated(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Keep the app session in sync with Google (Supabase OAuth) auth events,
  // e.g. right after the OAuth redirect lands back on the app.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Only adopt the Google session when there's no custom session user.
        if (!readCachedToken()) {
          const googleUser = userFromGoogleSession(session);
          setUser(googleUser);
          try {
            window.localStorage.setItem(CACHED_USER_KEY, JSON.stringify(googleUser));
          } catch {
            // ignore
          }
        }
      } else if (event === "SIGNED_OUT") {
        if (!readCachedToken()) {
          setUser(null);
          try {
            window.localStorage.removeItem(CACHED_USER_KEY);
            window.sessionStorage.removeItem(CACHED_USER_KEY);
          } catch {
            // ignore
          }
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback((payload: SignInPayload | string | Partial<AuthUser>) => {
    let sessionToken: string | undefined;
    let rawUserData: Partial<AuthUser>;

    if (typeof payload === "string") {
      rawUserData = { phone: payload };
    } else if ("user" in payload && payload.user) {
      sessionToken = payload.token;
      rawUserData = payload.user;
    } else {
      rawUserData = payload as Partial<AuthUser>;
    }

    const newUser: AuthUser = {
      id: rawUserData.id,
      phone: rawUserData.phone ?? "",
      email: rawUserData.email,
      name: rawUserData.name,
      role: rawUserData.role ?? "BUYER",
      isAdmin: Boolean(rawUserData.isAdmin),
    };

    setUser(newUser);

    if (sessionToken) {
      setToken(sessionToken);
      try {
        window.localStorage.setItem(TOKEN_KEY, sessionToken);
      } catch {
        // ignore
      }
    }

    try {
      window.localStorage.setItem(CACHED_USER_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }
  }, []);

  const signOut = useCallback(async () => {
    const currentToken = token || readCachedToken();
    if (currentToken) {
      try {
        await signOutFn({ data: { token: currentToken } });
      } catch {
        // ignore
      }
    }

    setUser(null);
    setToken(null);

    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(CACHED_USER_KEY);
      window.sessionStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.removeItem(CACHED_USER_KEY);
      window.sessionStorage.removeItem("resale.session");
    } catch {
      // ignore
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: Boolean(user),
        hydrated,
        signIn,
        signOut,
      }}
    >
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
