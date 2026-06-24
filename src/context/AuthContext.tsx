"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password?: string) => boolean;
  register: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "skyroute_user";

function readStoredUser(): User | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always start with null on server; hydrate from localStorage after mount.
  // This ensures SSR and first-client render produce identical HTML (no user),
  // eliminating the hydration mismatch in Navbar and other auth-dependent components.
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredUser());
    setIsLoading(false);
  }, []);

  const persist = (next: User | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = (email: string, password?: string): boolean => {
    const stored = readStoredUser();
    if (stored && stored.email === email) {
      if (stored.passwordHash && password && stored.passwordHash !== password) {
        return false;
      }
      persist(stored);
      return true;
    }
    const namePart = email.split("@")[0] || "Traveler";
    const newUser: User = {
      firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      lastName: "",
      email,
      passwordHash: password || "",
      createdAt: Date.now(),
    };
    persist(newUser);
    return true;
  };

  const register = (newUser: User) => {
    persist({ ...newUser, createdAt: Date.now() });
  };

  const logout = () => {
    persist(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    persist({ ...user, ...updates });
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user) return false;
    if (user.passwordHash && user.passwordHash !== currentPassword) {
      return false;
    }
    persist({ ...user, passwordHash: newPassword });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, changePassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
