"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Sparkles, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSetupMode = searchParams.get("setup") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [emailError, setEmailError] = useState("");
  
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFirstTimeBanner, setShowFirstTimeBanner] = useState(true);
  
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  
  const [successToast, setSuccessToast] = useState(false);

  // Strength indicator
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  
  const strengthScore = calculateStrength(password);
  
  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("");
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setIsError(true);
      return;
    }
    
    setIsLoading(true);
    setIsError(false);
    
    // Simulate API call
    setTimeout(() => {
      if (email === "error@test.com" || password === "wrong") {
        setIsError(true);
        setIsLoading(false);
      } else {
        setSuccessToast(true);
        setTimeout(() => {
          router.push('/dashboard/student');
        }, 1500);
      }
    }, 1500);
  };
  
  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword || password.length < 8) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setSuccessToast(true);
      setTimeout(() => {
        router.push('/dashboard/student');
      }, 1500);
    }, 1500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-4 flex items-center space-x-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="font-bold text-white">Welcome back!</p>
            <p className="text-sm text-slate-400 font-medium">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}

      {/* Left Branding Section (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] xl:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-center items-center">
        {/* Abstract animated gradient meshes */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[140px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        
        <div className="relative z-10 w-full max-w-lg px-12 xl:px-16">
          <div className="w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl mb-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
            Your Olympiad <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Journey Starts Here</span>
          </h1>
          
          <p className="text-lg xl:text-xl text-slate-400 font-medium mb-12 leading-relaxed max-w-md">
            Unlock your potential, compete globally, and achieve excellence with EduOlympia's premier platform.
          </p>
          
          <div className="flex items-center p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full max-w-max pr-6 shadow-2xl">
            <div className="flex -space-x-3 mr-4">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-blue-400 to-blue-600 shadow-inner"></div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-inner z-10"></div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-purple-400 to-purple-600 shadow-inner z-20"></div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-inner z-30 flex items-center justify-center">
                 <span className="text-[10px] font-bold text-white">+</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 font-medium">Join <span className="text-white font-bold">10,000+</span> top students</p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Subtle background decoration for light mode */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-50/50 to-transparent rounded-bl-full opacity-60 -z-10" />
        
        <div className="w-full max-w-[440px]">
          
          {/* Mobile Header */}
          <div className="flex lg:hidden flex-col items-center text-center mb-10">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mb-5">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">EduOlympia</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">Your Olympiad Journey Starts Here</p>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{isSetupMode ? 'Set your password' : 'Welcome back'}</h3>
            <p className="text-slate-500 text-base mt-3 font-medium">{isSetupMode ? 'Create a secure password to activate your account.' : 'Please enter your details to sign in.'}</p>
          </div>

          {/* First Time Banner */}
          {!isSetupMode && showFirstTimeBanner && (
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/60 p-4 rounded-2xl mb-8 flex items-start shadow-sm transition-all hover:shadow-md">
              <div className="bg-amber-100 p-2 rounded-xl mr-4 shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 mb-0.5">First time here?</h4>
                <p className="text-sm text-amber-700 font-medium leading-snug">Check your school email for your account setup link.</p>
              </div>
            </div>
          )}

          {isSetupMode ? (
            <form onSubmit={handleSetupSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm"
                      disabled={isLoading}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {/* Strength Indicator */}
                  {password.length > 0 && (
                    <div className="mt-3">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div 
                            key={level} 
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                              strengthScore >= level 
                                ? level <= 2 ? 'bg-amber-400' : level === 3 ? 'bg-blue-400' : 'bg-emerald-500' 
                                : 'bg-slate-100'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-2 flex items-center">
                        {strengthScore < 2 && <span className="text-amber-500">Weak</span>}
                        {strengthScore === 2 && <span className="text-amber-500">Fair</span>}
                        {strengthScore === 3 && <span className="text-blue-500">Good</span>}
                        {strengthScore === 4 && <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Strong</span>}
                        <span className="mx-2">•</span>
                        Min. 8 characters
                      </p>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm"
                      disabled={isLoading}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || password.length < 8 || password !== confirmPassword}
                className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold h-[52px] rounded-2xl flex justify-center items-center gap-2 transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20 active:scale-[0.98] mt-8 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Setup...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-blue-600">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    placeholder="student@school.edu"
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border ${emailError ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10'} rounded-2xl focus:bg-white focus:ring-4 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm`}
                    disabled={isLoading}
                  />
                </div>
                {emailError && <p className="text-xs font-semibold text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/>{emailError}</p>}
              </div>
              
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700 transition-colors group-focus-within:text-blue-600">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setShowForgotModal(true)}
                    className="text-sm text-slate-500 font-bold hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border ${isError ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/10'} rounded-2xl focus:bg-white focus:ring-4 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm`}
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md hover:bg-slate-100 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {isError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                     <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                     <p className="text-sm text-red-700 font-semibold leading-tight">Incorrect email or password. Please try again.</p>
                  </div>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold h-[52px] rounded-2xl flex justify-center items-center gap-2 transition-all duration-300 shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20 active:scale-[0.98] mt-8 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal (Glassmorphism Overlay) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="p-8">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h3>
              
              {forgotSent ? (
                <div className="py-2">
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6">
                    <p className="text-sm text-green-800 font-medium leading-relaxed">
                      If an account exists for <span className="font-bold">{forgotEmail}</span>, a secure reset link has been dispatched to your inbox.
                    </p>
                  </div>
                  <button 
                    onClick={() => { setShowForgotModal(false); setForgotSent(false); setForgotEmail(""); }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 rounded-2xl transition-colors text-sm"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p className="text-sm text-slate-500 font-medium mb-6">
                    Enter your school email address below. We'll send you a secure link to create a new password.
                  </p>
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@school.edu"
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl transition-colors text-sm"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!forgotEmail || isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 text-sm flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Link"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

