import api from "@/lib/axios";
import { type components } from "@/types/api";

type MessageResponse = components["schemas"]["MessageResponse"];
type MeResponse = components["schemas"]["MeResponse"];

/**
 * Auth Service for client-side API interactions via Axios.
 */
export const AuthService = {
  /**
   * Request an OTP to be sent to a mobile number.
   */
  async sendOtp(mobile: string): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>("/auth/send-otp", { mobile });
    return response.data;
  },

  /**
   * Fetch the current user's profile metadata.
   * Used to hydrate the Zustand store.
   */
  async getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>("/auth/me");
    return response.data;
  },

  /**
   * Signup for a new citizen account.
   * Note: This returns tokens, so we should probably handle this in a Server Action
   * if we want to set HttpOnly cookies directly.
   */
  async signup(name: string, mobile: string, otp: string): Promise<components["schemas"]["TokenResponse"]> {
    const response = await api.post("/auth/signup", { name, mobile, otp });
    return response.data;
  },

  /**
   * Fetch the PEM-formatted RSA Public Key from the backend.
   */
  async getPublicKey(): Promise<string> {
    const response = await api.get<{ public_key: string }>("/auth/public-key");
    return response.data.public_key;
  }
};
