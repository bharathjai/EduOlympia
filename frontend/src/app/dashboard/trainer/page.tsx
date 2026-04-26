"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
  Users, BookOpen, HelpCircle, Calendar, UploadCloud, Sparkles, FileText, 
  TrendingUp, TrendingDown, Video, MessageSquare, BarChart3, Clock, ArrowRight, PlayCircle, CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

// --- MOCK DATA FOR CHARTS/LOGS ---

const mockUpcomingClass = {
  id: "lc-1",
  subject: "Advanced Mathematics - Algebra",
  date: "Today",
  time: "14:30", // 2:30 PM
  enrolled: 124,
  isLaunchable: true // Simulating it's within 15 mins
};

const mockDoubts = [
  { id: "d1", student: "Arjun Sharma", question: "In Q14 of the Geometry mock test, why do we use the sine rule instead of cosine rule?", time: "2 hours ago" },
  { id: "d2", student: "Riya Verma", question: "Can you explain the last step of the chemical balancing equation from yesterday's notes?", time: "5 hours ago" },
  { id: "d3", student: "Karan Singh", question: "I don't understand how the AI arrived at this conclusion for the logic puzzle.", time: "1 day ago" },
];

const mockAiLog = [
  { action: "AI generated 12 questions for Chapter 4", time: "2 hours ago" },
  { action: "Summary generated for Chapter 2", time: "Yesterday" },
  { action: "AI answered 45 student doubts automatically", time: "This week" },
];

const mockActivityData = [
  { day: "Mon", count: 420 },
  { day: "Tue", count: 580 },
  { day: "Wed", count: 610 },
  { day: "Thu", count: 590 },
  { day: "Fri", count: 750 },
  { day: "Sat", count: 820 },
  { day: "Sun", count: 856 },
];

export default function TrainerDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    contentItems: 142,
    contentTrend: 12,
    totalQuestions: 2450,
    questionsTrend: 8,
    activeStudents: 856,
    studentsTrend: -3,
    pendingDoubts: 5,
    doubtsTrend: 2,
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      const { count: contentCount } = await supabase.from('study_materials').select('*', { count: 'exact', head: true });
      const { count: questionsCount } = await supabase.from('questions').select('*', { count: 'exact', head: true });
      const { count: studentsCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
      
      if (isMounted) {
        setStats(prev => ({
          ...prev,
          contentItems: contentCount || prev.contentItems,
          totalQuestions: questionsCount || prev.totalQuestions,
          activeStudents: studentsCount || prev.activeStudents,
        }));
        setIsLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscriptions
    const materialsSub = supabase.channel('trainer-materials-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_materials' }, () => { fetchStats(); })
      .subscribe();

    const questionsSub = supabase.channel('trainer-questions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, () => { fetchStats(); })
      .subscribe();

    const studentsSub = supabase.channel('trainer-students-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => { fetchStats(); })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(materialsSub);
      supabase.removeChannel(questionsSub);
      supabase.removeChannel(studentsSub);
    };
  }, []);

  return (
    <DashboardLayout 
      role="trainer" 
      userName="Rahul Singh" 
      userDescription="Senior Faculty"
    >
      <div className="pb-24 font-sans animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your platform activity, classes, and pending doubts.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/trainer/classes" className="flex items-center gap-2 px-5 py-2.5 bg-[#5C3D99] text-white rounded-xl text-sm font-bold hover:bg-purple-900 transition-colors shadow-md shadow-purple-900/20">
              <Video className="w-4 h-4" /> Schedule Class
            </Link>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <Link href="/dashboard/trainer/materials" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#5C3D99]/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 text-[#5C3D99] group-hover:bg-[#5C3D99] group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stats.contentTrend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stats.contentTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stats.contentTrend)}%
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900">{stats.contentItems}</p>
              <p className="text-sm font-semibold text-gray-500 mt-1">Published Content</p>
            </div>
          </Link>

          <Link href="/dashboard/trainer/questions" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#5C3D99]/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 group-hover:bg-[#5C3D99] group-hover:text-white transition-colors">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stats.questionsTrend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stats.questionsTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stats.questionsTrend)}%
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900">{stats.totalQuestions}</p>
              <p className="text-sm font-semibold text-gray-500 mt-1">Total Questions</p>
            </div>
          </Link>

          <Link href="/dashboard/trainer/students" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#5C3D99]/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 group-hover:bg-[#5C3D99] group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stats.studentsTrend >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stats.studentsTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stats.studentsTrend)}%
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900">{stats.activeStudents}</p>
              <p className="text-sm font-semibold text-gray-500 mt-1">Active Students</p>
            </div>
          </Link>

          <Link href="/dashboard/trainer/doubts" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#5C3D99]/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50 text-orange-600 group-hover:bg-[#5C3D99] group-hover:text-white transition-colors relative">
                <MessageSquare className="w-6 h-6" />
                {stats.pendingDoubts > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${stats.doubtsTrend <= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {stats.doubtsTrend <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {Math.abs(stats.doubtsTrend)}%
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900">{stats.pendingDoubts}</p>
              <p className="text-sm font-semibold text-gray-500 mt-1">Pending Doubts</p>
            </div>
          </Link>

        </div>

        {/* --- QUICK ACTION BAR --- */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <Link href="/dashboard/trainer/materials" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold transition-colors">
              <UploadCloud className="w-5 h-5" /> + Upload Content
            </Link>
            <Link href="/dashboard/trainer/questions" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold transition-colors">
              <HelpCircle className="w-5 h-5" /> + Add Questions
            </Link>
            <Link href="/dashboard/trainer/classes" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold transition-colors">
              <Calendar className="w-5 h-5" /> Schedule Class
            </Link>
            <Link href="/dashboard/trainer/exams" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-bold transition-colors">
              <FileText className="w-5 h-5" /> Create Exam
            </Link>
          </div>
        </div>

        {/* --- MAIN DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Live Class Panel */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
               {/* Background Elements */}
               <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full"></div>
               <div className="absolute top-10 right-10 opacity-10">
                 <Video className="w-32 h-32" />
               </div>

               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                   <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     Next Session
                   </span>
                 </div>
                 
                 {mockUpcomingClass ? (
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                     <div>
                       <h3 className="text-2xl md:text-3xl font-black mb-2">{mockUpcomingClass.subject}</h3>
                       <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium">
                         <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4"/> {mockUpcomingClass.date} at {mockUpcomingClass.time}</span>
                         <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg"><Users className="w-4 h-4"/> {mockUpcomingClass.enrolled} Enrolled</span>
                       </div>
                     </div>
                     <button 
                       disabled={!mockUpcomingClass.isLaunchable}
                       className={`px-8 py-4 rounded-xl font-extrabold flex items-center gap-2 shrink-0 transition-all ${mockUpcomingClass.isLaunchable ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                     >
                       <PlayCircle className="w-5 h-5" />
                       Launch Class
                     </button>
                   </div>
                 ) : (
                   <div className="text-center py-8">
                     <p className="text-slate-400 font-medium mb-4">No classes scheduled. Schedule a live class to engage your students.</p>
                     <Link href="/dashboard/trainer/classes" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">
                       Schedule Class
                     </Link>
                   </div>
                 )}
               </div>
            </div>

            {/* Student Activity Widget */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
               <div className="flex items-center justify-between mb-8">
                 <div>
                   <h3 className="text-lg font-black text-gray-900">Student Activity</h3>
                   <p className="text-sm text-gray-500 font-medium">Daily active students over the last 7 days.</p>
                 </div>
                 <div className="p-3 bg-gray-50 rounded-xl">
                   <BarChart3 className="w-6 h-6 text-gray-400" />
                 </div>
               </div>

               {/* Custom Bar Chart */}
               <div className="h-48 flex items-end justify-between gap-2 md:gap-4">
                 {mockActivityData.map((data, idx) => {
                   // Max count is around 900 for percentage calculation
                   const heightPct = (data.count / 900) * 100;
                   return (
                     <div key={idx} className="flex flex-col items-center flex-1 group">
                       <div className="relative w-full flex justify-center h-full items-end pb-2">
                         {/* Tooltip */}
                         <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-md pointer-events-none">
                           {data.count}
                         </div>
                         {/* Bar */}
                         <div 
                           className="w-full max-w-[40px] bg-purple-100 group-hover:bg-purple-200 rounded-t-xl transition-all relative overflow-hidden"
                           style={{ height: `${heightPct}%` }}
                         >
                           {/* Gradient overlay for the top part */}
                           <div className="absolute inset-x-0 top-0 h-4 bg-purple-500/20"></div>
                         </div>
                       </div>
                       <span className="text-xs font-bold text-gray-400 uppercase">{data.day}</span>
                     </div>
                   );
                 })}
               </div>
            </div>

          </div>

          {/* Right Column (Narrower) */}
          <div className="space-y-8">
            
            {/* Recent Doubts Panel */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full max-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" /> Doubts Queue
                </h3>
                {stats.pendingDoubts > 0 && (
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                    {stats.pendingDoubts} Pending
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {mockDoubts.length > 0 ? (
                  mockDoubts.map((doubt) => (
                    <div key={doubt.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">{doubt.student}</span>
                        <span className="text-xs font-medium text-gray-400">{doubt.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">{doubt.question}</p>
                      <Link 
                        href="/dashboard/trainer/doubts"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        Reply to Student <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-10">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="text-gray-500 font-medium">No pending doubts.<br/>Students are all caught up!</p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <Link href="/dashboard/trainer/doubts" className="w-full block text-center py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors">
                  View All Doubts
                </Link>
              </div>
            </div>

            {/* AI Activity Log */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-blue-100/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-black text-gray-900">AI Activity</h3>
              </div>

              <div className="space-y-4">
                {mockAiLog.map((log, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{log.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
