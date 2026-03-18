import { create } from "zustand";

interface AuthState {
  // We keep only transient client-side state here
  // User metadata is now managed by TanStack Query (useUser)
  tempMobile: string | null;
  setTempMobile: (mobile: string | null) => void;
}

/**
 * Zustand store for purely client-side UI auth state.
 */
export const useAuthStore = create<AuthState>((set) => ({
  tempMobile: null,
  setTempMobile: (mobile) => set({ tempMobile: mobile }),
}));
