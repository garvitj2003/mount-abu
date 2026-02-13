"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthService } from "@/services/authService";

/**
 * Component to synchronize the Zustand auth store with the backend session.
 * This should be placed in the RootLayout.
 */
export default function AuthInitializer() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const syncAuth = async () => {
      try {
        const user = await AuthService.getMe();
        setAuth({
          id: user.user_id,
          name: user.name,
          role: user.role,
          mobile: user.mobile,
        });
      } catch (error) {
        console.error("Auth Sync Failed:", error);
        // If /auth/me fails, we ensure the store is cleared
        logout();
      }
    };

    syncAuth();
  }, [setAuth, logout]);

  return null; // This component doesn't render anything
}
