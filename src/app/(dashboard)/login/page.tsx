"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService";
import { loginWithOtpAction } from "@/app/actions/auth";
import { mobileSchema, otpSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

type LoginView = 
  | "citizen" 
  | "authority" 
  | "otp" 
  | "forgot-password" 
  | "reset-otp" 
  | "new-password" 
  | "success";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setTempMobile = useAuthStore((state) => state.setTempMobile);

  const [view, setView] = useState<LoginView>("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Form States
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 digits
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    
    if (digit !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        document.getElementById(`otp-${index - 1}`)?.focus();
      } else if (otp[index] !== "") {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleGetOtp = async () => {
    setError(null);
    const validation = mobileSchema.safeParse(mobile);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid mobile number");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.sendOtp(mobile);
      setTempMobile(mobile);
      setView("otp");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithOtp = async () => {
    setError(null);
    const otpString = otp.join("");
    const validation = otpSchema.safeParse(otpString);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithOtpAction(mobile, otpString);
      if (result.success) {
        // Invalidate 'user' query so TanStack Query fetches fresh data on dashboard load
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        
        // Redirect to citizen module only
        router.push("/citizen");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabs = () => (
    <div className="mb-8 flex rounded-lg bg-[#F7F7F7] p-[6px] relative h-11">
      <motion.div
        className="absolute h-[32px] w-[calc(50%-6px)] rounded-md bg-[#E7F3FF]"
        animate={{ x: (view === "citizen" || view === "otp") ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ left: 6, top: 6 }}
      />
      <button
        onClick={() => setView("citizen")}
        className={`relative flex flex-1 items-center justify-center gap-2 py-2 text-xs font-semibold transition-colors ${
          (view === "citizen" || view === "otp") ? "text-[#0C83FF]" : "text-[#343434]"
        }`}
      >
        <Image
          src="/dashboard/icons/citizen.svg"
          alt="Citizen"
          width={16}
          height={16}
          className={(view === "citizen" || view === "otp") ? "" : "opacity-60"}
        />
        Citizen Login
      </button>
      <button
        onClick={() => setView("authority")}
        className={`relative flex flex-1 items-center justify-center gap-2 py-2 text-xs font-semibold transition-colors ${
          view === "authority" ? "text-[#0C83FF]" : "text-[#343434]"
        }`}
      >
        <Image
          src="/dashboard/icons/authority.svg"
          alt="Authority"
          width={16}
          height={16}
          className={view === "authority" ? "" : "opacity-60"}
        />
        Authority Login
      </button>
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case "citizen":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#343434]">Login</h2>
              <p className="text-xs text-[#343434]">
                Enter Your Contact number to login
              </p>
            </div>

            <div className={`flex h-[54px] items-center rounded-lg border bg-white px-3 ${error ? 'border-red-500' : 'border-[#B1B1B1]'}`}>
              <div className="flex h-full items-center gap-1 pr-3 border-r border-[#343434]/30">
                <Image src="/dashboard/icons/flag.svg" alt="Flag" width={20} height={20} className="object-contain" />
                <span className="text-sm text-[#343434]">+91</span>
                <Image src="/dashboard/icons/login/dropdown.svg" alt="Dropdown" width={6} height={3} className="opacity-60" />
              </div>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full h-full border-none bg-transparent pl-3 text-sm text-[#343434] placeholder-[#343434]/30 focus:ring-0 focus:outline-none"
                placeholder="Enter your mobile number"
              />
            </div>

            {error && <p className="text-[10px] text-red-500 mt-[-16px]">{error}</p>}

            <button
              onClick={handleGetOtp}
              disabled={isLoading}
              className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors disabled:opacity-70"
            >
              {isLoading ? "Sending..." : "Get OTP"}
            </button>
          </div>
        );

      case "otp":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#343434]">Enter OTP Code</h2>
              <p className="text-xs text-[#343434]">
                Enter 6 digit code sent to +91-{mobile}
              </p>
            </div>

            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <div key={i} className="relative h-[54px] w-full">
                  <input
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`absolute inset-0 z-10 h-full w-full rounded-lg border bg-transparent text-center text-[24px] font-bold text-[#343434] focus:border-[#0C83FF] focus:ring-1 focus:ring-[#0C83FF] outline-none caret-transparent ${error ? 'border-red-500' : 'border-[#B1B1B1]'}`}
                  />
                  {digit === "" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="6.5" fill="#DDDDDD" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && <p className="text-[10px] text-red-500 mt-[-16px]">{error}</p>}

            <div className="flex justify-between items-center text-sm">
              <span className="text-[#343434]">Didn’t received OTP?</span>
              <button onClick={handleGetOtp} className="font-bold text-[#0C83FF] disabled:opacity-50" disabled={isLoading}>
                {isLoading ? "Sending..." : "Resend Now"}
              </button>
            </div>

            <button
              onClick={handleLoginWithOtp}
              disabled={isLoading}
              className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors disabled:opacity-70"
            >
              {isLoading ? "Verifying..." : "Login Now"}
            </button>

            <button
              onClick={() => { setView("citizen"); setError(null); }}
              className="flex h-[54px] w-full items-center justify-center gap-2 rounded-lg border border-[#C9C9C9] text-sm font-normal text-[#343434] hover:bg-gray-50 transition-colors"
            >
              <Image src="/dashboard/icons/login/back-arrow.svg" alt="" width={20} height={20} />
              Change contact number
            </button>
          </div>
        );

      case "authority":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#343434]">Welcome Back</h2>
              <p className="text-xs text-[#343434]">
                Enter your username & password for access
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-[54px] rounded-lg border border-[#B1B1B1] bg-white px-3">
                <input
                  type="text"
                  className="w-full h-full border-none bg-transparent text-sm text-[#343434] placeholder-[#343434]/30 focus:ring-0 focus:outline-none"
                  placeholder="Username"
                />
              </div>

              <div className="flex h-[54px] items-center justify-between rounded-lg border border-[#B1B1B1] bg-white px-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-full border-none bg-transparent text-sm text-[#343434] placeholder-[#343434]/30 focus:ring-0 focus:outline-none"
                  placeholder="Password"
                />
                <button onClick={() => setShowPassword(!showPassword)}>
                  <Image src="/dashboard/icons/login/visibility.svg" alt="Toggle Password" width={24} height={24} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                <div className={`w-5 h-5 rounded border ${rememberMe ? 'bg-[#0C83FF] border-[#0C83FF]' : 'border-[#B1B1B1]'} flex items-center justify-center`}>
                  {rememberMe && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <span className="text-sm text-[#343434]">Remember Me</span>
              </label>
              <button onClick={() => setView("forgot-password")} className="text-sm font-bold text-[#0C83FF]">
                Forgot Password?
              </button>
            </div>

            <button className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors">
              Login Now
            </button>
          </div>
        );

      // Other views like forgot-password, success etc. can be implemented similarly
      default:
        return <div className="text-center py-8">Section under development</div>;
    }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden font-onest`}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full animate-slow-zoom">
          <Image src="/dashboard/images/hero-bg/4.png" alt="Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          <div className="space-y-6 text-white max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.5rem] tracking-tight">
              Mount Abu Nagar Parishad Digital Governance System
            </h1>
            <p className="text-lg text-gray-200 sm:text-xl leading-relaxed opacity-90">
              A unified digital platform to process construction and renovation
              applications, manage material tokens, and resolve civic complaints
              efficiently—ensuring transparency, accountability, and streamlined
              municipal governance.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <motion.div 
              layout
              className="w-full max-w-[365px] rounded-xl bg-white p-6 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden"
              transition={{ layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {(view === "citizen" || view === "authority" || view === "otp") && renderTabs()}
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
