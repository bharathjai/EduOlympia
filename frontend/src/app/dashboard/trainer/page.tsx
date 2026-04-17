"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  Calendar,
  UploadCloud,
  Sparkles,
  FileText,
  TrendingUp,
  Video,
  Calculator,
  PieChart
} from "lucide-react";

export default function TrainerDashboard() {
  return (
    <DashboardLayout 
      role="trainer" 
      userName="Rahul Singh" 
      userDescription="Trainer - Mathematics"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Good Morning, Rahul! <span className="text-2xl">👋</span>
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your training today.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-[#FAF5FF] rounded-2xl p-5 border border-purple-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-[#E9D8FD] text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-600 mb-0.5 uppercase tracking-wider">Total Students</p>
            <p className="text-xl font-extrabold text-gray-900">2,847</p>
          </div>
        </div>
        
        <div className="bg-[#F0FDF4] rounded-2xl p-5 border border-emerald-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-[#D1FAE5] text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-600 mb-0.5 uppercase tracking-wider">Materials Published</p>
            <p className="text-xl font-extrabold text-gray-900">56</p>
          </div>
        </div>

        <div className="bg-[#EFF6FF] rounded-2xl p-5 border border-blue-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-[#DBEAFE] text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-600 mb-0.5 uppercase tracking-wider">Questions Created</p>
            <p className="text-xl font-extrabold text-gray-900">3,420</p>
          </div>
        </div>

        <div className="bg-[#FFFBEB] rounded-2xl p-5 border border-orange-100 flex items-center gap-4">
          <div className="w-11 h-11 bg-[#FEF3C7] text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-orange-600 mb-0.5 uppercase tracking-wider">Live Classes</p>
            <p className="text-xl font-extrabold text-gray-900">5</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              <button className="flex flex-col items-start text-left p-6 rounded-2xl transition-all group bg-[#F3F0FF] hover:bg-[#EBE5FF]">
                <div className="text-brand mb-5">
                  <UploadCloud className="w-8 h-8" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Upload Study Material</h3>
                  <p className="text-xs text-gray-500 mt-1.5">Notes, PDFs, Videos</p>
                </div>
              </button>

              <button className="flex flex-col items-start text-left p-6 rounded-2xl transition-all group bg-[#ECFDF5] hover:bg-[#D1FAE5]">
                <div className="text-emerald-600 mb-5">
                  <Sparkles className="w-8 h-8" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Generate Questions with AI</h3>
                  <p className="text-xs text-gray-500 mt-1.5">Create from Topic</p>
                </div>
              </button>

              <button className="flex flex-col items-start text-left p-6 rounded-2xl transition-all group bg-[#EFF6FF] hover:bg-[#DBEAFE]">
                <div className="text-blue-600 mb-5">
                  <FileText className="w-8 h-8" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Create Practice Paper</h3>
                  <p className="text-xs text-gray-500 mt-1.5">From Question Bank</p>
                </div>
              </button>

              <button className="flex flex-col items-start text-left p-6 rounded-2xl transition-all group bg-[#FFFBEB] hover:bg-[#FEF3C7]">
                <div className="text-amber-600 mb-5">
                  <Calendar className="w-8 h-8" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Schedule Live Class</h3>
                  <p className="text-xs text-gray-500 mt-1.5">Set Date & Time</p>
                </div>
              </button>
            </div>
          </section>

          {/* Upcoming Live Classes */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Live Classes</h2>
              <button className="text-sm text-brand font-medium hover:underline">View Calendar</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-[#F3F0FF] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-brand/10 text-brand text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Today</span>
                    <span className="text-xs text-gray-600 font-medium">04:00 PM - 05:00 PM</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-[15px] mb-1">Mensuration - Area & Perimeter</h3>
                  <p className="text-xs text-gray-500 mb-3">Class 8 • Mathematics</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium mb-4 relative z-10">
                    <Users className="w-4 h-4" />
                    156 Students Registered
                  </div>
                </div>
                
                <div className="relative z-10">
                  <button className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 w-fit">
                    <Video className="w-4 h-4" />
                    Start Class
                  </button>
                </div>

                {/* Decorative Graphic */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1 -right-2 text-brand opacity-60">
                  <Calculator className="w-24 h-24" strokeWidth={1} />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Tomorrow</span>
                    <span className="text-xs text-gray-600 font-medium">11:00 AM - 12:00 PM</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-[15px] mb-1 leading-snug pr-8">Graphical Representation of Data</h3>
                  <p className="text-xs text-gray-500 mb-3">Class 9 • Mathematics</p>
                  
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium mb-4 relative z-10">
                    <Users className="w-4 h-4" />
                    142 Students Registered
                  </div>
                </div>
                
                <div className="relative z-10">
                  <button className="bg-white hover:bg-gray-50 text-brand border border-brand/30 hover:border-brand text-sm font-semibold py-1.5 px-6 rounded-lg transition-colors w-fit">
                    View Details
                  </button>
                </div>

                {/* Decorative Graphic */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-50 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 -right-2 text-slate-400 opacity-50">
                  <PieChart className="w-24 h-24" strokeWidth={1} />
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-brand font-medium hover:underline">View All</button>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-2">
              {[
                { title: 'Uploaded: "Quadratic Equations - Notes.pdf"', subtitle: "Mathematics • Class 9", time: "2 hours ago", icon: FileText, color: "text-orange-500", bg: "bg-orange-100" },
                { title: 'Generated 25 MCQs for "Linear Equations"', subtitle: "AI Question Generator", time: "Yesterday", icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-100" },
                { title: 'Created Practice Paper: Mathematics - Chapter 2', subtitle: "30 Questions • Class 8", time: "2 days ago", icon: FileText, color: "text-brand", bg: "bg-brand/10" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${activity.bg} ${activity.color} rounded-full flex items-center justify-center`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <section className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
              <button className="text-sm text-brand font-medium hover:underline">Analytics</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Avg. Test Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-gray-900">78.6%</p>
                  <span className="text-xs text-emerald-500 font-medium flex items-center pb-1">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> 5.2%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Students Improved</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-gray-900">62%</p>
                  <span className="text-xs text-emerald-500 font-medium flex items-center pb-1">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> 8.1%
                  </span>
                </div>
              </div>
            </div>

            {/* Mock Chart Area */}
            <div className="h-40 bg-gradient-to-t from-brand/5 to-transparent border-b border-brand rounded-lg relative flex items-end px-2">
              <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 Q25,60 50,70 T100,30 L100,100 L0,100 Z" fill="url(#grad)" opacity="0.1" />
                <path d="M0,80 Q25,60 50,70 T100,30" fill="none" stroke="#4F46E5" strokeWidth="2" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </section>

          <section className="bg-gradient-to-br from-brand to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-brand/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold">Try AI Doubt Assistant</h2>
            </div>
            <p className="text-sm text-white/80 mb-6">Get instant answers and explanations for student doubts.</p>
            <button className="w-full bg-white text-brand font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              Open Assistant
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
