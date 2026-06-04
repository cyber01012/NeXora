import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "../api/authApi";
import { clearTokens, setTokens } from "../api/client";
import type { AuthResponse, UserProfile } from "../api/types";
import { ApiError } from "../api/types";

const USER_KEY = "nexora_user";
const REFRESH_TOKEN_KEY = "nexora_refresh_token";

type AuthContextValue = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (response: AuthResponse) => void;
  login: (identifier: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

function persistUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => readStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback((response: AuthResponse) => {
    setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
    persistUser(response.user);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      persistUser(profile);
      return profile;
    } catch {
      setUser(null);
      persistUser(null);
      clearTokens();
      return null;
    }
  }, []);

  useEffect(() => {
    refreshProfile().finally(() => setIsLoading(false));
  }, [refreshProfile]);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const response = await authApi.login(identifier, password);
      setSession(response);
      return response.user;
    },
    [setSession]
  );

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    try {
      await authApi.logout(refreshToken);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error;
      }
    } finally {
      clearTokens();
      setUser(null);
      persistUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      setSession,
      login,
      logout,
      refreshProfile,
    }),
    [user, isLoading, setSession, login, logout, refreshProfile]
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

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) {
    if (error.errors && Object.keys(error.errors).length > 0) {
      return Object.values(error.errors).join(" ");
    }
    return error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
