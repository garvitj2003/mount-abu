import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";
import { ROLE_PERMISSIONS } from "./lib/role-permissions";
import { components } from "./types/api";

type UserRole = components["schemas"]["UserRole"];

const API_URL = process.env.INTERNAL_API_URL || "http://localhost:8000";
const publicRoutes = ["/login", "/signup", "/api/auth/refresh", "/public"];

/**
 * Next.js 16 Proxy Gatekeeper.
 * Handles server-side redirects, auth verification, and silent refreshes.
 */
export async function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const path = nextUrl.pathname;

  if (
    path === "/" ||
    publicRoutes.some((route) => path.startsWith(route)) ||
    path.match(/\.(.*)$/) ||
    path.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  let accessToken = cookies.get("access_token")?.value;
  const refreshToken = cookies.get("refresh_token")?.value;

  // 1. No tokens at all -> Redirect to login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Proactive Server-Side Refresh
  // If access_token is missing but refresh_token exists, try to get a new one
  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        accessToken = data.access_token;
        
        // Create response and set the new cookie so the client gets it
        const nextResponse = NextResponse.next();
        nextResponse.cookies.set("access_token", accessToken!, {
          httpOnly: false, // Matches our Axios requirement
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 30 * 60,
        });

        // We continue with the new token
        // Important: We also need to perform RBAC check on this new token below
      } else {
        // Refresh failed (token likely expired or revoked)
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("Proxy Refresh Error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. Role-Based Access Control (RBAC)
  if (accessToken) {
    try {
      const payload = decodeJwt(accessToken);
      const role = payload.role as string;


      // 3.2. Role-Based Access Control (RBAC)
      if (role === "CITIZEN" && path.startsWith("/authority")) {
        return NextResponse.redirect(new URL("/citizen", request.url));
      }

      if (role !== "CITIZEN" && path.startsWith("/citizen")) {
        return NextResponse.redirect(new URL("/authority", request.url));
      }

      // **New RBAC check for authority routes**
      if (
        role !== "SUPERADMIN" && // Superadmin can access everything
        path.startsWith("/authority/") 
      ) {
        const allowedRoutes = ROLE_PERMISSIONS[role as UserRole] ?? [];
        // The check should be if the current path starts with any of the allowed routes.
        const isAllowed = allowedRoutes.some(allowedPath => path.startsWith(allowedPath));
        
        if (!isAllowed) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }

      // If we refreshed the token in step 2, we need to return the response
      // that contains the new cookie, otherwise we just return NextResponse.next()
      const response = NextResponse.next();
      if (!cookies.get("access_token")?.value && accessToken) {
        response.cookies.set("access_token", accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 60,
          });
      }
      return response;

    } catch (e) {
      console.error("Proxy JWT Decode Error:", e);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
