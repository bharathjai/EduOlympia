"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

function TrainerLoginContent() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

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
          router.push('/dashboard/trainer');
        }, 1500);
      }
    }, 1500);
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
            <p className="font-bold text-white">Welcome, {email.split('@')[0]}!</p>
            <p className="text-sm text-slate-400 font-medium">Redirecting to Trainer Dashboard...</p>
          </div>
        </div>
      )}

      {/* Left Branding Section (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] xl:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-center items-center">
        {/* Abstract animated gradient meshes - Purple accent */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/20 blur-[140px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        
        <div className="relative z-10 w-full max-w-lg px-12 xl:px-16">
          <div className="w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl mb-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
            EduOlympia <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-300">Trainer Portal</span>
          </h1>
          
          <p className="text-lg xl:text-xl text-slate-400 font-medium mb-12 leading-relaxed max-w-md">
            Manage your classes, track student progress, and evaluate olympiad performance.
          </p>
          
          <div className="flex items-center p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full max-w-max pr-6 shadow-2xl">
            <div className="flex -space-x-3 mr-4">
               <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-purple-400 to-purple-600 shadow-inner"></div>
               <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 shadow-inner z-10"></div>
               <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-pink-400 to-pink-600 shadow-inner z-20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">+</span>
               </div>
            </div>
            <p className="text-sm text-slate-300 font-medium">Join our expert faculty network</p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Subtle background decoration for light mode */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-50/50 to-transparent rounded-bl-full opacity-60 -z-10" />
        
        <div className="w-full max-w-[440px]">
          
          {/* Mobile Header */}
          <div className="flex lg:hidden flex-col items-center text-center mb-10">
            <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30 mb-5">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">EduOlympia</h2>
            <p className="text-sm text-purple-600 mt-2 font-bold uppercase tracking-widest">Trainer Portal</p>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h3>
            <p className="text-slate-500 text-base mt-3 font-medium">Please sign in to your trainer account.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-purple-600">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="Trainer email address"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border ${emailError ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-purple-500 focus:ring-purple-500/10'} rounded-2xl focus:bg-white focus:ring-4 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm`}
                  disabled={isLoading}
                />
              </div>
              {emailError && <p className="text-xs font-semibold text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/>{emailError}</p>}
            </div>
            
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700 transition-colors group-focus-within:text-purple-600">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border ${isError ? 'border-red-400 focus:ring-red-500/10' : 'border-slate-200 hover:border-slate-300 focus:border-purple-500 focus:ring-purple-500/10'} rounded-2xl focus:bg-white focus:ring-4 outline-none transition-all text-sm font-medium text-slate-900 shadow-sm`}
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
                   <p className="text-sm text-red-700 font-semibold leading-tight">Invalid credentials. Contact your admin if the issue persists.</p>
                </div>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold h-[52px] rounded-2xl flex justify-center items-center gap-2 transition-all duration-300 shadow-xl shadow-purple-600/20 active:scale-[0.98] mt-8 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Log In to Trainer Portal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
             <a href="mailto:admin@eduolympia.com?subject=Trainer%20Login%20Issue" className="text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors">
               Having trouble? Contact admin@eduolympia.com
             </a>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function TrainerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>}>
      <TrainerLoginContent />
    </Suspense>
  );
}
