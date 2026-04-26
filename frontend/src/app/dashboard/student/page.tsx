"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, ClipboardList, Calendar, Sparkles, TrendingUp,
  Award, CheckSquare, Clock, Video, ArrowRight, Play, CheckCircle2, History, FileText
} from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function StudentDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Mock Data aligned with S-02 specifications
  const userName = "Arjun";
  const userInitial = "A";
  
  const isFirstLogin = false; // toggle for testing
  
  const [stats, setStats] = useState({
    subjectsEnrolled: 4,
    practiceTests: 12,
    examRank: 42 as number | string,
    attendance: 94
  });

  useEffect(() => {
    setMounted(true);
    let isMounted = true;
    
    const fetchStats = async () => {
      const { count: subjectsCount } = await supabase.from('subjects').select('*', { count: 'exact', head: true });
      const { count: practiceCount } = await supabase.from('tests').select('*', { count: 'exact', head: true });
      const { count: resultsCount } = await supabase.from('results').select('*', { count: 'exact', head: true });

      if (isMounted) {
        setStats(prev => ({
          ...prev,
          subjectsEnrolled: subjectsCount || prev.subjectsEnrolled,
          practiceTests: practiceCount || prev.practiceTests,
          examRank: resultsCount ? Math.max(1, 42 - resultsCount) : prev.examRank,
        }));
      }
    };

    fetchStats();

    const subjectsSub = supabase.channel('student-subjects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subjects' }, () => { fetchStats(); })
      .subscribe();

    const testsSub = supabase.channel('student-tests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tests' }, () => { fetchStats(); })
      .subscribe();

    const resultsSub = supabase.channel('student-results-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'results' }, () => { fetchStats(); })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subjectsSub);
      supabase.removeChannel(testsSub);
      supabase.removeChannel(resultsSub);
    };
  }, []);

  const upcomingExam = isFirstLogin ? null : {
    name: "National Math Olympiad",
    subject: "Mathematics",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    id: 101
  };

  const liveClass = isFirstLogin ? null : {
    trainerName: "Mr. Sharma",
    subject: "Advanced Algebra",
    time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    id: 201
  };

  const pendingPractice = isFirstLogin ? [] : [
    { id: 301, title: "Math Mock Test 4", subject: "Mathematics" },
    { id: 302, title: "Science Chapter 3", subject: "Science" }
  ];

  const recentActivity = isFirstLogin ? [] : [
    { id: 1, action: "Completed Chapter 3 notes", time: "2 hours ago", type: "material", link: "/dashboard/student/materials" },
    { id: 2, action: "Scored 78% on Mock 2", time: "Yesterday", type: "test", link: "/dashboard/student/results" },
    { id: 3, action: "Attended Physics Live Class", time: "2 days ago", type: "class", link: "/dashboard/student/classes" }
  ];

  // Helper to determine border color for exam
  const getExamBorderColor = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 48) return "border-red-500 shadow-red-500/20";
    if (hours < 7 * 24) return "border-orange-500 shadow-orange-500/20";
    return "border-blue-500 shadow-blue-500/20";
  };

  const getExamTimerString = (date: Date) => {
    const diff = Math.max(0, date.getTime() - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} Days to go`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} Hours to go`;
  };

  // Helper to check if class is joinable (< 10 mins)
  const isClassJoinable = (date: Date) => {
    const diffMins = (date.getTime() - Date.now()) / (1000 * 60);
    return diffMins <= 10 && diffMins > -60; // Assuming class lasts an hour
  };

  return (
    <DashboardLayout 
      role="student" 
      userName="Arjun Sharma" 
      userDescription="Class 8 • Delhi Public School"
      studentPendingPracticeCount={pendingPractice.length}
    >
      <div className="pb-12 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good morning, {userName}!</h1>
            <p className="text-sm text-gray-500 mt-1">
              {isFirstLogin ? "Start by exploring the Content Library." : upcomingExam ? `You have 1 exam in ${mounted ? Math.floor((upcomingExam.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : '...'} days.` : "No exams scheduled. Keep practising!"}
            </p>
          </div>
          {!isFirstLogin && upcomingExam && (
            <div className="flex items-center gap-3">
              <Link href={`/dashboard/student/practice?subject=${upcomingExam.subject}`} className="flex items-center gap-2 px-5 py-2.5 bg-[#0D7377] text-white rounded-xl text-sm font-bold hover:bg-teal-800 transition-colors shadow-md shadow-teal-700/20">
                <ArrowRight className="w-4 h-4" /> Prepare Now
              </Link>
            </div>
          )}
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <Link href="/dashboard/student/materials" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#0D7377]/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 group-hover:bg-[#0D7377] group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">{stats.subjectsEnrolled}</p>
                <p className="text-sm font-semibold text-gray-500 mt-1">Subjects Enrolled</p>
              </div>
           </Link>
           
           <Link href="/dashboard/student/practice" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#0D7377]/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600 group-hover:bg-[#0D7377] group-hover:text-white transition-colors">
                  <CheckSquare className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">{stats.practiceTests}</p>
                <p className="text-sm font-semibold text-gray-500 mt-1">Practice Tests</p>
              </div>
           </Link>
           
           <Link href="/dashboard/student/results" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#0D7377]/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600 group-hover:bg-[#0D7377] group-hover:text-white transition-colors">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">{stats.examRank === "-" ? "-" : `#${stats.examRank}`}</p>
                <p className="text-sm font-semibold text-gray-500 mt-1">Exam Rank</p>
              </div>
           </Link>
           
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#0D7377]/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 group-hover:bg-[#0D7377] group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">{stats.attendance}%</p>
                <p className="text-sm font-semibold text-gray-500 mt-1">Attendance</p>
              </div>
           </div>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left Column (Exam, Quick Access, Pending) */}
           <div className="lg:col-span-7 space-y-8">
              
              {/* Upcoming Exam */}
              <section>
                 <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Award className="w-6 h-6 text-teal-600"/> Upcoming Exam</h2>
                 {upcomingExam ? (
                   <div className={`bg-white rounded-3xl p-6 sm:p-8 border-2 ${getExamBorderColor(upcomingExam.date)} relative overflow-hidden group`}>
                     <div className="absolute -right-10 -top-10 w-48 h-48 bg-orange-50 rounded-full blur-3xl -z-10 group-hover:bg-orange-100 transition-colors"></div>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                           <div className="bg-orange-100 text-orange-800 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest w-fit mb-4 flex items-center gap-1.5">
                             <Clock className="w-3.5 h-3.5" />
                             {mounted ? getExamTimerString(upcomingExam.date) : 'Loading...'}
                           </div>
                           <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">{upcomingExam.name}</h3>
                           <p className="text-gray-500 font-medium flex items-center gap-2 text-sm sm:text-base">
                             <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-bold">{upcomingExam.subject}</span>
                             <span>•</span>
                             <span>{upcomingExam.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                           </p>
                        </div>
                        <Link href={`/dashboard/student/practice?subject=${upcomingExam.subject}`} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-center transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 shrink-0 flex items-center justify-center gap-2">
                          Prepare Now <ArrowRight className="w-4 h-4"/>
                        </Link>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-10 text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Award className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">No exams scheduled</h3>
                      <p className="text-gray-500 font-medium mt-1">Keep practising to stay sharp!</p>
                   </div>
                 )}
              </section>

              {/* Pending Practice */}
              <section>
                 <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckSquare className="w-6 h-6 text-teal-600"/> Pending Practice</h2>
                 {pendingPractice.length > 0 ? (
                   <div className="bg-white border border-gray-200 rounded-3xl p-2 shadow-sm">
                      <div className="space-y-1">
                        {pendingPractice.map((practice, idx) => (
                          <div key={practice.id} className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                             <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100">
                                 <FileText className="w-6 h-6" />
                               </div>
                               <div>
                                 <h4 className="font-bold text-gray-900 text-base">{practice.title}</h4>
                                 <p className="text-sm text-gray-500 font-medium">{practice.subject}</p>
                               </div>
                             </div>
                             <Link href={`/dashboard/student/take-test/${practice.id}`} className="bg-white border border-teal-200 hover:bg-teal-50 hover:border-teal-300 text-teal-700 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm shrink-0">
                               Start
                             </Link>
                          </div>
                        ))}
                      </div>
                   </div>
                 ) : (
                   <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex items-center gap-5">
                     <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-8 h-8" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-emerald-900">You are all caught up!</h3>
                       <p className="text-emerald-700 font-medium">No pending practice papers. Great job.</p>
                     </div>
                   </div>
                 )}
              </section>

              {/* Quick Access Tiles (2x2 Grid) */}
              <section>
                 <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="w-6 h-6 text-teal-600"/> Quick Access</h2>
                 <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <Link href="/dashboard/student/materials" className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col items-center justify-center text-center group">
                       <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-blue-100">
                          <BookOpen className="w-8 h-8" />
                       </div>
                       <h4 className="font-bold text-gray-900">Content Library</h4>
                    </Link>
                    <Link href="/dashboard/student/practice" className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/10 transition-all flex flex-col items-center justify-center text-center group">
                       <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-teal-100">
                          <ClipboardList className="w-8 h-8" />
                       </div>
                       <h4 className="font-bold text-gray-900">Practice Tests</h4>
                    </Link>
                    <Link href="/dashboard/student/exams" className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all flex flex-col items-center justify-center text-center group">
                       <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-purple-100">
                          <Calendar className="w-8 h-8" />
                       </div>
                       <h4 className="font-bold text-gray-900">My Exams</h4>
                    </Link>
                    <Link href="/dashboard/student/doubts" className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 sm:p-8 rounded-3xl hover:shadow-xl hover:shadow-amber-500/20 transition-all flex flex-col items-center justify-center text-center group relative overflow-hidden">
                       <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-200 to-amber-100 text-amber-800 text-[10px] font-black px-3 py-1.5 rounded-bl-2xl uppercase tracking-wider">Ask AI</div>
                       <div className="w-16 h-16 bg-white text-amber-500 rounded-full flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 shadow-md border border-amber-100">
                          <Sparkles className="w-8 h-8" />
                       </div>
                       <h4 className="font-bold text-amber-900">Doubt Chat</h4>
                    </Link>
                 </div>
              </section>

           </div>

           {/* Right Column (Live Class, Recent Activity) */}
           <div className="lg:col-span-5 space-y-8">
              
              {/* Live Class Card */}
              <section>
                 <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Video className="w-6 h-6 text-teal-600"/> Next Live Class</h2>
                 {liveClass ? (
                   <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-purple-500/40 rounded-full blur-3xl group-hover:bg-purple-500/50 transition-colors"></div>
                      <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-blue-500/40 rounded-full blur-3xl group-hover:bg-blue-500/50 transition-colors"></div>
                      
                      <div className="relative z-10">
                         <div className="bg-white/10 w-fit backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border border-white/10">
                           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                           Live Session
                         </div>

                         <div className="flex items-start gap-4 mb-8">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shrink-0 backdrop-blur-sm">
                               <Video className="w-7 h-7 text-white" />
                            </div>
                            <div>
                               <h3 className="font-extrabold text-xl mb-1">{liveClass.subject}</h3>
                               <p className="text-gray-300 font-medium">with {liveClass.trainerName}</p>
                            </div>
                         </div>
                         
                         <div className="bg-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between backdrop-blur-md border border-white/10 mb-6">
                            <div className="flex items-center gap-3">
                               <Clock className="w-6 h-6 text-purple-300" />
                               <div>
                                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Scheduled For</p>
                                  <p className="font-bold text-lg">{liveClass.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                               </div>
                            </div>
                         </div>

                         <button 
                           className={`w-full py-4 rounded-2xl font-bold flex justify-center items-center gap-2 transition-all shadow-xl ${
                             (mounted && isClassJoinable(liveClass.time))
                               ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1' 
                               : 'bg-white/5 text-gray-400 cursor-not-allowed border border-white/10'
                           }`}
                           disabled={!mounted || !isClassJoinable(liveClass.time)}
                           onClick={() => window.open(`/dashboard/student/live-class/${liveClass.id}`, '_blank')}
                         >
                           {mounted ? (
                             isClassJoinable(liveClass.time) ? (
                               <><Play className="w-5 h-5 fill-current" /> Join Class Now</>
                             ) : (
                               'Join active ' + Math.ceil(Math.abs((liveClass.time.getTime() - Date.now()) / (1000 * 60))) + ' mins prior'
                             )
                           ) : (
                             'Loading...'
                           )}
                         </button>
                      </div>
                   </div>
                 ) : (
                   <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-10 text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Video className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">No upcoming classes</h3>
                      <p className="text-gray-500 font-medium mt-1">Check back later for new schedules.</p>
                   </div>
                 )}
              </section>

              {/* Recent Activity */}
              <section>
                 <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><History className="w-6 h-6 text-teal-600"/> Recent Activity</h2>
                 <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                   {recentActivity.length > 0 ? (
                     <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-2">
                       {recentActivity.map((activity, idx) => (
                         <div key={activity.id} className="relative pl-8">
                           <div className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                             activity.type === 'test' ? 'bg-amber-400' : activity.type === 'material' ? 'bg-blue-400' : 'bg-purple-400'
                           }`}></div>
                           <Link href={activity.link} className="block group">
                             <h4 className="font-bold text-gray-900 text-base group-hover:text-teal-600 transition-colors">{activity.action}</h4>
                             <p className="text-sm text-gray-500 font-medium mt-1.5">{activity.time}</p>
                           </Link>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <History className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No recent activity yet.</p>
                     </div>
                   )}
                 </div>
              </section>

           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
