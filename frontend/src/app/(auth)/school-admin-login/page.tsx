"use client";

import { LogIn, Building, Eye, EyeOff, Loader2, Info, X, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SchoolAdminLoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Modals & States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Mocking "first login" logic: if password is "temp123", we consider it a first login.
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      
      // Basic mock auth logic
      if (email && password) {
        if (password === "wrong") {
          setError("Incorrect email or password.");
        } else if (password === "temp123") {
          // Trigger first login flow (handled by dashboard)
          alert("Welcome, School Admin!");
          router.push('/dashboard/school-admin?first_login=true');
        } else {
          alert("Welcome, School Admin!");
          router.push('/dashboard/school-admin');
        }
      }
    }, 800);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    
    // Simulate sending email
    setTimeout(() => {
      setResetSent(true);
    }, 600);
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 relative">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-[#1D6A4A] opacity-5"></div>
      </div>

      <div className="max-w-[420px] w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 z-10">
        
        {/* Header */}
        <div className="bg-[#1D6A4A] px-6 py-10 text-center text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex justify-center mb-4 relative z-10">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-sm border border-white/20">
              <Building className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight relative z-10">EduOlympia</h2>
          <p className="text-green-100 mt-1 font-medium relative z-10 text-sm tracking-wider uppercase">School Admin Portal</p>
        </div>
        
        {/* Body */}
        <div className="p-8">
          
          {/* First Login Banner */}
          <div className="mb-6 bg-blue-50 border border-blue-100 p-3.5 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              First time? Use the temporary password from your welcome email, then set a new one.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">School admin email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="principal@school.edu"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A] focus:bg-white outline-none transition-all duration-200 text-gray-900 text-sm"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Enter password (e.g. temp123)"
                  className={`w-full pl-4 pr-11 py-3 bg-gray-50 border ${error ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A] focus:bg-white outline-none transition-all duration-200 text-gray-900 text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-600 font-bold mt-2 animate-in fade-in slide-in-from-top-1">{error}</p>
              )}
            </div>

            <div className="flex justify-end mt-1">
              <button 
                type="button"
                onClick={() => { setShowForgotModal(true); setResetSent(false); setForgotEmail(""); }}
                className="text-xs text-[#1D6A4A] font-bold hover:underline transition-colors"
              >
                Forgot your password?
              </button>
            </div>
            
            <button 
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-[#1D6A4A] hover:bg-green-800 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-colors shadow-md shadow-green-700/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <LogIn className="w-5 h-5" />
                  Log In to School Portal
                </>
              )}
            </button>
          </form>
          
        </div>
      </div>

      {/* Back to Main Site */}
      <div className="mt-8 relative z-10 text-center">
        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          Not a school admin? Visit EduOlympia.com
        </Link>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Reset Password</h3>
              <button onClick={() => setShowForgotModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {resetSent ? (
                <div className="text-center py-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Check Your Email</h4>
                  <p className="text-sm text-gray-500 mb-6">
                    If an account exists for <span className="font-bold text-gray-700">{forgotEmail}</span>, we have sent a secure password reset link.
                  </p>
                  <button 
                    onClick={() => setShowForgotModal(false)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p className="text-sm text-gray-600 mb-5">
                    Enter the email address associated with your school's account, and we'll send you a link to reset your password.
                  </p>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    autoFocus
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="principal@school.edu"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-700/20 focus:border-[#1D6A4A] focus:bg-white outline-none transition-all duration-200 text-gray-900 text-sm mb-6"
                  />
                  <button 
                    type="submit"
                    disabled={!forgotEmail}
                    className="w-full bg-[#1D6A4A] hover:bg-green-800 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
