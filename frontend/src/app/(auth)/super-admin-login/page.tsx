"use client";

import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [countdown, setCountdown] = useState(60);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Auto-submit OTP
  useEffect(() => {
    if (step === "otp" && otp.length === 6 && !loading && failedAttempts < 5) {
      handleVerifyOtp();
    }
  }, [otp]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (failedAttempts >= 5) return;
    
    // Basic email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate validation
    setTimeout(() => {
      setLoading(false);
      if (email === "admin@eduolympia.com" || email.includes("admin")) {
        setStep("otp");
        setCountdown(60);
        setOtp("");
      } else {
        setError("Invalid credentials");
      }
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      // Mock correct OTP: "123456"
      if (otp === "123456" || otp === "000000") {
        alert("Welcome back, System Admin.");
        router.push('/dashboard/super-admin');
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 5) {
          setError("Account locked. Contact platform support.");
        } else {
          setError(`Incorrect code. ${5 - newAttempts} attempts remaining.`);
          setOtp("");
        }
      }
    }, 1000);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    setOtp("");
    setError("");
    alert("Code resent");
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";
  const isLocked = failedAttempts >= 5;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-[400px] w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-8 text-center bg-white border-b border-gray-100">
          <div className="flex justify-center mb-3">
            <div className="bg-[#B45309] p-3 rounded-xl shadow-sm">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">EduOlympia</h2>
          <p className="text-[#B45309] mt-1 font-semibold text-sm">Platform Administration</p>
        </div>
        
        {/* Body */}
        <div className="p-8">
          {step === "credentials" ? (
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin email address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked || loading}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 focus:bg-white outline-none transition-all duration-200 text-gray-900 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLocked || loading}
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 focus:bg-white outline-none transition-all duration-200 text-gray-900 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked || loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && !isLocked && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}
              
              {isLocked ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                  <p className="text-sm text-red-700 font-bold">Account locked. Contact platform support.</p>
                </div>
              ) : (
                <button 
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full bg-[#B45309] hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50 mt-4"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
                </button>
              )}
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mt-2">We sent a code to your email.</p>
              </div>

              <div>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={isLocked || loading}
                  placeholder="000000"
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 focus:bg-white outline-none transition-all duration-200 text-gray-900"
                />
              </div>

              {error && !isLocked && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}

              {isLocked ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                  <p className="text-sm text-red-700 font-bold">Account locked. Contact platform support.</p>
                </div>
              ) : (
                <div>
                  {loading && <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#B45309] mb-4" />}
                  <button 
                    onClick={handleResend}
                    disabled={countdown > 0}
                    className={`text-sm font-medium transition-colors ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#B45309] hover:underline'}`}
                  >
                    {countdown > 0 ? `Resend in 0:${countdown.toString().padStart(2, '0')}` : 'Resend code'}
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                    setError("");
                  }}
                  disabled={loading}
                  className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                  Back to login
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            EduOlympia Platform v1.0 <span className="mx-2">|</span> Secure Admin Access
          </p>
        </div>

      </div>
    </div>
  );
}
