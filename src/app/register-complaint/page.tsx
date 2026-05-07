"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useWards, useComplaintCategories } from "@/hooks/useMasterData";
import { ComplaintService } from "@/services/complaintService";
import { AuthService } from "@/services/authService";
import { loginWithOtpAction, signupAction } from "@/app/actions/auth";
import { encryptData } from "@/lib/encryption";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";

export default function RegisterComplaintPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { data: wards = [] } = useWards();
  const { data: categories = [] } = useComplaintCategories();

  // Form State
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_mobile: "",
    category_id: "",
    ward_id: "",
    description: "",
    location_address: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  // UI State
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [isLocating, setIsLocating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Fetch Public Key for encryption
    const fetchKey = async () => {
      try {
        const key = await AuthService.getPublicKey();
        setPublicKey(key);
      } catch (err) {
        console.error("Failed to fetch public key", err);
      }
    };
    fetchKey();

    // Auto-locate on mount
    handleGetLocation();
  }, []);

  // Sync user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        applicant_name: user.name || "",
        applicant_mobile: user.mobile || "",
      }));
      setIsVerified(true);
    }
  }, [user]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          location_address: prev.location_address || `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`
        }));
        setIsLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Please enable location permissions to provide accurate data.");
        setIsLocating(false);
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setFiles(prev => [...prev, newFile]);
      
      const preview = URL.createObjectURL(newFile);
      setPreviews(prev => [...prev, preview]);

      // Reset input value to allow taking the same "filename" if needed 
      // and ensure onChange triggers again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendOtp = async () => {
    if (!formData.applicant_mobile || formData.applicant_mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await AuthService.sendOtp(formData.applicant_mobile);
      setIsOtpSent(true);
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    if (!publicKey) {
      setError("Encryption key not loaded. Please refresh.");
      return;
    }

    setIsVerifying(true);
    setError(null);
    try {
      const encryptedMobile = encryptData(formData.applicant_mobile, publicKey);
      const encryptedOtp = encryptData(otpString, publicKey);

      // Use loginWithOtpAction which handles user creation/login on backend
      const result = await loginWithOtpAction(encryptedMobile, encryptedOtp);
      
      if (result.success) {
        setIsVerified(true);
        setStep("form");
        await queryClient.invalidateQueries({ queryKey: ["user"] });
      } else {
        setError(result.error || "Verification failed");
      }
    } catch (err) {
      setError("An unexpected error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setFormData(prev => ({
      ...prev,
      category_id: "",
      ward_id: "",
      description: "",
      location_address: "",
      latitude: null,
      longitude: null,
    }));
    setFiles([]);
    setPreviews([]);
    setError(null);
    setStep("form");
    handleGetLocation();
  };

  const handleSubmit = async () => {
    if (!isVerified) {
      setError("Please verify your mobile number first");
      return;
    }

    if (!formData.category_id || !formData.ward_id || !formData.description) {
      setError("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const complaintData = {
        ...formData,
        category_id: Number(formData.category_id),
        ward_id: Number(formData.ward_id),
        title: `Public Complaint: ${categories.find(c => c.id === Number(formData.category_id))?.name || "General"}`,
      };

      const complaint = await ComplaintService.createComplaint(complaintData as any);
      
      if (files.length > 0) {
        for (const file of files) {
          await ComplaintService.uploadMedia(complaint.id, file);
        }
      }

      setStep("success");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] font-onest pb-10">
      {/* Header */}
      <div className="bg-white border-b border-[#D6D9DE] px-4 py-4 flex items-center gap-3 sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2">
          <Image src="/dashboard/icons/login/back-arrow.svg" alt="Back" width={20} height={20} />
        </button>
        <h1 className="text-lg font-semibold text-[#343434]">Register Complaint</h1>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full h-[48px] rounded-xl border border-[#D6D9DE] px-4 text-sm outline-none focus:border-[#0C83FF] bg-white disabled:bg-gray-100"
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                />
              </div>

              {/* Mobile & OTP Verification */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Contact Number</label>
                <div className="flex gap-2">
                  <div className="flex-1 flex h-[48px] items-center rounded-xl border border-[#D6D9DE] bg-white px-3">
                    <span className="text-sm text-[#343434] pr-2 border-r border-gray-200">+91</span>
                    <input
                      type="tel"
                      placeholder="Mobile number"
                      disabled={isVerified}
                      className="w-full h-full border-none bg-transparent pl-3 text-sm outline-none disabled:text-gray-500"
                      value={formData.applicant_mobile}
                      onChange={(e) => setFormData({ ...formData, applicant_mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    />
                  </div>
                  {!isVerified && (
                    <button
                      onClick={handleSendOtp}
                      disabled={isSubmitting || formData.applicant_mobile.length !== 10}
                      className="h-[48px] px-4 rounded-xl bg-[#0C83FF] text-white text-sm font-medium disabled:opacity-50"
                    >
                      {isSubmitting ? "..." : "Verify"}
                    </button>
                  )}
                  {isVerified && (
                    <div className="h-[48px] px-4 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                      <Image src="/dashboard/icons/done-tick.svg" alt="Verified" height={20} width={20} />
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Complaint Category</label>
                <select
                  className="w-full h-[48px] rounded-xl border border-[#D6D9DE] px-4 text-sm outline-none focus:border-[#0C83FF] bg-white"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              {/* Ward */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Ward No.</label>
                <select
                  className="w-full h-[48px] rounded-xl border border-[#D6D9DE] px-4 text-sm outline-none focus:border-[#0C83FF] bg-white"
                  value={formData.ward_id}
                  onChange={(e) => setFormData({ ...formData, ward_id: e.target.value })}
                >
                  <option value="">Select Ward</option>
                  {wards.map(ward => <option key={ward.id} value={ward.id}>{ward.name}</option>)}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Describe the issue</label>
                <textarea
                  placeholder="Tell us what's wrong..."
                  className="w-full h-[120px] rounded-xl border border-[#D6D9DE] p-4 text-sm outline-none focus:border-[#0C83FF] bg-white resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Photo Upload (Camera) */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#343434]">Capture Photo</label>
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#D6D9DE]">
                      <Image src={src} alt="Preview" fill className="object-cover" />
                      <button 
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 bg-black/50 p-1 rounded-full"
                      >
                        <Image src="/dashboard/icons/close.svg" alt="Remove" width={12} height={12} className="invert" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-[#D6D9DE] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white transition-colors">
                    <Image src="/dashboard/icons/applications/upload-cloud.svg" alt="Upload" width={32} height={32} />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-gray-500 font-medium">Capture Photo</span>
                      <span className="text-[8px] text-gray-400">(Camera Only)</span>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      onChange={handleFileChange} 
                    />
                  </label>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-[#343434]">Location</label>
                  <button 
                    onClick={handleGetLocation}
                    className="text-xs text-[#0C83FF] font-medium flex items-center gap-1"
                  >
                    {isLocating ? "Locating..." : "Refresh Location"}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Fetching location..."
                  className="w-full h-[48px] rounded-xl border border-[#D6D9DE] px-4 text-sm outline-none focus:border-[#0C83FF] bg-white"
                  value={formData.location_address}
                  onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                />
                {formData.latitude && (
                  <p className="text-[10px] text-gray-400">
                    GPS Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude?.toFixed(6)}
                  </p>
                )}
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isVerified}
                className="w-full h-[54px] rounded-xl bg-[#0C83FF] text-white font-semibold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
              >
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </motion.div>
          ) : step === "otp" ? (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 py-10"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-[#343434]">Verify Phone</h2>
                <p className="text-sm text-gray-500">
                  Enter the 6-digit code sent to<br />
                  <span className="font-semibold text-[#343434]">+91 {formData.applicant_mobile}</span>
                </p>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-full aspect-square text-center text-2xl font-bold rounded-xl border border-[#D6D9DE] focus:border-[#0C83FF] focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                  />
                ))}
              </div>

              {error && <p className="text-xs text-red-500 text-center">{error}</p>}

              <div className="space-y-4">
                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                  className="w-full h-[54px] rounded-xl bg-[#0C83FF] text-white font-semibold text-lg"
                >
                  {isVerifying ? "Verifying..." : "Verify & Continue"}
                </button>
                <button
                  onClick={() => setStep("form")}
                  className="w-full text-sm text-gray-500 font-medium"
                >
                  Change Mobile Number
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Image src="/dashboard/icons/done-tick.svg" alt="Success" width={40} height={40} className="invert-[45%] sepia-[68%] saturate-[414%] hue-rotate-[94deg] brightness-[94%] contrast-[88%]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#343434]">Complaint Registered!</h2>
                <p className="text-sm text-gray-500">
                  Thanks for letting us know! Our authority will look into this and try to fix it as soon as possible.
                </p>
              </div>
              <div className="w-full space-y-3 pt-4">
                <button
                  onClick={handleReset}
                  className="w-full h-[54px] rounded-xl bg-[#0C83FF] text-white font-semibold text-sm"
                >
                  Raise Another Complaint
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full h-[54px] rounded-xl border border-[#D6D9DE] text-[#343434] font-medium text-sm"
                >
                  Take Me Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

