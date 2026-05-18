import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { email: string; role: string } | null;
  login: (email: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (email, token) => 
        set({ 
          isAuthenticated: true, 
          token, 
          user: { email, role: "admin" } 
        }),
      logout: () => 
        set({ 
          isAuthenticated: false, 
          token: null, 
          user: null 
        }),
    }),
    { name: "maritrack-auth" }
  )
);