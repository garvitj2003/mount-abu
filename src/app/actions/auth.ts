"use server";

import { cookies } from "next/headers";
import { type components } from "@/types/api";

type TokenResponse = components["schemas"]["TokenResponse"];

const API_URL = process.env.INTERNAL_API_URL || "http://localhost:8000";

/**
 * Sets the authentication cookies (access and refresh tokens).
 */
export async function setAuthCookies(tokens: TokenResponse) {
  const cookieStore = await cookies();

  // Access Token: Short-lived (e.g., 30 mins)
  // set to httpOnly: false so Axios can read it for the Authorization header
  cookieStore.set("access_token", tokens.access_token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 60, 
  });

  // Refresh Token: Long-lived (e.g., 90 days)
  cookieStore.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 90 * 24 * 60 * 60,
  });
}

/**
 * Clears all authentication cookies.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

/**
 * Server Action for Login with OTP.
 */
export async function loginWithOtpAction(mobile: string, otp: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData?.detail || "Login failed" };
    }

    const tokens: TokenResponse = await response.json();
    await setAuthCookies(tokens);

    return { 
      success: true, 
      user: {
        name: tokens.name,
        role: tokens.role,
        id: tokens.user_id
      }
    };
  } catch (error) {
    console.error("Login Action Error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Server Action for Login with Password (Authority).
 */
export async function loginWithPasswordAction(username: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/auth/login/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData?.detail || "Login failed" };
    }

    const tokens: TokenResponse = await response.json();
    await setAuthCookies(tokens);

    return { 
      success: true, 
      user: {
        name: tokens.name,
        role: tokens.role,
        id: tokens.user_id
      }
    };
  } catch (error) {
    console.error("Login Action Error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Server Action to refresh tokens.
 */
export async function refreshAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return { success: false, error: "No refresh token found" };
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      await logoutAction();
      return { success: false, error: "Session expired" };
    }

    const tokens = await response.json();
    // Update the access_token cookie
    cookieStore.set("access_token", tokens.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60,
    });

    return { success: true };
  } catch (error) {
    console.error("Refresh Action Error:", error);
    return { success: false, error: "Failed to refresh session" };
  }
}

/**
 * Server Action for Citizen Signup.
 */
export async function signupAction(name: string, mobile: string, otp: string) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mobile, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData?.detail || "Signup failed" };
    }

    const tokens: TokenResponse = await response.json();
    await setAuthCookies(tokens);

    return { 
      success: true, 
      user: {
        name: tokens.name,
        role: tokens.role,
        id: tokens.user_id
      }
    };
  } catch (error) {
    console.error("Signup Action Error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
