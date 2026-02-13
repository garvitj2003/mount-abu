import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  user: {
    id: number | null;
    name: string | null;
    role: string | null;
    mobile: string | null;
  } | null;
  isAuthenticated: boolean;
  setAuth: (user: UserState["user"]) => void;
  logout: () => void;
}

/**
 * Zustand store for Managing User Authentication State.
 * This is used for UI logic (sidebar, profile, etc.).
 * Note: Security is still handled by HttpOnly cookies and Backend.
 */
export const useAuthStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
