"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");

  const handleLogin = () => {
    if (activeTab === "teacher") {
      router.push('/dashboard/trainer');
    } else {
      router.push('/dashboard/student');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] p-4">
      <div className="max-w-[400px] w-full bg-white rounded-[2rem] shadow-2xl shadow-brand/10 overflow-hidden border border-white/50">
        <div className="bg-gradient-to-br from-brand to-purple-600 px-6 py-8 text-center text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="flex justify-center mb-5 relative z-10">
            <div className="bg-white/20 p-3.5 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight relative z-10">EduOlympia</h2>
          <p className="text-white/80 mt-2 font-medium relative z-10">Sign in to your account</p>
        </div>
        
        <div className="p-7">
          {/* Tabs */}
          <div className="flex bg-gray-50/80 p-1.5 rounded-xl mb-7 border border-gray-100">
            <button
              type="button"
              onClick={() => setActiveTab("student")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === "student" ? "bg-white text-brand shadow-sm shadow-gray-200" : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("teacher")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                activeTab === "teacher" ? "bg-white text-brand shadow-sm shadow-gray-200" : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              Teacher
            </button>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white outline-none transition-all duration-200 text-gray-900 text-sm"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs text-brand font-bold hover:text-brand-hover hover:underline transition-colors">Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white outline-none transition-all duration-200 text-gray-900 text-sm"
              />
            </div>
            
            <button 
              type="button"
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-brand to-purple-600 hover:from-brand-hover hover:to-purple-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all duration-300 shadow-lg shadow-brand/30 hover:shadow-xl hover:shadow-brand/40 hover:-translate-y-0.5 active:scale-[0.98] mt-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? Contact your school administrator.
          </div>
        </div>
      </div>
    </div>
  );
}
