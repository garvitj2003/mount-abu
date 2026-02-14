"use client";

import { useUser } from "@/hooks/useUser";
import FullscreenLoader from "./FullscreenLoader";

/**
 * Guard component to show a full-screen loader until user data is loaded.
 */
export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useUser();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return <>{children}</>;
}
