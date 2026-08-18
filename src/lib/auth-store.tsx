import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface AuthUser {
  id?: string | undefined;
  phone: string;
  name?: string | undefined;
  role?: "BUYER" | "SELLER" | "ADMIN" | undefined;
  isAdmin: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  signIn: (userData: string | Partial<AuthUser>) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "resale.session";
const ADMIN_PHONE = "01700000000";

function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(readSession());
  }, []);

  const signIn = useCallback((userData: string | Partial<AuthUser>) => {
    let newUser: AuthUser;
    if (typeof userData === "string") {
      newUser = {
        phone: userData,
        isAdmin: userData === ADMIN_PHONE,
      };
    } else {
      newUser = {
        id: userData.id,
        phone: userData.phone ?? "",
        name: userData.name,
        role: userData.role ?? (userData.phone === ADMIN_PHONE ? "ADMIN" : "BUYER"),
        isAdmin: userData.isAdmin ?? userData.phone === ADMIN_PHONE,
      };
    }

    setUser(newUser);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch {
      // ignore
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
