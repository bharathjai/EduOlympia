"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
  PlayCircle, 
  Award, 
  CheckSquare, 
  Flame,
  Calendar,
  ClipboardList,
  Video,
  ArrowRight
} from "lucide-react";

export default function StudentDashboard() {
  return (
    <DashboardLayout 
      role="student" 
      userName="Aarav Sharma" 
      userDescription="Class 8 • Delhi Public School"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Good Morning, Aarav! <span className="text-2xl">👋</span>
        </h1>
        <p className="text-gray-500 mt-1">Let's continue your Olympiad preparation today.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Study Streak</p>
            <p className="text-2xl font-bold text-gray-900">12 Days</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Tests Attempted</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Current Rank</p>
            <p className="text-2xl font-bold text-gray-900">#156</p>
          </div>
        </div>

        <div className="bg-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">78.6%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
              <button className="text-sm text-brand font-medium hover:underline">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all group cursor-pointer">
                <div className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded w-fit mb-4">Mathematics</div>
                <div className="h-20 flex items-center justify-center mb-4">
                   <div className="text-5xl">➗</div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Number System</h3>
                <p className="text-xs text-gray-500 mb-4">Chapter 1 • Class 8</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                  <div className="bg-brand h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mb-4">65% Complete</p>
                <button className="w-full bg-brand text-white text-sm font-medium py-2 rounded-xl group-hover:bg-brand-hover transition-colors">
                  Continue Study
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all group cursor-pointer">
                <div className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded w-fit mb-4">Science</div>
                <div className="h-20 flex items-center justify-center mb-4">
                   <div className="text-5xl">🔬</div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Force and Pressure</h3>
                <p className="text-xs text-gray-500 mb-4">Chapter 3 • Class 8</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                  <div className="bg-brand h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mb-4">40% Complete</p>
                <button className="w-full bg-brand text-white text-sm font-medium py-2 rounded-xl group-hover:bg-brand-hover transition-colors">
                  Continue Study
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all group cursor-pointer">
                <div className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded w-fit mb-4">Logical Reasoning</div>
                <div className="h-20 flex items-center justify-center mb-4">
                   <div className="text-5xl">🧩</div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Analogy and Patterns</h3>
                <p className="text-xs text-gray-500 mb-4">Chapter 2 • Class 8</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                  <div className="bg-brand h-1.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mb-4">20% Complete</p>
                <button className="w-full bg-brand text-white text-sm font-medium py-2 rounded-xl group-hover:bg-brand-hover transition-colors">
                  Continue Study
                </button>
              </div>
            </div>
          </section>

          {/* Recommended for You */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
              <button className="text-sm text-brand font-medium hover:underline">View All</button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all group cursor-pointer flex gap-5">
                <div className="w-24 h-24 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
                  <ClipboardList className="w-10 h-10 text-yellow-600" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2 uppercase tracking-wide">Practice Test</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Full Length Test - Science</h3>
                  <p className="text-xs text-gray-500 mb-3">20 Questions • 60 Minutes</p>
                  <button className="text-sm text-brand font-bold flex items-center gap-1 group-hover:text-brand-hover transition-colors">
                    Start Test <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all group cursor-pointer flex gap-5">
                <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Video className="w-10 h-10 text-blue-600" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2 uppercase tracking-wide">Video Lesson</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Introduction to Graphs</h3>
                  <p className="text-xs text-gray-500 mb-3">Mathematics • 15 Minutes</p>
                  <button className="text-sm text-brand font-bold flex items-center gap-1 group-hover:text-brand-hover transition-colors">
                    Watch Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Schedule</h2>
              <button className="text-sm text-brand font-medium hover:underline">View Calendar</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Live Class: Algebra Basics</p>
                  <p className="text-xs text-gray-500 mt-1">Today, 4:00 PM - 5:00 PM</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Practice Test - Mathematics</p>
                  <p className="text-xs text-gray-500 mt-1">Tomorrow, 10:00 AM</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">School Level Olympiad</p>
                  <p className="text-xs text-gray-500 mt-1">10 December 2024</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-purple-50 border border-purple-100 rounded-3xl p-8">
             <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="24" fill="#F3F0FF"/>
                    {/* Ears */}
                    <path d="M12 24C10.8954 24 10 24.8954 10 26V30C10 31.1046 10.8954 32 12 32" stroke="#D8B4FE" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M36 24C37.1046 24 38 24.8954 38 26V30C38 31.1046 37.1046 32 36 32" stroke="#D8B4FE" strokeWidth="2" strokeLinecap="round"/>
                    {/* Antenna Base & Line */}
                    <path d="M24 16L24 12" stroke="#5B21B6" strokeWidth="2" strokeLinecap="round"/>
                    {/* Antenna Top */}
                    <circle cx="24" cy="11" r="2" fill="#5B21B6"/>
                    {/* Head */}
                    <rect x="12" y="16" width="24" height="20" rx="8" fill="#5B21B6"/>
                    {/* Eyes */}
                    <circle cx="18" cy="24" r="2.5" fill="white"/>
                    <circle cx="30" cy="24" r="2.5" fill="white"/>
                    {/* Mouth */}
                    <path d="M22 30H26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                   <h3 className="font-extrabold text-gray-900 text-xl flex items-center gap-3">
                     Ask EduOlympia AI 
                     <span className="bg-purple-200 text-purple-700 text-xs px-2 py-0.5 rounded-md font-bold">BETA</span>
                   </h3>
                   <p className="text-sm text-gray-500 mt-1.5">Have a doubt? Ask our AI Assistant!</p>
                </div>
             </div>
             
             <div className="flex gap-3">
               <input type="text" placeholder="Type your question here..." className="flex-1 text-base px-5 py-4 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand" />
               <button className="bg-brand text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-brand-hover shadow-md transition-colors">Ask</button>
             </div>
             <p className="text-xs text-gray-500 mt-4 text-center font-medium">Try: "Explain Pythagoras Theorem" or "What is photosynthesis?"</p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
