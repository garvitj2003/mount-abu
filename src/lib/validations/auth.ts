import { z } from "zod";

export const mobileSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number");

export const otpSchema = z
  .string()
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d+$/, "OTP must contain only numbers");

export const loginSchema = z.object({
  mobile: mobileSchema,
});

export const verifyOtpSchema = z.object({
  mobile: mobileSchema,
  otp: otpSchema,
});

export const authorityLoginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
