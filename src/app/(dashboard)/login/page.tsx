"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

type LoginView = 
  | "citizen" 
  | "authority" 
  | "otp" 
  | "forgot-password" 
  | "reset-otp" 
  | "new-password" 
  | "success";

export default function LoginPage() {
  const [view, setView] = useState<LoginView>("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    
    // Auto focus next input
    if (digit !== "" && index < 4) {
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

  const renderTabs = () => (
    <div className="mb-8 flex rounded-lg bg-[#F7F7F7] p-[6px] relative h-11">
      {/* Background highlight for active tab */}
      <motion.div
        className="absolute h-[32px] w-[calc(50%-6px)] rounded-md bg-[#E7F3FF]"
        animate={{ x: view === "citizen" || view === "otp" ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ left: 6, top: 6 }}
      />
      <button
        onClick={() => setView("citizen")}
        className={`relative flex flex-1 items-center justify-center gap-2 py-2 text-xs font-semibold transition-colors ${
          view === "citizen" || view === "otp" ? "text-[#0C83FF]" : "text-[#343434]"
        }`}
      >
        <Image
          src="/dashboard/icons/citizen.svg"
          alt="Citizen"
          width={16}
          height={16}
          className={view === "citizen" || view === "otp" ? "" : "opacity-60"}
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

            <div className="flex h-[54px] items-center rounded-lg border border-[#B1B1B1] bg-white px-3">
              <div className="flex h-full items-center gap-1 pr-3 border-r border-[#343434]/30">
                <Image
                  src="/dashboard/icons/flag.svg"
                  alt="Flag"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="text-sm text-[#343434]">+91</span>
                <Image
                  src="/dashboard/icons/login/dropdown.svg"
                  alt="Dropdown"
                  width={6}
                  height={3}
                  className="opacity-60"
                />
              </div>
              <input
                type="tel"
                className="w-full h-full border-none bg-transparent pl-3 text-sm text-[#343434] placeholder-[#343434]/30 focus:ring-0 focus:outline-none"
                placeholder="Enter your mobile number"
              />
            </div>

            <button
              onClick={() => setView("otp")}
              className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors"
            >
              Get OTP
            </button>
          </div>
        );

      case "otp":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#343434]">Enter OTP Code</h2>
              <p className="text-xs text-[#343434]">
                Enter 5 digit code sent to +91-8947382953
              </p>
            </div>

            <div className="flex justify-between gap-3">
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
                    className="absolute inset-0 z-10 h-full w-full rounded-lg border border-[#B1B1B1] bg-transparent text-center text-[28px] font-bold text-[#343434] focus:border-[#0C83FF] focus:ring-1 focus:ring-[#0C83FF] outline-none caret-transparent"
                  />
                  {digit === "" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="6.5" cy="6.5" r="6.5" fill="#DDDDDD" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-[#343434]">Didn’t received OTP?</span>
              <button className="font-bold text-[#0C83FF]">Resend Now</button>
            </div>

            <button
              className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors"
            >
              Login Now
            </button>

            <button
              onClick={() => setView("citizen")}
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
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <div className={`w-5 h-5 rounded border ${rememberMe ? 'bg-[#0C83FF] border-[#0C83FF]' : 'border-[#B1B1B1]'} flex items-center justify-center`}>
                  {rememberMe && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <span className="text-sm text-[#343434]">Remember Me</span>
              </label>
              <button onClick={() => setView("forgot-password")} className="text-sm font-bold text-[#0C83FF]">
                Forgot Password?
              </button>
            </div>

            <button
              className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors"
            >
              Login Now
            </button>
          </div>
        );

      case "forgot-password":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#343434]">Reset your password</h2>
              <p className="text-xs text-[#343434]">
                A 5 digit code will be sent to your Email/Contact Number
              </p>
            </div>

            <div className="h-[54px] rounded-lg border border-[#B1B1B1] bg-white px-3">
              <input
                type="text"
                className="w-full h-full border-none bg-transparent text-sm text-[#343434] placeholder-[#343434]/30 focus:ring-0 focus:outline-none"
                placeholder="Username/Email/Contact number"
              />
            </div>

            <button
              onClick={() => setView("reset-otp")}
              className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors"
            >
              Reset Password
            </button>

            <button
              onClick={() => setView("authority")}
              className="flex h-[54px] w-full items-center justify-center gap-2 rounded-lg border border-[#C9C9C9] text-sm font-normal text-[#343434] hover:bg-gray-50 transition-colors"
            >
              <Image src="/dashboard/icons/login/back-arrow.svg" alt="" width={20} height={20} />
              Back to login
            </button>
          </div>
        );

      case "reset-otp":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#343434]">Check your email/contact</h2>
              <p className="text-xs text-[#343434]">
                Enter 5 digit code sent to +91-8947382953
              </p>
            </div>

            <div className="flex justify-between gap-3">
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
                    className="absolute inset-0 z-10 h-full w-full rounded-lg border border-[#B1B1B1] bg-transparent text-center text-[28px] font-bold text-[#343434] focus:border-[#0C83FF] focus:ring-1 focus:ring-[#0C83FF] outline-none caret-transparent"
                  />
                  {digit === "" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="6.5" cy="6.5" r="6.5" fill="#DDDDDD" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-[#343434]">Didn’t received OTP?</span>
              <button className="font-bold text-[#0C83FF]">Resend Now</button>
            </div>

            <button
              onClick={() => setView("new-password")}
              className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors"
            >
              Next
            </button>

            <button
              onClick={() => setView("authority")}
              className="flex h-[54px] w-full items-center justify-center gap-2 rounded-lg border border-[#C9C9C9] text-sm font-normal text-[#343434] hover:bg-gray-50 transition-colors"
            >
              <Image src="/dashboard/icons/login/back-arrow.svg" alt="" width={20} height={20} />
              Back to login
            </button>
          </div>
        );

      case "new-password":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#343434]">Set new password</h2>
              <p className="text-xs text-[#343434]">
                Enter 5 digit code sent to +91-8947382953
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-[54px] items-center justify-between rounded-lg border border-[#B1B1B1] bg-white px-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-full border-none bg-transparent text-sm text-[#343434] placeholder-[#343434]/30 focus:ring-0 focus:outline-none"
                  placeholder="Enter New password"
                />
                <button onClick={() => setShowPassword(!showPassword)}>
                  <Image src="/dashboard/icons/login/visibility.svg" alt="Toggle Password" width={24} height={24} />
                </button>
              </div>

              <div className="flex h-[54px] items-center justify-between rounded-lg border border-[#B1B1B1] bg-white px-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-full border-none bg-transparent text-sm text-[#343434] placeholder-[#343434]/30 focus:ring-0 focus:outline-none"
                  placeholder="Confirm password"
                />
                <button onClick={() => setShowPassword(!showPassword)}>
                  <Image src="/dashboard/icons/login/visibility.svg" alt="Toggle Password" width={24} height={24} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Image src="/dashboard/icons/login/validation-check.svg" alt="" width={16} height={16} />
                <span className="text-xs text-[#059669]">must be at lease 8 characters</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src="/dashboard/icons/login/validation-check.svg" alt="" width={16} height={16} className="grayscale" />
                <span className="text-xs text-[#343434]">must contain one special character</span>
              </div>
            </div>

            <button
              onClick={() => setView("success")}
              className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors"
            >
              Reset Password
            </button>

            <button
              onClick={() => setView("authority")}
              className="flex h-[54px] w-full items-center justify-center gap-2 rounded-lg border border-[#C9C9C9] text-sm font-normal text-[#343434] hover:bg-gray-50 transition-colors"
            >
              <Image src="/dashboard/icons/login/back-arrow.svg" alt="" width={20} height={20} />
              Back to login
            </button>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center text-center space-y-6">
            <Image src="/dashboard/icons/login/success-check.svg" alt="Success" width={64} height={64} />
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-[#343434]">Password Reset!</h2>
              <p className="text-xs text-[#343434]">
                You have successfully created new password.
              </p>
              <p className="text-xs text-[#343434]">
                Click below to login
              </p>
            </div>

            <button
              onClick={() => setView("authority")}
              className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#0C83FF] text-sm font-normal text-white hover:bg-blue-600 transition-colors"
            >
              Log in
            </button>
          </div>
        );
    }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden font-onest`}>
      {/* Background with Animation */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full animate-slow-zoom">
          <Image
            src="/dashboard/images/hero-bg/4.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Left Side: Text Content */}
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

          {/* Right Side: Login Card */}
          <div className="flex justify-center lg:justify-end">
            <motion.div 
              layout
              className="w-full max-w-[365px] rounded-xl bg-white p-6 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden"
              transition={{ 
                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
              }}
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
